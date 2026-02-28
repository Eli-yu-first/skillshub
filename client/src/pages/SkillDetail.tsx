/**
 * SkillDetail Page - Complete skill detail view with README, files, community, inference
 * Redesigned to focus on Skill usage (not model usage)
 */
import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import Layout from '@/components/Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getSkillReadme } from '@/lib/skillReadme';
import { allSkills, formatNumber, getTypeIcon, getTypeColor, getTypeBgColor } from '@/lib/data';
import { motion } from 'framer-motion';
import {
  Heart, Download, GitBranch, GitCommit, MessageSquare, Play, Copy, Check,
  FileText, Folder, ChevronRight, Clock, Tag, Share2,
  Code2, Terminal, AlertCircle,
  ChevronDown, File, FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Tab = 'readme' | 'files' | 'community' | 'versions' | 'api';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  children?: FileNode[];
}

const sampleFiles: FileNode[] = [
  { name: 'src', type: 'folder', children: [
    { name: 'main.py', type: 'file', size: '4.2 KB' },
    { name: 'config.py', type: 'file', size: '1.8 KB' },
    { name: 'utils.py', type: 'file', size: '2.1 KB' },
    { name: 'prompts', type: 'folder', children: [
      { name: 'system.txt', type: 'file', size: '3.4 KB' },
      { name: 'review.txt', type: 'file', size: '2.7 KB' },
      { name: 'security.txt', type: 'file', size: '1.9 KB' },
    ]},
    { name: 'models', type: 'folder', children: [
      { name: 'reviewer.py', type: 'file', size: '5.6 KB' },
      { name: 'analyzer.py', type: 'file', size: '3.8 KB' },
    ]},
  ]},
  { name: 'tests', type: 'folder', children: [
    { name: 'test_main.py', type: 'file', size: '3.2 KB' },
    { name: 'test_utils.py', type: 'file', size: '2.4 KB' },
    { name: 'fixtures', type: 'folder', children: [
      { name: 'sample_code.py', type: 'file', size: '1.1 KB' },
    ]},
  ]},
  { name: 'README.md', type: 'file', size: '8.5 KB' },
  { name: 'skill.yaml', type: 'file', size: '0.9 KB' },
  { name: 'requirements.txt', type: 'file', size: '0.3 KB' },
  { name: 'LICENSE', type: 'file', size: '1.1 KB' },
  { name: '.gitignore', type: 'file', size: '0.2 KB' },
];

const sampleCommits = [
  { hash: 'a3f8c2d', message: 'feat: add security review mode with OWASP checks', author: 'skillsai', date: '2 hours ago', additions: 234, deletions: 45 },
  { hash: 'b7e1d4f', message: 'fix: handle edge case in Python type annotation parsing', author: 'contributor-42', date: '5 hours ago', additions: 18, deletions: 12 },
  { hash: 'c9a2e6b', message: 'docs: update API reference with new parameters', author: 'skillsai', date: '1 day ago', additions: 89, deletions: 23 },
  { hash: 'd4f7a1c', message: 'perf: optimize multi-file review batch processing', author: 'perf-bot', date: '2 days ago', additions: 156, deletions: 78 },
  { hash: 'e2b5c8d', message: 'feat: add support for Rust and Go code review', author: 'lang-team', date: '3 days ago', additions: 567, deletions: 12 },
  { hash: 'f1d3e9a', message: 'test: add comprehensive test suite for security module', author: 'qa-team', date: '4 days ago', additions: 345, deletions: 0 },
  { hash: 'g8c4b2e', message: 'refactor: extract common patterns into shared utilities', author: 'skillsai', date: '5 days ago', additions: 123, deletions: 189 },
  { hash: 'h6a9d5f', message: 'chore: update dependencies and fix deprecation warnings', author: 'deps-bot', date: '1 week ago', additions: 34, deletions: 28 },
];

const sampleDiscussions = [
  { id: '1', title: 'Support for reviewing Terraform/HCL files?', author: 'devops-user', replies: 12, date: '3 hours ago', status: 'open' as const },
  { id: '2', title: 'False positive on Python list comprehension complexity', author: 'python-dev', replies: 8, date: '1 day ago', status: 'resolved' as const },
  { id: '3', title: 'Feature request: Custom rule definitions via YAML', author: 'enterprise-admin', replies: 23, date: '2 days ago', status: 'open' as const },
  { id: '4', title: 'Integration with GitHub Actions - best practices?', author: 'ci-engineer', replies: 15, date: '3 days ago', status: 'resolved' as const },
  { id: '5', title: 'Performance degradation with files > 1000 lines', author: 'perf-tester', replies: 6, date: '5 days ago', status: 'open' as const },
];

function FileTree({ nodes, depth = 0 }: { nodes: FileNode[]; depth?: number }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src', 'tests']));

  const toggle = (name: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div>
      {nodes.map(node => (
        <div key={node.name}>
          <div
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 cursor-pointer text-sm transition-colors"
            style={{ paddingLeft: `${depth * 20 + 12}px` }}
            onClick={() => node.type === 'folder' && toggle(node.name)}
          >
            {node.type === 'folder' ? (
              <>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded.has(node.name) ? '' : '-rotate-90'}`} />
                {expanded.has(node.name) ? <FolderOpen className="w-4 h-4 text-primary" /> : <Folder className="w-4 h-4 text-primary" />}
              </>
            ) : (
              <>
                <span className="w-3.5" />
                <File className="w-4 h-4 text-muted-foreground" />
              </>
            )}
            <span className="flex-1 truncate text-foreground">{node.name}</span>
            {node.size && <span className="text-xs text-muted-foreground">{node.size}</span>}
          </div>
          {node.type === 'folder' && expanded.has(node.name) && node.children && (
            <FileTree nodes={node.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SkillDetail() {
  const params = useParams<{ author: string; name: string }>();
  const { author, name } = params;
  const [activeTab, setActiveTab] = useState<Tab>('readme');
  const [liked, setLiked] = useState(false);
  const [apiInput, setApiInput] = useState('function add(a, b) {\n  return a + b;\n}');
  const [apiOutput, setApiOutput] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const skill = useMemo(() => allSkills.find(s => s.author === author && s.name === name), [author, name]);
  const readme = useMemo(() => getSkillReadme(name || ''), [name]);

  if (!skill) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl mb-2">Skill Not Found</h1>
          <p className="text-muted-foreground mb-6">The skill &quot;{author}/{name}&quot; could not be found.</p>
          <Link href="/skills"><Button>Browse Skills</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleApiTest = () => {
    setApiLoading(true);
    setApiOutput('');
    setTimeout(() => {
      setApiOutput(JSON.stringify({
        score: 92,
        summary: "Clean and functional code. Minor suggestion for type safety.",
        suggestions: [
          {
            line: 1,
            severity: "low",
            category: "type-safety",
            message: "Consider adding TypeScript type annotations for parameters",
            suggested_fix: "function add(a: number, b: number): number {\n  return a + b;\n}"
          }
        ],
        metrics: { complexity: 1, maintainability: 95 }
      }, null, 2));
      setApiLoading(false);
    }, 1500);
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(`skillshub install ${author}/${name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Install command copied to clipboard');
  };

  const tabList: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'readme', label: 'README', icon: <FileText className="w-4 h-4" /> },
    { id: 'files', label: 'Files', icon: <Folder className="w-4 h-4" />, count: 12 },
    { id: 'community', label: 'Community', icon: <MessageSquare className="w-4 h-4" />, count: sampleDiscussions.length },
    { id: 'versions', label: 'History', icon: <GitCommit className="w-4 h-4" />, count: sampleCommits.length },
    { id: 'api', label: 'Inference API', icon: <Play className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="container py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/skills" className="hover:text-foreground transition-colors">Skills</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/organizations`} className="hover:text-foreground transition-colors">{author}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{name}</span>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-lg ${getTypeColor(skill.type)}`}>{getTypeIcon(skill.type)}</span>
                <h1 className="font-display font-bold text-2xl lg:text-3xl">
                  <span className="text-primary">{author}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span>{name}</span>
                </h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTypeBgColor(skill.type)}`}>
                  {skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground text-base mb-3">{skill.description}</p>
              <div className="flex items-center gap-3 flex-wrap">
                {skill.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary/30 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Updated {skill.updatedAt}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setLiked(!liked); toast.success(liked ? 'Removed from likes' : 'Added to likes'); }}
                className="gap-1.5"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {formatNumber(skill.likes + (liked ? 1 : 0))}
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('Feature coming soon')} className="gap-1.5">
                <GitBranch className="w-4 h-4" />
                Fork
              </Button>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied'); }} className="gap-1.5">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Install Banner */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg mb-6">
          <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />
          <code className="flex-1 text-sm font-mono text-foreground">skillshub install {author}/{name}</code>
          <button onClick={handleCopyInstall} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 pb-6 border-b border-border flex-wrap">
          <span className="flex items-center gap-1.5"><Download className="w-4 h-4" />{formatNumber(skill.downloads)} downloads</span>
          <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" />{formatNumber(skill.likes)} likes</span>
          <span className="flex items-center gap-1.5"><GitCommit className="w-4 h-4" />{sampleCommits.length} commits</span>
          <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4" />3 branches</span>
          <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" />v2.4.1</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* README Tab */}
            {activeTab === 'readme' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MarkdownRenderer content={readme} />
              </motion.div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <GitBranch className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">main</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground truncate max-w-xs">{sampleCommits[0].message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{sampleCommits[0].date}</span>
                  </div>
                  <FileTree nodes={sampleFiles} />
                </div>
              </motion.div>
            )}

            {/* Community Tab */}
            {activeTab === 'community' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-lg">Discussions</h2>
                  <Button size="sm" onClick={() => toast.info('Feature coming soon')}>New Discussion</Button>
                </div>
                <div className="space-y-3">
                  {sampleDiscussions.map(d => (
                    <div key={d.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/20 transition-all cursor-pointer">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${d.status === 'open' ? 'bg-green-500' : 'bg-purple-500'}`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate">{d.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{d.author}</span>
                          <span>{d.date}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${d.status === 'open' ? 'bg-green-500/10 text-green-600' : 'bg-purple-500/10 text-purple-600'}`}>
                            {d.status}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" />{d.replies}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Versions Tab */}
            {activeTab === 'versions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display font-semibold text-lg mb-4">Commit History</h2>
                <div className="space-y-0">
                  {sampleCommits.map((commit, i) => (
                    <div key={commit.hash} className="flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <GitCommit className="w-4 h-4 text-primary" />
                        </div>
                        {i < sampleCommits.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1">{commit.message}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-mono text-primary">{commit.hash}</span>
                          <span>{commit.author}</span>
                          <span>{commit.date}</span>
                          <span className="text-green-600">+{commit.additions}</span>
                          <span className="text-red-500">-{commit.deletions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Inference API Tab */}
            {activeTab === 'api' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display font-semibold text-lg mb-4">Inference API</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Test this skill directly in your browser. Enter your input below and click &quot;Run&quot; to see the output.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Input */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Input</label>
                    <textarea
                      value={apiInput}
                      onChange={(e) => setApiInput(e.target.value)}
                      className="w-full h-64 p-4 rounded-lg border border-border bg-muted/30 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                      placeholder="Enter your code or input here..."
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <Button onClick={handleApiTest} disabled={apiLoading} className="gap-2">
                        {apiLoading ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        {apiLoading ? 'Running...' : 'Run'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setApiInput(''); setApiOutput(''); }}>
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Output</label>
                    <div className="w-full h-64 p-4 rounded-lg border border-border bg-muted/30 font-mono text-sm overflow-auto">
                      {apiOutput ? (
                        <pre className="text-foreground whitespace-pre-wrap">{apiOutput}</pre>
                      ) : (
                        <span className="text-muted-foreground">Output will appear here after running...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* API Endpoint */}
                <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
                  <h3 className="text-sm font-medium mb-3">REST API Endpoint</h3>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-md border border-border">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/10 text-green-600">POST</span>
                    <code className="text-sm font-mono text-foreground flex-1">https://api.skillshub.dev/v1/skills/{author}/{name}/run</code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`https://api.skillshub.dev/v1/skills/${author}/${name}/run`); toast.success('API URL copied'); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Example Request</h4>
                    <pre className="p-3 bg-background rounded-md border border-border text-xs font-mono overflow-x-auto">
{`curl -X POST https://api.skillshub.dev/v1/skills/${author}/${name}/run \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"code": "your code here", "language": "auto"}'`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Card */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">About</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className={`flex items-center gap-1.5 font-medium ${getTypeColor(skill.type)}`}>
                    {getTypeIcon(skill.type)} {skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-medium">{formatNumber(skill.downloads)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-medium">{formatNumber(skill.likes)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-xs">v2.4.1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">License</span>
                  <span className="text-xs">MIT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-xs">{skill.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Author Card */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Author</h3>
              <Link href="/organizations">
                <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                    {author?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{author}</p>
                    <p className="text-xs text-muted-foreground">View profile</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Tags */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map(tag => (
                  <Link key={tag} href={`/skills?tag=${tag}`}>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Compatible Models */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Compatible Models</h3>
              <div className="space-y-2">
                {['GPT-4o', 'Claude-3.5-Sonnet', 'DeepSeek-V3', 'Llama-3.1-405B'].map(model => (
                  <div key={model} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{model}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
