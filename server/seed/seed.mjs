/**
 * Database Seed Script for SkillsHub
 * Populates 50 categories and 500 skills
 * Run: node server/seed/seed.mjs
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);

  // Categories
  const categories = [
    { name: "Web Development", slug: "web-development", icon: "Globe", description: "Frontend and backend web development skills including React, Vue, Node.js, and full-stack frameworks" },
    { name: "App Development", slug: "app-development", icon: "Smartphone", description: "Mobile and desktop application development for iOS, Android, and cross-platform solutions" },
    { name: "Office Productivity", slug: "office-productivity", icon: "FileSpreadsheet", description: "Office automation, document processing, spreadsheet analysis, and presentation creation" },
    { name: "Video Production", slug: "video-production", icon: "Video", description: "Video editing, motion graphics, color grading, and post-production workflows" },
    { name: "Image Creation", slug: "image-creation", icon: "Image", description: "Image generation, editing, graphic design, and visual content creation with AI" },
    { name: "Academic Writing", slug: "academic-writing", icon: "GraduationCap", description: "Research paper writing, thesis formatting, literature reviews, and academic publishing" },
    { name: "Official Document Writing", slug: "official-document-writing", icon: "FileText", description: "Government documents, official reports, policy drafting, and regulatory compliance writing" },
    { name: "Legal Domain", slug: "legal-domain", icon: "Scale", description: "Legal document drafting, contract analysis, compliance checking, and case research" },
    { name: "Animation Production", slug: "animation-production", icon: "Clapperboard", description: "2D/3D animation, character design, storyboarding, and motion capture workflows" },
    { name: "Entrepreneurship", slug: "entrepreneurship", icon: "Rocket", description: "Business planning, pitch decks, market analysis, and startup growth strategies" },
    { name: "Data Science", slug: "data-science", icon: "BarChart3", description: "Data analysis, visualization, statistical modeling, and business intelligence" },
    { name: "DevOps & Cloud", slug: "devops-cloud", icon: "Cloud", description: "CI/CD pipelines, container orchestration, cloud infrastructure, and site reliability engineering" },
    { name: "Cybersecurity", slug: "cybersecurity", icon: "Shield", description: "Security auditing, penetration testing, threat modeling, and incident response" },
    { name: "UI/UX Design", slug: "ui-ux-design", icon: "Palette", description: "User interface design, user experience research, prototyping, and design systems" },
    { name: "Marketing & SEO", slug: "marketing-seo", icon: "TrendingUp", description: "Digital marketing, search engine optimization, content strategy, and social media management" },
    { name: "E-commerce", slug: "e-commerce", icon: "ShoppingCart", description: "Online store setup, product management, payment integration, and conversion optimization" },
    { name: "Game Development", slug: "game-development", icon: "Gamepad2", description: "Game design, Unity/Unreal development, game mechanics, and multiplayer systems" },
    { name: "Education & Training", slug: "education-training", icon: "BookOpen", description: "Course creation, e-learning platforms, assessment design, and educational content" },
    { name: "Healthcare & Medical", slug: "healthcare-medical", icon: "Heart", description: "Medical documentation, clinical decision support, patient management, and health informatics" },
    { name: "Finance & Accounting", slug: "finance-accounting", icon: "DollarSign", description: "Financial analysis, accounting automation, tax preparation, and investment strategies" },
    { name: "Content Creation", slug: "content-creation", icon: "PenTool", description: "Blog writing, social media content, copywriting, and multimedia content production" },
    { name: "Translation & Localization", slug: "translation-localization", icon: "Languages", description: "Multi-language translation, cultural adaptation, localization testing, and terminology management" },
    { name: "Customer Service", slug: "customer-service", icon: "Headphones", description: "Chatbot development, ticket management, customer feedback analysis, and support automation" },
    { name: "Supply Chain & Logistics", slug: "supply-chain-logistics", icon: "Truck", description: "Inventory management, route optimization, warehouse automation, and demand forecasting" },
    { name: "Quality Assurance", slug: "quality-assurance", icon: "CheckCircle", description: "Test automation, quality metrics, bug tracking, and continuous testing strategies" },
    { name: "Database Management", slug: "database-management", icon: "Database", description: "Schema design, query optimization, migration planning, and database administration" },
    { name: "API Development", slug: "api-development", icon: "Plug", description: "RESTful API design, GraphQL development, API documentation, and integration patterns" },
    { name: "Machine Learning", slug: "machine-learning", icon: "Brain", description: "ML model training, deployment, experiment tracking, and MLOps workflows" },
    { name: "NLP", slug: "nlp", icon: "MessageSquare", description: "Natural language processing, text analysis, chatbots, and language model fine-tuning" },
    { name: "Computer Vision", slug: "computer-vision", icon: "Eye", description: "Image recognition, object detection, video analytics, and visual AI applications" },
    { name: "Blockchain & Web3", slug: "blockchain-web3", icon: "Link", description: "Smart contracts, DeFi protocols, NFT development, and decentralized applications" },
    { name: "IoT & Embedded", slug: "iot-embedded", icon: "Cpu", description: "IoT device programming, sensor integration, embedded systems, and edge computing" },
    { name: "Project Management", slug: "project-management", icon: "ClipboardList", description: "Agile planning, resource allocation, risk management, and team coordination" },
    { name: "Human Resources", slug: "human-resources", icon: "Users", description: "Recruitment automation, employee management, performance reviews, and HR analytics" },
    { name: "Real Estate", slug: "real-estate", icon: "Building", description: "Property listing, market analysis, mortgage calculations, and real estate investment" },
    { name: "Automotive", slug: "automotive", icon: "Car", description: "Vehicle diagnostics, fleet management, autonomous driving, and automotive engineering" },
    { name: "Agriculture", slug: "agriculture", icon: "Leaf", description: "Crop management, precision farming, livestock monitoring, and agricultural analytics" },
    { name: "Music Production", slug: "music-production", icon: "Music", description: "Music composition, audio engineering, beat making, and podcast production" },
    { name: "Fashion & Textile", slug: "fashion-textile", icon: "Shirt", description: "Fashion design, trend analysis, textile patterns, and e-commerce merchandising" },
    { name: "Fitness & Sports", slug: "fitness-sports", icon: "Dumbbell", description: "Workout planning, nutrition tracking, sports analytics, and fitness coaching" },
    { name: "Travel & Hospitality", slug: "travel-hospitality", icon: "Plane", description: "Trip planning, hotel management, restaurant recommendations, and travel logistics" },
    { name: "Sustainability", slug: "sustainability", icon: "TreePine", description: "Carbon footprint analysis, ESG reporting, renewable energy, and environmental impact assessment" },
    { name: "Language Learning", slug: "language-learning", icon: "BookA", description: "Vocabulary building, grammar practice, conversation simulation, and exam preparation" },
    { name: "Architecture & Interior Design", slug: "architecture-design", icon: "Ruler", description: "Floor planning, interior styling, construction estimation, and 3D visualization" },
    { name: "Photography", slug: "photography", icon: "Camera", description: "Photo editing, composition guidance, lighting techniques, and portfolio management" },
    { name: "Journalism & Media", slug: "journalism-media", icon: "Newspaper", description: "News writing, fact-checking, media analysis, and editorial workflow automation" },
    { name: "Non-profit & Social Impact", slug: "nonprofit-social", icon: "HandHeart", description: "Grant writing, donor management, impact measurement, and volunteer coordination" },
    { name: "Manufacturing", slug: "manufacturing", icon: "Factory", description: "Production planning, quality control, process optimization, and industrial automation" },
    { name: "Telecommunications", slug: "telecommunications", icon: "Radio", description: "Network planning, spectrum management, 5G deployment, and telecom analytics" },
    { name: "Personal Development", slug: "personal-development", icon: "Sparkles", description: "Goal setting, habit tracking, mindfulness, and personal productivity optimization" },
  ];

  console.log('Seeding categories...');
  // Build slug->id map
  const slugToId = {};
  for (const cat of categories) {
    const [result] = await connection.execute(
      `INSERT INTO categories (name, slug, icon, description, skillCount) VALUES (?, ?, ?, ?, 10) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon)`,
      [cat.name, cat.slug, cat.icon, cat.description]
    );
    // Get the ID
    const [rows] = await connection.execute(`SELECT id FROM categories WHERE slug = ?`, [cat.slug]);
    if (rows.length > 0) {
      slugToId[cat.slug] = rows[0].id;
    }
  }
  console.log(`Seeded ${categories.length} categories, mapped ${Object.keys(slugToId).length} IDs`);

  // Load skill batches
  console.log('Loading skill data...');
  const { SKILLS_BATCH_1 } = await import('./skills-data-compiled-1.mjs');
  const { SKILLS_BATCH_2 } = await import('./skills-data-compiled-2.mjs');
  const { SKILLS_BATCH_3 } = await import('./skills-data-compiled-3.mjs');
  const { SKILLS_BATCH_4 } = await import('./skills-data-compiled-4.mjs');
  const { SKILLS_BATCH_5 } = await import('./skills-data-5.mjs');

  const allSkills = [...SKILLS_BATCH_1, ...SKILLS_BATCH_2, ...SKILLS_BATCH_3, ...SKILLS_BATCH_4, ...SKILLS_BATCH_5];
  console.log(`Total skills to seed: ${allSkills.length}`);

  function generateReadme(skill) {
    return `# ${skill.name}

> ${skill.description}

## Overview

${skill.name} is a powerful ${skill.type} skill designed to help developers and professionals streamline their workflows. Built with best practices and production-ready patterns.

## Features

- **Intelligent Processing**: Leverages AI to understand context and deliver accurate results
- **Customizable Parameters**: Fine-tune behavior with comprehensive configuration options
- **Production Ready**: Battle-tested with error handling, logging, and monitoring
- **Easy Integration**: Simple API with comprehensive documentation

## Quick Start

\`\`\`bash
# Install via SkillsHub CLI
skillshub install ${skill.author}/${skill.slug}

# Or use the API directly
curl -X POST https://api.skillshub.dev/v1/skills/${skill.author}/${skill.slug}/run \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "your input here"}'
\`\`\`

## Usage

\`\`\`python
from skillshub import Skill

skill = Skill.load("${skill.author}/${skill.slug}")
result = skill.run(input_data={
    "query": "example input",
    "options": {
        "mode": "advanced",
        "format": "json"
    }
})
print(result.output)
\`\`\`

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`mode\` | string | \`"standard"\` | Processing mode (standard, advanced, expert) |
| \`format\` | string | \`"json"\` | Output format (json, markdown, text) |
| \`max_tokens\` | number | \`2048\` | Maximum output token length |
| \`temperature\` | number | \`0.7\` | Creativity level (0.0-1.0) |

## Tags

${skill.tags.map(t => '`' + t + '`').join(' ')}

## License

MIT License - Free for personal and commercial use.
`;
  }

  console.log('Seeding skills...');
  let count = 0;
  let errors = 0;
  for (const skill of allSkills) {
    try {
      const categoryId = slugToId[skill.category] || null;
      await connection.execute(
        `INSERT INTO skills (name, slug, author, type, description, categoryId, downloads, likes, stars, tags, readme, isPublic, isFeatured, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW()) 
         ON DUPLICATE KEY UPDATE downloads=VALUES(downloads), likes=VALUES(likes)`,
        [
          skill.name, skill.slug, skill.author, skill.type, skill.description,
          categoryId, skill.downloads, skill.likes, skill.stars,
          JSON.stringify(skill.tags),
          generateReadme(skill),
          Math.random() > 0.85 ? 1 : 0
        ]
      );
      count++;
      if (count % 50 === 0) {
        console.log(`  Seeded ${count}/${allSkills.length} skills...`);
      }
    } catch (e) {
      errors++;
      if (errors <= 3) {
        console.log(`Skill ${skill.slug} error:`, e.message?.substring(0, 120));
      }
    }
  }

  console.log(`\nDone! Seeded ${categories.length} categories and ${count} skills (${errors} errors).`);
  await connection.end();
  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
