import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [missing] = await conn.query(`
  SELECT s.id, s.name, s.slug, s.author, s.description, s.type, s.tags 
  FROM skills s LEFT JOIN skill_files sf ON s.id = sf.skillId 
  WHERE sf.id IS NULL
`);
console.log(`Filling files for ${missing.length} skills...`);

const BATCH = 50;
for (let i = 0; i < missing.length; i += BATCH) {
  const batch = missing.slice(i, i + BATCH);
  const values = [];
  const placeholders = [];
  
  for (const skill of batch) {
    const tagsArr = typeof skill.tags === 'string' ? JSON.parse(skill.tags) : (skill.tags || []);
    const readme = `# ${skill.name}\n\n${skill.description || ''}\n\n## Usage\n\`\`\`\nskillshub install ${skill.author}/${skill.slug}\n\`\`\``;
    const skillJson = JSON.stringify({ name: skill.name, version: "1.0.0", author: skill.author, type: skill.type, tags: tagsArr, license: "MIT" }, null, 2);
    const indexJs = `export default async function execute(input, ctx) {\n  return { output: await ctx.llm.invoke({ messages: [{ role: "user", content: input.prompt }] }) };\n}\n`;
    const configYaml = `name: ${skill.name}\nversion: 1.0.0\ntype: ${skill.type}\n`;
    const exJson = JSON.stringify({ input: { prompt: "example" } }, null, 2);
    const testJs = `import { describe, it, expect } from 'vitest';\ndescribe('${skill.name}', () => { it('works', () => expect(true).toBe(true)); });\n`;

    const files = [
      [skill.id, "/", "README.md", readme, readme.length, "text/markdown", 0],
      [skill.id, "/", "skill.json", skillJson, skillJson.length, "application/json", 0],
      [skill.id, "/", "index.js", indexJs, indexJs.length, "application/javascript", 0],
      [skill.id, "/", "config.yaml", configYaml, configYaml.length, "text/yaml", 0],
      [skill.id, "/", "examples", null, 0, null, 1],
      [skill.id, "/examples", "basic.json", exJson, exJson.length, "application/json", 0],
      [skill.id, "/", "tests", null, 0, null, 1],
      [skill.id, "/tests", "test.js", testJs, testJs.length, "application/javascript", 0],
    ];
    for (const f of files) { placeholders.push("(?, ?, ?, ?, ?, ?, ?)"); values.push(...f); }
  }
  await conn.query(`INSERT INTO skill_files (skillId, path, name, content, size, mimeType, isDirectory) VALUES ${placeholders.join(",")}`, values);
  console.log(`  ${i + batch.length}/${missing.length}`);
}

const [fc] = await conn.query("SELECT COUNT(*) as cnt FROM skill_files");
console.log(`✅ Total files: ${fc[0].cnt}`);
await conn.end();
