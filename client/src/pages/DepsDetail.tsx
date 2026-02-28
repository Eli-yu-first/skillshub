/**
 * Agent Detail Page - View agent details, try it out, and manage deployment
 */
import { useState } from 'react';
import { Link, useParams } from 'wouter';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Bot, Star, Play, Copy, ExternalLink, GitBranch,
  Heart, MessageSquare, Settings, Terminal, Globe, Shield,
  Zap, Cpu, Clock, Users, Code2, Send, Loader2,
  ChevronRight, Rocket, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock agent data
const agentData = {
  id: '1',
  name: 'Full-Stack Dev Agent',
  slug: 'fullstack-dev-agent',
  author: 'skillsai',
  authorAvatar: '',
  description: 'End-to-end web development agent that handles frontend, backend, database design, and deployment. Combines React, Node.js, and PostgreSQL skills for complete project scaffolding.',
  readme: `# Full-Stack Dev Agent

## Overview
This agent combines multiple development skills to provide end-to-end web development capabilities. It can scaffold projects, write components, create APIs, design databases, and deploy applications.

## Capabilities
- **Frontend**: React, Vue, Svelte component generation with TypeScript
- **Backend**: Node.js, Python, Go API creation with authentication
- **Database**: PostgreSQL, MySQL, MongoDB schema design and migrations
- **DevOps**: Docker containerization, CI/CD pipeline setup

## Usage
\`\`\`bash
curl -X POST https://api.skillshub.dev/agents/fullstack-dev-agent/invoke \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Create a REST API for a blog with user auth"}'
\`\`\`

## Configuration
| Parameter | Default | Description |
|-----------|---------|-------------|
| temperature | 0.7 | Controls creativity vs precision |
| max_tokens | 4096 | Maximum output length |
| framework | react | Frontend framework preference |
| database | postgresql | Database preference |

## Examples

### Create a React Component
\`\`\`json
{
  "input": "Create a responsive dashboard with charts",
  "parameters": { "framework": "react", "styling": "tailwind" }
}
\`\`\`

### Design a Database Schema
\`\`\`json
{
  "input": "Design a schema for an e-commerce platform",
  "parameters": { "database": "postgresql", "orm": "drizzle" }
}
\`\`\`
`,
  skills: [
    { name: 'React Component Builder', type: 'tool', author: 'skillsai' },
    { name: 'Node.js API Generator', type: 'tool', author: 'skillsai' },
    { name: 'SQL Schema Designer', type: 'tool', author: 'dataops' },
    { name: 'Docker Deployer', type: 'agent', author: 'devopsai' },
  ],
  models: [
    { name: 'GPT-4o', provider: 'OpenAI', icon: '🟢' },
    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: '🟠' },
  ],
  status: 'deployed' as const,
  deployUrl: 'https://sandbox.skillshub.dev/fullstack-dev',
  likes: 2847,
  runs: 15620,
  forks: 342,
  discussions: 28,
  createdAt: '2 days ago',
  updatedAt: '1 hour ago',
  tags: ['web-dev', 'full-stack', 'react', 'node', 'postgresql', 'docker'],
  config: {
    temperature: 0.7,
    maxTokens: 4096,
  },
};

export default function DepsDetail() {
  const params = useParams<{ author: string; slug: string }>();
  const [activeTab, setActiveTab] = useState<'readme' | 'api' | 'playground' | 'discussions'>('readme');
  const [playgroundInput, setPlaygroundInput] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [liked, setLiked] = useState(false);

  const agent = agentData; // In real app, fetch by params

  const handleRun = () => {
    if (!playgroundInput.trim()) return;
    setIsRunning(true);
    setPlaygroundOutput('');
    // Simulate streaming response
    setTimeout(() => {
      setPlaygroundOutput(`Based on your request: "${playgroundInput}"

I'll create a comprehensive solution using the following skills:

1. **React Component Builder** - Setting up the frontend structure
2. **Node.js API Generator** - Creating the backend API endpoints
3. **SQL Schema Designer** - Designing the database schema
4. **Docker Deployer** - Containerizing the application

\`\`\`typescript
// Generated API endpoint
import express from 'express';
const router = express.Router();

router.get('/api/items', async (req, res) => {
  const items = await db.select().from(itemsTable);
  res.json({ items });
});

export default router;
\`\`\`

The full project has been scaffolded and is ready for deployment.`);
      setIsRunning(false);
    }, 2000);
  };

  const tabs = [
    { id: 'readme', label: 'README', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'api', label: 'API', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'playground', label: 'Playground', icon: <Play className="w-3.5 h-3.5" /> },
    { id: 'discussions', label: `Discussions (${agent.discussions})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="container py-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/deps" className="hover:text-foreground transition-colors">Agents</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{agent.author}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium">{agent.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-coral/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-bold text-xl">{agent.author}/{agent.name}</h1>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      agent.status === 'deployed'
                        ? 'bg-teal/10 text-teal border border-teal/20'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {agent.status === 'deployed' ? '● Live' : '● Published'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{agent.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className={`gap-1.5 ${liked ? 'text-coral border-coral/30' : ''}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-coral' : ''}`} />
                  {liked ? agent.likes + 1 : agent.likes}
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" /> Fork ({agent.forks})
                </Button>
                {agent.deployUrl && (
                  <a href={agent.deployUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-coral hover:bg-coral-dark text-white gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Open Live
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Play className="w-3.5 h-3.5" /> {agent.runs.toLocaleString()} runs</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {agent.likes.toLocaleString()} likes</span>
              <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> {agent.forks} forks</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Updated {agent.updatedAt}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {agent.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-[11px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-5 -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'readme' && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="bg-card border border-border rounded-xl p-6">
                    {/* Simple markdown rendering */}
                    {agent.readme.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) return <h1 key={i} className="font-display font-bold text-2xl mt-0 mb-4">{line.slice(2)}</h1>;
                      if (line.startsWith('## ')) return <h2 key={i} className="font-display font-bold text-xl mt-6 mb-3">{line.slice(3)}</h2>;
                      if (line.startsWith('### ')) return <h3 key={i} className="font-display font-semibold text-lg mt-4 mb-2">{line.slice(4)}</h3>;
                      if (line.startsWith('```')) return null;
                      if (line.startsWith('|')) {
                        return <div key={i} className="text-sm font-mono bg-muted/30 px-2 py-0.5">{line}</div>;
                      }
                      if (line.startsWith('- **')) {
                        const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
                        if (match) return <p key={i} className="text-sm my-1"><strong>{match[1]}</strong>: {match[2]}</p>;
                      }
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i} className="text-sm text-muted-foreground my-1">{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-display font-semibold text-lg mb-4">API Reference</h3>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-teal/10 text-teal text-xs font-mono font-medium">POST</span>
                        <code className="text-sm font-mono text-foreground">/api/agents/{agent.slug}/invoke</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Invoke the agent with input and parameters.</p>
                    </div>

                    <h4 className="text-sm font-medium mt-6 mb-3">Request Body</h4>
                    <div className="rounded-lg bg-indigo p-4 overflow-x-auto">
                      <pre className="text-xs text-white/80 font-mono">
{`{
  "input": "string",        // Required: Your prompt or instruction
  "parameters": {
    "temperature": 0.7,      // Optional: 0-2, default 0.7
    "max_tokens": 4096,      // Optional: 256-16384, default 4096
    "stream": false          // Optional: Enable streaming response
  },
  "context": {              // Optional: Additional context
    "files": [],
    "history": []
  }
}`}
                      </pre>
                    </div>

                    <h4 className="text-sm font-medium mt-6 mb-3">Response</h4>
                    <div className="rounded-lg bg-indigo p-4 overflow-x-auto">
                      <pre className="text-xs text-white/80 font-mono">
{`{
  "id": "run_abc123",
  "status": "completed",
  "output": "Generated response...",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 1024,
    "total_tokens": 1174
  },
  "skills_used": ["React Component Builder", "Node.js API Generator"],
  "model": "gpt-4o",
  "duration_ms": 3200
}`}
                      </pre>
                    </div>

                    <h4 className="text-sm font-medium mt-6 mb-3">Code Examples</h4>
                    <div className="space-y-3">
                      {[
                        { lang: 'Python', code: `import requests

response = requests.post(
    "https://api.skillshub.dev/agents/${agent.slug}/invoke",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"input": "Create a REST API for a blog"}
)
print(response.json()["output"])` },
                        { lang: 'JavaScript', code: `const response = await fetch(
  "https://api.skillshub.dev/agents/${agent.slug}/invoke",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ input: "Create a REST API for a blog" })
  }
);
const data = await response.json();
console.log(data.output);` },
                      ].map(example => (
                        <div key={example.lang}>
                          <div className="flex items-center justify-between px-4 py-2 bg-indigo rounded-t-lg">
                            <span className="text-xs text-white/60 font-mono">{example.lang}</span>
                            <button className="text-white/40 hover:text-white/80 transition-colors">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="rounded-b-lg bg-indigo/90 p-4 overflow-x-auto">
                            <pre className="text-xs text-white/80 font-mono">{example.code}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'playground' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <h3 className="font-display font-semibold text-sm">Try it out</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Test the agent with your own input</p>
                  </div>
                  <div className="p-4">
                    {/* Input */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium mb-1.5">Input</label>
                      <div className="relative">
                        <textarea
                          value={playgroundInput}
                          onChange={(e) => setPlaygroundInput(e.target.value)}
                          placeholder="e.g., Create a REST API for a blog with user authentication..."
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleRun}
                      disabled={isRunning || !playgroundInput.trim()}
                      className="bg-coral hover:bg-coral-dark text-white font-display font-semibold mb-4"
                    >
                      {isRunning ? (
                        <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Running...</>
                      ) : (
                        <><Play className="w-4 h-4 mr-1.5" /> Run Agent</>
                      )}
                    </Button>

                    {/* Output */}
                    {(playgroundOutput || isRunning) && (
                      <div>
                        <label className="block text-xs font-medium mb-1.5">Output</label>
                        <div className="rounded-lg border border-border bg-muted/20 p-4 min-h-[200px]">
                          {isRunning ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing with {agent.models.map(m => m.name).join(' + ')}...
                            </div>
                          ) : (
                            <pre className="text-sm whitespace-pre-wrap font-mono">{playgroundOutput}</pre>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-semibold text-lg">Discussions</h3>
                    <Button size="sm" className="bg-primary text-primary-foreground font-display font-semibold">
                      New Discussion
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'How to customize the database schema output?', author: 'devuser42', replies: 5, time: '2 hours ago' },
                      { title: 'Feature request: Add GraphQL support', author: 'graphqlFan', replies: 12, time: '1 day ago' },
                      { title: 'Bug: TypeScript types not generated correctly', author: 'tsExpert', replies: 3, time: '3 days ago' },
                    ].map((d, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium hover:text-primary transition-colors">{d.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{d.author}</span>
                            <span>·</span>
                            <span>{d.replies} replies</span>
                            <span>·</span>
                            <span>{d.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Skills */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Skills ({agent.skills.length})</h3>
                <div className="space-y-2">
                  {agent.skills.map(skill => (
                    <div key={skill.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{skill.name}</p>
                        <p className="text-[10px] text-muted-foreground">by {skill.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Models */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Models ({agent.models.length})</h3>
                <div className="space-y-2">
                  {agent.models.map(model => (
                    <div key={model.name} className="flex items-center gap-2 p-2 rounded-lg">
                      <span className="text-sm">{model.icon}</span>
                      <div>
                        <p className="text-xs font-medium">{model.name}</p>
                        <p className="text-[10px] text-muted-foreground">{model.provider}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Config */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Configuration</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium">{agent.config.temperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Tokens</span>
                    <span className="font-medium">{agent.config.maxTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-teal font-medium">Deployed</span>
                  </div>
                </div>
              </div>

              {/* Deploy Info */}
              {agent.deployUrl && (
                <div className="bg-teal/5 border border-teal/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    <h3 className="text-xs font-medium text-teal">Live Deployment</h3>
                  </div>
                  <a href={agent.deployUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal/80 hover:text-teal underline break-all">
                    {agent.deployUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
