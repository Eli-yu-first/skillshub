import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const conn = await mysql.createConnection(DATABASE_URL);

// Check existing data
const [existingFiles] = await conn.query("SELECT COUNT(*) as cnt FROM skill_files");
const [existingCommits] = await conn.query("SELECT COUNT(*) as cnt FROM skill_commits");
console.log(`Existing: ${existingFiles[0].cnt} files, ${existingCommits[0].cnt} commits`);

if (existingFiles[0].cnt > 0) {
  console.log("Files already exist, skipping file generation");
} else {
  console.log("📄 Batch inserting skill files...");
  const [allSkills] = await conn.query("SELECT id, name, slug, author, description, type, tags FROM skills");
  
  // Batch insert files - 50 skills at a time
  const BATCH = 50;
  for (let i = 0; i < allSkills.length; i += BATCH) {
    const batch = allSkills.slice(i, i + BATCH);
    const values = [];
    const placeholders = [];
    
    for (const skill of batch) {
      const tagsArr = typeof skill.tags === 'string' ? JSON.parse(skill.tags) : (skill.tags || []);
      const readme = `# ${skill.name}\n\n${skill.description || ''}\n\n## Features\n- Enterprise-grade capabilities\n- Customizable configuration\n- Multi-format output\n\n## Usage\n\`\`\`\nskillshub install ${skill.author}/${skill.slug}\n\`\`\``;
      const skillJson = JSON.stringify({ name: skill.name, version: "1.0.0", description: skill.description, author: skill.author, type: skill.type, tags: tagsArr, license: "MIT", main: "index.js" }, null, 2);
      const indexJs = `/**\n * ${skill.name}\n */\nexport default async function execute(input, context) {\n  const result = await context.llm.invoke({\n    messages: [{ role: "system", content: "You are a ${skill.type} assistant." }, { role: "user", content: input.prompt }]\n  });\n  return { output: result.content };\n}\n`;
      const configYaml = `name: ${skill.name}\nversion: 1.0.0\ntype: ${skill.type}\ninput:\n  - name: prompt\n    type: string\n    required: true\noutput:\n  - name: output\n    type: string\n`;
      const exampleJson = JSON.stringify({ input: { prompt: `Example usage of ${skill.name}` }, expected_output: { output: "Example result" } }, null, 2);
      const testJs = `import { describe, it, expect } from 'vitest';\nimport execute from '../index.js';\n\ndescribe('${skill.name}', () => {\n  it('should execute', async () => {\n    const r = await execute({ prompt: 'test' }, { llm: { invoke: async () => ({ content: 'ok' }) } });\n    expect(r.output).toBeDefined();\n  });\n});\n`;

      const files = [
        [skill.id, "/", "README.md", readme, readme.length, "text/markdown", 0],
        [skill.id, "/", "skill.json", skillJson, skillJson.length, "application/json", 0],
        [skill.id, "/", "index.js", indexJs, indexJs.length, "application/javascript", 0],
        [skill.id, "/", "config.yaml", configYaml, configYaml.length, "text/yaml", 0],
        [skill.id, "/", "examples", null, 0, null, 1],
        [skill.id, "/examples", "basic.json", exampleJson, exampleJson.length, "application/json", 0],
        [skill.id, "/", "tests", null, 0, null, 1],
        [skill.id, "/tests", "test.js", testJs, testJs.length, "application/javascript", 0],
      ];

      for (const f of files) {
        placeholders.push("(?, ?, ?, ?, ?, ?, ?)");
        values.push(...f);
      }
    }

    await conn.query(
      `INSERT INTO skill_files (skillId, path, name, content, size, mimeType, isDirectory) VALUES ${placeholders.join(",")}`,
      values
    );
    console.log(`  Files: ${i + batch.length}/${allSkills.length} skills processed`);
  }
}

if (existingCommits[0].cnt > 0) {
  console.log("Commits already exist, skipping commit generation");
} else {
  console.log("📜 Batch inserting commit history...");
  const [allSkills] = await conn.query("SELECT id, author FROM skills");
  const msgs = ["Initial commit", "Add README", "Update config", "Fix validation", "Add examples", "Improve error handling", "Update deps", "Add tests", "Optimize performance", "Version bump"];
  
  const BATCH = 100;
  for (let i = 0; i < allSkills.length; i += BATCH) {
    const batch = allSkills.slice(i, i + BATCH);
    const values = [];
    const placeholders = [];
    
    for (const skill of batch) {
      const numCommits = Math.floor(Math.random() * 8) + 3;
      for (let j = 0; j < numCommits; j++) {
        const hash = Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
        const daysAgo = Math.floor(Math.random() * 365);
        const date = new Date(Date.now() - daysAgo * 86400000);
        placeholders.push("(?, ?, ?, ?, ?, ?, ?)");
        values.push(skill.id, hash, msgs[j % msgs.length], skill.author, Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 30), date);
      }
    }

    await conn.query(
      `INSERT INTO skill_commits (skillId, hash, message, authorName, additions, deletions, createdAt) VALUES ${placeholders.join(",")}`,
      values
    );
    console.log(`  Commits: ${i + batch.length}/${allSkills.length} skills processed`);
  }
}

// Generate discussions
const [existingDisc] = await conn.query("SELECT COUNT(*) as cnt FROM discussions");
if (existingDisc[0].cnt === 0) {
  console.log("💬 Generating discussions...");
  const [someSkills] = await conn.query("SELECT id, name FROM skills LIMIT 100");
  const titles = ["How to configure?", "Feature request: batch processing", "Bug: edge case output", "Integration help", "Performance tips"];
  const values = [];
  const placeholders = [];
  
  for (const skill of someSkills) {
    const n = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < n; i++) {
      placeholders.push("(?, ?, ?, 'skill', ?, ?)");
      values.push(titles[i % titles.length], `Discussion about ${skill.name}.`, ['open', 'resolved', 'closed'][Math.floor(Math.random() * 3)], skill.id, Math.floor(Math.random() * 10));
    }
  }
  
  await conn.query(`INSERT INTO discussions (title, content, status, targetType, targetId, replyCount) VALUES ${placeholders.join(",")}`, values);
  console.log(`  ✅ ${someSkills.length} skills with discussions`);
}

// Final counts
const [fc] = await conn.query("SELECT COUNT(*) as cnt FROM skill_files");
const [cc] = await conn.query("SELECT COUNT(*) as cnt FROM skill_commits");
const [dc] = await conn.query("SELECT COUNT(*) as cnt FROM discussions");
console.log(`\n✅ Done! Files: ${fc[0].cnt}, Commits: ${cc[0].cnt}, Discussions: ${dc[0].cnt}`);

await conn.end();
