/**
 * Seed script to populate skill_files with README and file data
 * Mimics the structure of https://github.com/anthropics/skills/tree/main/skills
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);

// Get all skills
const [skills] = await conn.execute('SELECT id, name, slug, description, type, author, tags FROM skills');
console.log(`Found ${skills.length} skills to seed files for`);

// Generate README content based on skill info
function generateReadme(skill) {
  const tags = skill.tags ? (() => { try { return JSON.parse(skill.tags); } catch { return []; } })() : [];
  const tagStr = tags.length > 0 ? tags.map(t => `\`${t}\``).join(' ') : '';
  
  return `# ${skill.name}

> ${skill.description || `A ${skill.type || 'prompt'} skill for AI automation.`}

${tagStr ? `**Tags:** ${tagStr}\n` : ''}
## Overview

**${skill.name}** is a ${skill.type || 'prompt'}-type skill designed for the SkillsHub platform. It provides reusable AI capabilities that can be integrated into your workflows, agents, and automation pipelines.

### Key Features

- **Plug-and-Play**: Install and use immediately with any compatible AI model
- **Customizable**: Easily configure parameters to fit your specific use case
- **Well-Documented**: Comprehensive documentation with examples
- **Community-Tested**: Validated by the SkillsHub community

## Quick Start

### Installation

\`\`\`bash
skillshub install ${skill.author}/${skill.slug}
\`\`\`

### Basic Usage

\`\`\`yaml
# SKILL.md configuration
name: ${skill.slug}
version: 1.0.0
type: ${skill.type || 'prompt'}
author: ${skill.author}

inputs:
  - name: query
    type: string
    description: The input query to process
    required: true

outputs:
  - name: result
    type: string
    description: The processed output
\`\`\`

### Example

\`\`\`python
from skillshub import load_skill

skill = load_skill("${skill.author}/${skill.slug}")
result = skill.run(query="Hello, world!")
print(result)
\`\`\`

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`model\` | string | \`auto\` | AI model to use |
| \`temperature\` | float | \`0.7\` | Response creativity (0-1) |
| \`max_tokens\` | int | \`2048\` | Maximum output length |
| \`timeout\` | int | \`30\` | Request timeout in seconds |

## API Reference

### \`run(query, **kwargs)\`

Execute the skill with the given input.

**Parameters:**
- \`query\` (str): The input text to process
- \`context\` (str, optional): Additional context
- \`format\` (str, optional): Output format (text, json, markdown)

**Returns:** \`SkillResult\` object with the processed output

## Compatibility

| Model | Status | Notes |
|-------|--------|-------|
| GPT-4o | ✅ Supported | Recommended |
| Claude 3.5 Sonnet | ✅ Supported | Best for complex tasks |
| DeepSeek V3 | ✅ Supported | Cost-effective |
| Llama 3.1 | ⚠️ Partial | May need prompt adjustments |

## Contributing

Contributions are welcome! Please read our [Contributing Guide](https://skillshub.dev/docs/contributing) before submitting a PR.

1. Fork this skill
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

*Built with ❤️ for the SkillsHub community by ${skill.author}*
`;
}

// Generate SKILL.md content
function generateSkillMd(skill) {
  return `---
name: ${skill.slug}
version: 1.0.0
type: ${skill.type || 'prompt'}
author: ${skill.author}
description: ${skill.description || `A ${skill.type || 'prompt'} skill`}
license: MIT
---

# ${skill.name} Configuration

## Inputs

- **query** (string, required): The main input to process
- **context** (string, optional): Additional context for better results
- **format** (string, optional): Output format preference

## Outputs

- **result** (string): The processed output
- **metadata** (object): Additional metadata about the execution

## Settings

\`\`\`yaml
model: auto
temperature: 0.7
max_tokens: 2048
\`\`\`
`;
}

// Generate index.ts content
function generateIndexTs(skill) {
  return `/**
 * ${skill.name} - Main entry point
 * Type: ${skill.type || 'prompt'}
 * Author: ${skill.author}
 */

import { SkillConfig } from '@skillshub/core';

export interface ${skill.slug.replace(/-/g, '_').replace(/(?:^|_)([a-z])/g, (_, c) => c.toUpperCase())}Input {
  query: string;
  context?: string;
  format?: 'text' | 'json' | 'markdown';
}

export interface ${skill.slug.replace(/-/g, '_').replace(/(?:^|_)([a-z])/g, (_, c) => c.toUpperCase())}Output {
  result: string;
  metadata: Record<string, unknown>;
}

export const config: SkillConfig = {
  name: '${skill.slug}',
  version: '1.0.0',
  type: '${skill.type || 'prompt'}',
  author: '${skill.author}',
};

export async function run(input: ${skill.slug.replace(/-/g, '_').replace(/(?:^|_)([a-z])/g, (_, c) => c.toUpperCase())}Input) {
  // Skill implementation
  return {
    result: \`Processed: \${input.query}\`,
    metadata: { timestamp: Date.now() },
  };
}
`;
}

// Generate LICENSE content
function generateLicense(skill) {
  return `MIT License

Copyright (c) 2025 ${skill.author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

let seeded = 0;
const BATCH_SIZE = 50;

for (let i = 0; i < skills.length; i += BATCH_SIZE) {
  const batch = skills.slice(i, i + BATCH_SIZE);
  
  for (const skill of batch) {
    // Check if files already exist
    const [existing] = await conn.execute('SELECT COUNT(*) as cnt FROM skill_files WHERE skillId = ?', [skill.id]);
    if (existing[0].cnt > 0) continue;

    const readme = generateReadme(skill);
    const skillMd = generateSkillMd(skill);
    const indexTs = generateIndexTs(skill);
    const license = generateLicense(skill);

    // Update skill's readme field
    await conn.execute('UPDATE skills SET readme = ? WHERE id = ?', [readme, skill.id]);

    // Insert files mimicking anthropics/skills structure
    const files = [
      { skillId: skill.id, path: '/', name: 'README.md', content: readme, size: Buffer.byteLength(readme), mimeType: 'text/markdown', isDirectory: false },
      { skillId: skill.id, path: '/', name: 'SKILL.md', content: skillMd, size: Buffer.byteLength(skillMd), mimeType: 'text/markdown', isDirectory: false },
      { skillId: skill.id, path: '/', name: 'index.ts', content: indexTs, size: Buffer.byteLength(indexTs), mimeType: 'text/typescript', isDirectory: false },
      { skillId: skill.id, path: '/', name: 'LICENSE', content: license, size: Buffer.byteLength(license), mimeType: 'text/plain', isDirectory: false },
      { skillId: skill.id, path: '/', name: 'tests', content: null, size: 0, mimeType: null, isDirectory: true },
      { skillId: skill.id, path: '/tests', name: 'index.test.ts', content: `import { describe, it, expect } from 'vitest';\nimport { run } from '../index';\n\ndescribe('${skill.name}', () => {\n  it('should process input correctly', async () => {\n    const result = await run({ query: 'test input' });\n    expect(result.result).toBeDefined();\n    expect(result.metadata).toBeDefined();\n  });\n});\n`, size: 200, mimeType: 'text/typescript', isDirectory: false },
      { skillId: skill.id, path: '/', name: 'examples', content: null, size: 0, mimeType: null, isDirectory: true },
      { skillId: skill.id, path: '/examples', name: 'basic.ts', content: `import { run } from '../index';\n\nasync function main() {\n  const result = await run({\n    query: 'Example query for ${skill.name}',\n    format: 'json',\n  });\n  console.log(result);\n}\n\nmain();\n`, size: 150, mimeType: 'text/typescript', isDirectory: false },
    ];

    for (const file of files) {
      await conn.execute(
        'INSERT INTO skill_files (skillId, path, name, content, size, mimeType, isDirectory) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [file.skillId, file.path, file.name, file.content, file.size, file.mimeType, file.isDirectory]
      );
    }
    seeded++;
  }
  console.log(`Seeded ${Math.min(i + BATCH_SIZE, skills.length)}/${skills.length} skills`);
}

console.log(`Done! Seeded files for ${seeded} skills`);
await conn.end();
