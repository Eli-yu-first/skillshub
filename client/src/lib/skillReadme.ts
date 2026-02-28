/**
 * Sample README content for skill detail pages
 * Each skill has a detailed README with Markdown formatting
 */

export const skillReadmes: Record<string, string> = {
  'GPT-CodeReviewer': `# GPT-CodeReviewer

> An intelligent AI-powered code review agent that provides contextual suggestions, identifies bugs, and enforces coding standards automatically.

![Code Review Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=300&fit=crop)

## Overview

GPT-CodeReviewer is an advanced AI agent that automates the code review process. It analyzes pull requests, identifies potential issues, suggests improvements, and enforces your team's coding standards — all in real-time.

### Key Features

- **Automated PR Review**: Automatically reviews pull requests when they are opened
- **Multi-Language Support**: Supports Python, JavaScript, TypeScript, Go, Rust, Java, and 20+ more languages
- **Contextual Suggestions**: Provides context-aware improvement suggestions
- **Bug Detection**: Identifies common bugs, security vulnerabilities, and performance issues
- **Style Enforcement**: Enforces coding standards and best practices
- **Learning Capability**: Adapts to your team's coding patterns over time

## Quick Start

### Installation

\`\`\`bash
# Install via SkillsHub CLI
skillshub install skillsai/GPT-CodeReviewer

# Or add to your project
npm install @skillshub/gpt-code-reviewer
\`\`\`

### Basic Usage

\`\`\`python
from skillshub import SkillClient

# Initialize the client
client = SkillClient(api_key="your-api-key")

# Load the skill
reviewer = client.load_skill("skillsai/GPT-CodeReviewer")

# Review a code snippet
result = reviewer.run({
    "code": """
    def calculate_total(items):
        total = 0
        for item in items:
            total += item['price'] * item['quantity']
        return total
    """,
    "language": "python",
    "review_type": "comprehensive"
})

print(result.suggestions)
print(result.score)
\`\`\`

### API Integration

\`\`\`javascript
// Using the REST API
const response = await fetch('https://api.skillshub.dev/v1/skills/skillsai/GPT-CodeReviewer/run', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: 'function add(a, b) { return a + b; }',
    language: 'javascript',
    review_type: 'security'
  })
});

const result = await response.json();
console.log(result);
\`\`\`

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`language\` | string | \`auto\` | Programming language (auto-detected if not specified) |
| \`review_type\` | string | \`comprehensive\` | Review type: \`comprehensive\`, \`security\`, \`performance\`, \`style\` |
| \`severity\` | string | \`medium\` | Minimum severity level: \`low\`, \`medium\`, \`high\`, \`critical\` |
| \`max_suggestions\` | number | \`10\` | Maximum number of suggestions to return |
| \`context_lines\` | number | \`3\` | Number of context lines around each issue |
| \`custom_rules\` | object | \`{}\` | Custom rules and patterns to check |

## Output Format

\`\`\`json
{
  "score": 85,
  "summary": "Overall good code quality with minor improvements suggested",
  "suggestions": [
    {
      "line": 4,
      "severity": "medium",
      "category": "performance",
      "message": "Consider using a generator expression for better memory efficiency",
      "suggested_fix": "total = sum(item['price'] * item['quantity'] for item in items)"
    }
  ],
  "metrics": {
    "complexity": 3,
    "maintainability": 88,
    "test_coverage_suggestion": true
  }
}
\`\`\`

## Supported Languages

- [x] Python
- [x] JavaScript / TypeScript
- [x] Go
- [x] Rust
- [x] Java / Kotlin
- [x] C / C++
- [x] Ruby
- [x] PHP
- [x] Swift
- [ ] Haskell (coming soon)
- [ ] Elixir (coming soon)

## Benchmarks

| Metric | GPT-CodeReviewer | CodeRabbit | Sourcery |
|--------|:----------------:|:----------:|:--------:|
| Bug Detection Rate | **94.2%** | 87.1% | 82.3% |
| False Positive Rate | **3.1%** | 8.4% | 11.2% |
| Avg Response Time | **1.2s** | 3.4s | 2.8s |
| Language Coverage | **25+** | 15 | 8 |

## Pricing

This skill is available on all SkillsHub plans:

- **Free**: 100 reviews/month
- **Pro**: 5,000 reviews/month
- **Team**: Unlimited reviews

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/skillshub/GPT-CodeReviewer/CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

*Built with ❤️ by [SkillsAI](https://skillshub.dev/skillsai)*
`,

  'DataPipeline-Builder': `# DataPipeline-Builder

> Visual data pipeline construction from natural language descriptions. Transform your data workflows with AI.

## Overview

DataPipeline-Builder converts natural language descriptions into fully functional data pipelines. Simply describe what you want to do with your data, and the tool generates the complete ETL pipeline code.

### Features

- **Natural Language to Pipeline**: Describe your pipeline in plain English
- **Visual Pipeline Editor**: Drag-and-drop pipeline builder
- **Multi-Source Support**: Connect to databases, APIs, files, and streaming sources
- **Auto-Optimization**: Automatically optimizes pipeline performance
- **Monitoring Dashboard**: Real-time pipeline monitoring and alerting

## Quick Start

\`\`\`python
from skillshub import SkillClient

client = SkillClient(api_key="your-api-key")
pipeline = client.load_skill("flowcraft/DataPipeline-Builder")

result = pipeline.run({
    "description": "Read CSV files from S3, clean missing values, aggregate by date, and write to PostgreSQL",
    "source": {"type": "s3", "bucket": "my-data", "prefix": "raw/"},
    "target": {"type": "postgresql", "table": "aggregated_data"}
})

print(result.pipeline_code)
print(result.visualization)
\`\`\`

## Supported Sources & Targets

| Type | Source | Target | Streaming |
|------|:------:|:------:|:---------:|
| PostgreSQL | ✅ | ✅ | ❌ |
| MySQL | ✅ | ✅ | ❌ |
| MongoDB | ✅ | ✅ | ❌ |
| S3 / GCS | ✅ | ✅ | ❌ |
| Kafka | ✅ | ✅ | ✅ |
| REST API | ✅ | ✅ | ❌ |
| CSV / JSON | ✅ | ✅ | ❌ |
| Parquet | ✅ | ✅ | ❌ |

## License

Apache 2.0
`,

  'SmartSummarizer-v3': `# SmartSummarizer-v3

> Multi-document summarization with citation tracking. Generate concise, accurate summaries with full source attribution.

## Overview

SmartSummarizer-v3 is an advanced summarization prompt that handles single documents, multi-document collections, and even entire knowledge bases. Every claim in the summary is linked back to its source.

### Key Capabilities

- **Multi-Document Summarization**: Summarize multiple documents at once
- **Citation Tracking**: Every statement includes source references
- **Adjustable Length**: Control summary length from brief to detailed
- **Multi-Language**: Summarize in 40+ languages
- **Format Options**: Output as text, bullet points, or structured JSON

## Usage

\`\`\`python
from skillshub import SkillClient

client = SkillClient(api_key="your-api-key")
summarizer = client.load_skill("nlplab/SmartSummarizer-v3")

result = summarizer.run({
    "documents": [
        {"title": "Paper 1", "content": "..."},
        {"title": "Paper 2", "content": "..."},
    ],
    "max_length": 500,
    "style": "academic",
    "include_citations": True
})

print(result.summary)
print(result.citations)
\`\`\`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| \`documents\` | array | required | Array of documents to summarize |
| \`max_length\` | number | \`300\` | Maximum summary length in words |
| \`style\` | string | \`neutral\` | Summary style: neutral, academic, casual, executive |
| \`include_citations\` | boolean | \`true\` | Include source citations |
| \`language\` | string | \`en\` | Output language code |

## License

MIT License
`,
};

export function getSkillReadme(skillName: string): string {
  return skillReadmes[skillName] || generateDefaultReadme(skillName);
}

function generateDefaultReadme(skillName: string): string {
  return `# ${skillName}

## Overview

This skill provides powerful AI-powered automation capabilities. It can be integrated into your workflows via the SkillsHub API or used directly through the web interface.

## Quick Start

${'```'}bash
# Install via SkillsHub CLI
skillshub install author/${skillName}
${'```'}

${'```'}python
from skillshub import SkillClient

client = SkillClient(api_key="your-api-key")
skill = client.load_skill("author/${skillName}")

result = skill.run({
    "input": "your input here"
})

print(result)
${'```'}

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| ${'`input`'} | string | required | The input to process |
| ${'`options`'} | object | ${'`{}`'} | Additional configuration options |

## License

MIT License
`;
}
