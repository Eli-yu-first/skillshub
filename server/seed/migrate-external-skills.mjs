import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';

dotenv.config();

const REPOS_DIR = '/tmp/skills-repos';
const TARGET_DIR = path.resolve(process.cwd(), 'skills-repository');

const REPOS_TO_PROCESS = [
  { id: 'anthropics', path: 'anthropics-skills/skills', author: 'Anthropics' },
  { id: 'openai-curated', path: 'openai-skills/skills/.curated', author: 'OpenAI' },
  { id: 'openai-system', path: 'openai-skills/skills/.system', author: 'OpenAI' },
  // { id: 'vercel', path: 'vercel-skills/skills', author: 'Vercel' }, // may need custom logic
  { id: 'huggingface', path: 'huggingface-skills/skills', author: 'HuggingFace' },
  { id: 'openclaw', path: 'openclaw-skills/categories', author: 'OpenClaw', isCategoryNested: true },
  { id: 'obra', path: 'obra-superpowers/skills', author: 'Obra' }
];

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  console.log('Connected to DB');

  await fs.mkdir(TARGET_DIR, { recursive: true });

  for (const repoConfig of REPOS_TO_PROCESS) {
    const fullRepoPath = path.join(REPOS_DIR, repoConfig.path);
    try {
      const stats = await fs.stat(fullRepoPath);
      if (!stats.isDirectory()) continue;
    } catch {
      console.log(`Skipping missing repo path: ${fullRepoPath}`);
      continue;
    }

    console.log(`\nProcessing ${repoConfig.id}...`);

    let skillDirs = [];

    if (repoConfig.isCategoryNested) {
      const cats = await fs.readdir(fullRepoPath);
      for (const cat of cats) {
        const catPath = path.join(fullRepoPath, cat);
        const stat = await fs.stat(catPath);
        if (stat.isDirectory() && !cat.startsWith('.')) {
          const catSkills = await fs.readdir(catPath);
          for (const c of catSkills) {
             const cPath = path.join(catPath, c);
             if ((await fs.stat(cPath)).isDirectory() && !c.startsWith('.')) {
                skillDirs.push({ dirName: c, absolutePath: cPath, category: cat });
             } else if (c.endsWith('.md')) {
                // skill is a md file inside category
                skillDirs.push({ dirName: c.replace('.md', ''), absolutePath: cPath, isFile: true, category: cat });
             }
          }
        }
      }
    } else {
      const entries = await fs.readdir(fullRepoPath);
      for (const entry of entries) {
        const entryPath = path.join(fullRepoPath, entry);
        if (entry.startsWith('.')) continue; // ignore .system, etc. sometimes already captured
        const stat = await fs.stat(entryPath);
        if (stat.isDirectory()) {
          skillDirs.push({ dirName: entry, absolutePath: entryPath, category: null });
        } else if (entry.endsWith('.md')) {
          skillDirs.push({ dirName: entry.replace('.md', ''), absolutePath: entryPath, isFile: true, category: null });
        }
      }
    }

    let importedCount = 0;

    for (const skill of skillDirs) {
      const slug = `${repoConfig.id}-${skill.dirName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const name = skill.dirName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const author = repoConfig.author;

      const targetSkillPath = path.join(TARGET_DIR, repoConfig.id, skill.dirName);
      await fs.mkdir(targetSkillPath, { recursive: true });

      let readmeContent = '';
      let fileContents = [];

      try {
        if (skill.isFile) {
          const content = await fs.readFile(skill.absolutePath, 'utf8');
          readmeContent = content;
          const fileName = skill.dirName.endsWith('.md') ? skill.dirName : `${skill.dirName}.md`;
          fileContents.push({ path: `/${fileName}`, name: fileName, content: content });
          await fs.writeFile(path.join(targetSkillPath, fileName), content);
        } else {
           // It's a directory
           const scanDir = async (dir, rootRelativePath = '') => {
             const files = await fs.readdir(dir);
             for (const f of files) {
                if (f.startsWith('.')) continue;
                const fPath = path.join(dir, f);
                const stat = await fs.stat(fPath);
                const relPath = path.join(rootRelativePath, f);
                if (stat.isDirectory()) {
                   await fs.mkdir(path.join(targetSkillPath, relPath), { recursive: true });
                   await scanDir(fPath, relPath);
                } else {
                   const content = await fs.readFile(fPath, 'utf8');
                   if ((f.toLowerCase() === 'skill.md' || f.toLowerCase() === 'readme.md') && !readmeContent) {
                      readmeContent = content;
                   }
                   fileContents.push({ path: `/${relPath}`, name: f, content: content });
                   await fs.writeFile(path.join(targetSkillPath, relPath), content);
                }
             }
           };
           await scanDir(skill.absolutePath);
        }

        if (!readmeContent && fileContents.length > 0) {
           readmeContent = fileContents[0].content; // fallback
        }

        // DB Insert
        const [result] = await connection.execute(
            `INSERT INTO skills (name, slug, author, type, description, readme, isPublic, isFeatured, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()) 
             ON DUPLICATE KEY UPDATE readme=VALUES(readme)`,
            [
              name, slug, author, 'prompt', 
              `Imported from ${repoConfig.author} repository.`, 
              readmeContent || 'No README provided.', 
              1, 0
            ]
        );
        
        let insertedSkillId = null;
        if (result.insertId) {
            insertedSkillId = result.insertId;
        } else {
            const [rows] = await connection.execute(`SELECT id FROM skills WHERE slug = ?`, [slug]);
            if (rows.length > 0) insertedSkillId = rows[0].id;
        }

        if (insertedSkillId) {
            // Delete old files
            await connection.execute(`DELETE FROM skill_files WHERE skillId = ?`, [insertedSkillId]);
            
            // Insert new files
            for (const fc of fileContents) {
               await connection.execute(
                  `INSERT INTO skill_files (skillId, path, name, content, size, isDirectory, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())`,
                  [insertedSkillId, fc.path, fc.name, fc.content, Buffer.byteLength(fc.content, 'utf8')]
               );
            }
        }

        importedCount++;
      } catch (err) {
        console.error(`Failed to process ${skill.dirName}: ${err.message}`);
      }
    }
    
    console.log(`Imported ${importedCount} skills for ${repoConfig.id}.`);
  }

  console.log('Migration Complete!');
  await connection.end();
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
