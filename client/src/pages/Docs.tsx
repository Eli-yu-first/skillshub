/**
 * Docs Page - Bauhaus Industrial Design
 * Modeled after HuggingFace /docs page
 * Sidebar navigation + content area with code examples
 */
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link, useParams } from 'wouter';
import { ChevronRight, BookOpen, Menu, X, ExternalLink, Copy, Check, Search } from 'lucide-react';
import { docsSections } from '@/lib/data';
import { toast } from 'sonner';

const docContent: Record<string, { title: string; content: string }> = {
  introduction: {
    title: 'Introduction',
    content: `# Welcome to SkillsHub

SkillsHub is the platform where the skills community collaborates on AI prompts, agent logic, tools, and automation scripts. Think of it as the "GitHub + Hugging Face" for AI skills.

## What is a Skill?

A **Skill** is a reusable unit of AI capability. It can be:

- **Prompt**: A carefully crafted prompt template with variables
- **Agent**: A multi-step logic flow that orchestrates LLM calls
- **Tool**: A function or utility that extends AI capabilities
- **RPA**: A robotic process automation script

## Core Concepts

### Skills Hub
The central repository for discovering and sharing skills. Each skill has:
- A README.md (rendered as a Skill Card)
- Version-controlled files via Git
- An inference API for testing
- Community features (likes, discussions, PRs)

### Contexts
Context datasets provide the background knowledge and test cases for skills. They can include:
- Training data
- Evaluation benchmarks
- Knowledge bases
- Configuration templates

### Playgrounds
Interactive cloud environments where you can run and test skills in real-time. Powered by containerized runtimes (Python, Node.js, Docker).

## Quick Example

\`\`\`bash
# Install the SkillsHub CLI
pip install skillshub

# Login to your account
skillshub login

# Clone a skill
skillshub clone skillsai/GPT-CodeReviewer

# Run it locally
skillshub run --input "Review this Python code..."
\`\`\`

## Next Steps

- [Quick Start Guide](/docs/quick-start) - Get up and running in 5 minutes
- [Creating Your First Skill](/docs/creating-skill) - Build and publish a skill
- [API Reference](/docs/rest-api) - Integrate SkillsHub into your workflow`,
  },
  'quick-start': {
    title: 'Quick Start',
    content: `# Quick Start Guide

Get up and running with SkillsHub in under 5 minutes.

## Prerequisites

- Python 3.9+ or Node.js 18+
- A SkillsHub account ([sign up free](https://skillshub.dev/signup))

## Step 1: Install the CLI

\`\`\`bash
# Using pip
pip install skillshub

# Or using npm
npm install -g @skillshub/cli
\`\`\`

## Step 2: Authenticate

\`\`\`bash
skillshub login
# This will open your browser for OAuth authentication
\`\`\`

## Step 3: Create Your First Skill

\`\`\`bash
skillshub init my-first-skill --type prompt
cd my-first-skill
\`\`\`

This creates a new skill repository with the following structure:

\`\`\`
my-first-skill/
├── README.md          # Skill Card (description, usage, examples)
├── skill.yaml         # Metadata and configuration
├── prompt.txt         # Your prompt template
└── tests/
    └── test_basic.py  # Test cases
\`\`\`

## Step 4: Edit Your Skill

Edit \`prompt.txt\` with your prompt template:

\`\`\`
You are a helpful assistant that {{task}}.

Given the following input:
{{input}}

Please provide a detailed response.
\`\`\`

## Step 5: Test Locally

\`\`\`bash
skillshub run --input '{"task": "summarizes text", "input": "Long article..."}'
\`\`\`

## Step 6: Publish

\`\`\`bash
skillshub push
\`\`\`

Your skill is now live on SkillsHub! Share the URL with the community.`,
  },
  'rest-api': {
    title: 'REST API',
    content: `# REST API Reference

The SkillsHub REST API allows you to programmatically interact with the platform. All endpoints require authentication via Bearer token.

## Base URL

\`\`\`
https://api.skillshub.dev/v1
\`\`\`

## Authentication

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.skillshub.dev/v1/skills
\`\`\`

## Endpoints

### List Skills

\`\`\`bash
GET /v1/skills
GET /v1/skills?tag=agent&sort=trending
\`\`\`

### Get Skill Details

\`\`\`bash
GET /v1/skills/:owner/:name
\`\`\`

### Run a Skill

\`\`\`bash
POST /v1/skills/:owner/:name/run
Content-Type: application/json

{
  "input": "Your input text",
  "max_tokens": 1024,
  "temperature": 0.7
}
\`\`\`

### List Contexts

\`\`\`bash
GET /v1/contexts
GET /v1/contexts?format=jsonl&sort=downloads
\`\`\`

### List Playgrounds

\`\`\`bash
GET /v1/playgrounds
GET /v1/playgrounds?runtime=python
\`\`\`

## Rate Limits

- Free tier: 100 requests/hour
- Pro tier: 1,000 requests/hour
- Enterprise: Custom limits`,
  },
};

export default function Docs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const params = useParams<{ slug?: string }>();
  const currentSlug = params.slug || 'introduction';
  const currentDoc = docContent[currentSlug] || docContent['introduction'];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown renderer
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = '';

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          const code = codeLines.join('\n');
          elements.push(
            <div key={`code-${i}`} className="relative group my-4">
              <div className="flex items-center justify-between bg-indigo rounded-t-lg px-4 py-2">
                <span className="text-xs text-white/55 font-mono">{codeLang || 'code'}</span>
                <button
                  onClick={() => handleCopy(code)}
                  className="text-white/35 hover:text-white/80 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="bg-indigo/95 rounded-b-lg p-4 overflow-x-auto">
                <code className="text-sm text-white/80 font-mono">{code}</code>
              </pre>
            </div>
          );
          codeLines = [];
          inCodeBlock = false;
        } else {
          codeLang = line.replace('```', '').trim();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="font-display font-bold text-2xl sm:text-3xl mt-2 mb-5">{line.replace('# ', '')}</h1>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="font-display font-semibold text-base mt-6 mb-2">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="font-display font-bold text-xl mt-8 mb-3">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="ml-4 text-sm text-foreground/75 leading-relaxed flex items-start gap-2">
            <span className="text-coral mt-1.5 text-xs">●</span>
            <span dangerouslySetInnerHTML={{
              __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-coral hover:underline underline-offset-2">$1</a>')
            }} />
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-sm text-foreground/75 leading-relaxed" dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
              .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-coral">$1</code>')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-coral hover:underline underline-offset-2">$1</a>')
          }} />
        );
      }
    });

    return elements;
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <div className="container py-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'block fixed inset-0 z-50 bg-background p-6' : 'hidden'} lg:block lg:relative lg:p-0 w-full lg:w-56 shrink-0`}>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-display font-semibold">Documentation</h3>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="sticky top-20">
                {/* Search */}
                <div className="relative mb-5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral/40 transition-all"
                  />
                </div>

                <div className="space-y-5">
                  {docsSections.map((section) => (
                    <div key={section.title}>
                      <h4 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        {section.title}
                      </h4>
                      <ul className="space-y-0.5">
                        {section.items
                          .filter(item => !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/docs/${item.slug}`}
                              className={`block px-3 py-1.5 text-sm rounded-md transition-all duration-150 ${
                                currentSlug === item.slug
                                  ? 'text-coral bg-coral/8 font-medium'
                                  : 'text-foreground/60 hover:text-foreground hover:bg-muted/50'
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-4 h-4" /> Navigation
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
                <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground">{currentDoc.title}</span>
              </div>

              {/* Doc Content */}
              <article className="max-w-3xl">
                {renderContent(currentDoc.content)}
              </article>

              {/* Placeholder for sections without content */}
              {!docContent[currentSlug] && (
                <div className="p-8 rounded-xl border border-border bg-muted/20 text-center max-w-3xl">
                  <div className="w-12 h-12 bg-coral/8 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-coral" />
                  </div>
                  <h2 className="font-display font-bold text-xl mb-2 capitalize">{currentSlug.replace(/-/g, ' ')}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    This documentation section is currently being written. Check back soon for detailed content.
                  </p>
                  <Link href="/docs" className="text-sm text-coral hover:text-coral-dark inline-flex items-center gap-1 transition-colors">
                    Back to Introduction <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-border max-w-3xl">
                <div />
                {currentSlug === 'introduction' && (
                  <Link href="/docs/quick-start" className="flex items-center gap-1 text-sm text-coral hover:text-coral-dark font-medium transition-colors">
                    Next: Quick Start <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
                {currentSlug === 'quick-start' && (
                  <Link href="/docs/rest-api" className="flex items-center gap-1 text-sm text-coral hover:text-coral-dark font-medium transition-colors">
                    Next: REST API <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right sidebar - On this page */}
            <aside className="hidden xl:block w-44 shrink-0">
              <div className="sticky top-20">
                <h4 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">On this page</h4>
                <ul className="space-y-1.5 text-sm">
                  {currentDoc.content.split('\n')
                    .filter(line => line.startsWith('## '))
                    .map((line, i) => {
                      const title = line.replace('## ', '');
                      return (
                        <li key={i}>
                          <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs">{title}</span>
                        </li>
                      );
                    })}
                </ul>
                <div className="mt-6 pt-4 border-t border-border">
                  <a href="#" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-3 h-3" /> Edit on GitHub
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
