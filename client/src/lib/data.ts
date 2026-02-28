// SkillsHub Mock Data
// Bauhaus Industrial Design System - Geometric type indicators:
// Circle = Prompt, Triangle = Agent, Square = Tool, Diamond = RPA

export interface Skill {
  id: string;
  name: string;
  author: string;
  authorAvatar?: string;
  description: string;
  type: 'prompt' | 'agent' | 'tool' | 'rpa';
  tags: string[];
  likes: number;
  downloads: number;
  updatedAt: string;
  trending?: boolean;
}

export interface Context {
  id: string;
  name: string;
  author: string;
  description: string;
  size: string;
  format: string;
  downloads: number;
  likes: number;
  updatedAt: string;
  tags: string[];
}

export interface Playground {
  id: string;
  name: string;
  author: string;
  description: string;
  runtime: string;
  likes: number;
  emoji: string;
  color: string;
  updatedAt: string;
}

export const trendingSkills: Skill[] = [
  { id: '1', name: 'GPT-CodeReviewer', author: 'skillsai', description: 'Automated code review with contextual suggestions', type: 'agent', tags: ['code-review', 'automation'], likes: 2840, downloads: 156200, updatedAt: '2 hours ago', trending: true },
  { id: '2', name: 'DataPipeline-Builder', author: 'flowcraft', description: 'Visual data pipeline construction from natural language', type: 'tool', tags: ['data', 'pipeline', 'etl'], likes: 1920, downloads: 89400, updatedAt: '5 hours ago', trending: true },
  { id: '3', name: 'SmartSummarizer-v3', author: 'nlplab', description: 'Multi-document summarization with citation tracking', type: 'prompt', tags: ['nlp', 'summarization'], likes: 3150, downloads: 234100, updatedAt: '1 day ago', trending: true },
  { id: '4', name: 'AutoTest-Generator', author: 'testforge', description: 'Generate comprehensive test suites from code analysis', type: 'agent', tags: ['testing', 'automation'], likes: 1680, downloads: 67800, updatedAt: '3 hours ago', trending: true },
  { id: '5', name: 'APIDoc-Writer', author: 'docsmith', description: 'Auto-generate API documentation from source code', type: 'tool', tags: ['documentation', 'api'], likes: 2210, downloads: 112300, updatedAt: '12 hours ago', trending: true },
];

export const trendingPlaygrounds: Playground[] = [
  { id: '1', name: 'Prompt Engineering Lab', author: 'skillsai', description: 'Interactive prompt testing and optimization environment', runtime: 'Python 3.11', likes: 1730, emoji: '🧪', color: 'from-coral to-coral-dark', updatedAt: '1 hour ago' },
  { id: '2', name: 'Agent Flow Designer', author: 'flowcraft', description: 'Visual agent workflow builder with live preview', runtime: 'Node.js 20', likes: 2130, emoji: '🔄', color: 'from-teal to-indigo', updatedAt: '3 hours ago' },
  { id: '3', name: 'RPA Automation Studio', author: 'automate-io', description: 'Build and test RPA scripts in the browser', runtime: 'Python 3.11', likes: 986, emoji: '🤖', color: 'from-amber to-coral', updatedAt: '6 hours ago' },
  { id: '4', name: 'Context Playground', author: 'datalab', description: 'Explore and test context datasets interactively', runtime: 'Jupyter', likes: 1570, emoji: '📊', color: 'from-indigo to-teal', updatedAt: '2 hours ago' },
  { id: '5', name: 'Multi-Agent Arena', author: 'agentverse', description: 'Pit multiple agents against each other in scenarios', runtime: 'Docker', likes: 2380, emoji: '⚔️', color: 'from-coral-dark to-indigo', updatedAt: '30 min ago' },
];

export const trendingContexts: Context[] = [
  { id: '1', name: 'CodeReview-Benchmark', author: 'skillsai', description: 'Comprehensive code review test cases across 12 languages', size: '2.4 GB', format: 'JSONL', downloads: 45200, likes: 890, updatedAt: '2 days ago', tags: ['code', 'benchmark'] },
  { id: '2', name: 'CustomerSupport-Dialogs', author: 'chatdata', description: '500K annotated customer support conversations', size: '1.8 GB', format: 'Parquet', downloads: 78900, likes: 1240, updatedAt: '5 days ago', tags: ['nlp', 'dialog'] },
  { id: '3', name: 'API-Documentation-Corpus', author: 'docsmith', description: 'Structured API docs from 10K+ open source projects', size: '4.1 GB', format: 'JSON', downloads: 34100, likes: 670, updatedAt: '1 week ago', tags: ['api', 'documentation'] },
  { id: '4', name: 'Workflow-Templates', author: 'flowcraft', description: 'Curated collection of automation workflow templates', size: '890 MB', format: 'YAML', downloads: 23400, likes: 520, updatedAt: '3 days ago', tags: ['automation', 'workflow'] },
  { id: '5', name: 'Security-Audit-Cases', author: 'seclab', description: 'Real-world security audit scenarios and responses', size: '1.2 GB', format: 'JSONL', downloads: 19800, likes: 430, updatedAt: '4 days ago', tags: ['security', 'audit'] },
];

export const allSkills: Skill[] = [
  ...trendingSkills,
  { id: '6', name: 'SQL-Optimizer', author: 'dbpro', description: 'Optimize SQL queries using AI analysis', type: 'tool', tags: ['sql', 'database', 'optimization'], likes: 1540, downloads: 78200, updatedAt: '1 day ago' },
  { id: '7', name: 'Email-Composer', author: 'writecraft', description: 'Professional email drafting with tone control', type: 'prompt', tags: ['email', 'writing'], likes: 980, downloads: 45600, updatedAt: '2 days ago' },
  { id: '8', name: 'CI-CD-Automator', author: 'devopsai', description: 'Automated CI/CD pipeline configuration', type: 'rpa', tags: ['devops', 'ci-cd', 'automation'], likes: 2100, downloads: 98700, updatedAt: '6 hours ago' },
  { id: '9', name: 'Bug-Triager', author: 'issuebot', description: 'Intelligent bug report classification and routing', type: 'agent', tags: ['bug-tracking', 'classification'], likes: 760, downloads: 34500, updatedAt: '3 days ago' },
  { id: '10', name: 'Schema-Designer', author: 'dbpro', description: 'Database schema generation from requirements', type: 'tool', tags: ['database', 'schema', 'design'], likes: 1320, downloads: 56700, updatedAt: '1 day ago' },
  { id: '11', name: 'Meeting-Summarizer', author: 'notesai', description: 'Extract action items and summaries from meetings', type: 'prompt', tags: ['meetings', 'summarization'], likes: 2450, downloads: 167800, updatedAt: '4 hours ago' },
  { id: '12', name: 'Log-Analyzer', author: 'opswatch', description: 'Intelligent log analysis and anomaly detection', type: 'agent', tags: ['logging', 'monitoring', 'anomaly'], likes: 1870, downloads: 89200, updatedAt: '8 hours ago' },
  { id: '13', name: 'Form-Filler-RPA', author: 'automate-io', description: 'Automated web form filling and submission', type: 'rpa', tags: ['rpa', 'forms', 'automation'], likes: 640, downloads: 28900, updatedAt: '5 days ago' },
  { id: '14', name: 'Translation-Engine', author: 'polyglot', description: 'Context-aware multi-language translation', type: 'prompt', tags: ['translation', 'nlp', 'multilingual'], likes: 3200, downloads: 245600, updatedAt: '2 hours ago' },
  { id: '15', name: 'Dependency-Auditor', author: 'seclab', description: 'Scan and audit project dependencies for vulnerabilities', type: 'tool', tags: ['security', 'dependencies'], likes: 1100, downloads: 52300, updatedAt: '1 day ago' },
  { id: '16', name: 'PR-Reviewer-Bot', author: 'gitflow', description: 'Automated pull request review with inline comments', type: 'agent', tags: ['git', 'code-review', 'automation'], likes: 2680, downloads: 134500, updatedAt: '3 hours ago' },
];

export const allContexts: Context[] = [
  ...trendingContexts,
  { id: '6', name: 'Multi-Language-Code', author: 'codebase', description: 'Source code samples in 20+ programming languages', size: '6.2 GB', format: 'Mixed', downloads: 56700, likes: 980, updatedAt: '1 week ago', tags: ['code', 'multilingual'] },
  { id: '7', name: 'Tech-Blog-Corpus', author: 'blogdata', description: 'Curated technical blog posts from top engineering teams', size: '3.5 GB', format: 'Markdown', downloads: 41200, likes: 750, updatedAt: '2 weeks ago', tags: ['blog', 'technical-writing'] },
  { id: '8', name: 'Error-Messages-DB', author: 'debugdata', description: 'Categorized error messages with resolution patterns', size: '1.1 GB', format: 'JSON', downloads: 29800, likes: 560, updatedAt: '4 days ago', tags: ['errors', 'debugging'] },
  { id: '9', name: 'DevOps-Configs', author: 'opsdata', description: 'Production-grade DevOps configuration templates', size: '780 MB', format: 'YAML', downloads: 18900, likes: 340, updatedAt: '6 days ago', tags: ['devops', 'configuration'] },
  { id: '10', name: 'UI-Component-Specs', author: 'designdata', description: 'UI component specifications and accessibility guidelines', size: '2.1 GB', format: 'JSON', downloads: 37600, likes: 820, updatedAt: '3 days ago', tags: ['ui', 'design', 'accessibility'] },
];

export const allPlaygrounds: Playground[] = [
  ...trendingPlaygrounds,
  { id: '6', name: 'Code Generation Lab', author: 'codegen', description: 'Test and compare code generation models', runtime: 'Python 3.11', likes: 1240, emoji: '💻', color: 'from-teal to-teal-light', updatedAt: '4 hours ago' },
  { id: '7', name: 'NLP Workbench', author: 'nlplab', description: 'Natural language processing experimentation', runtime: 'Jupyter', likes: 890, emoji: '📝', color: 'from-indigo to-indigo-light', updatedAt: '1 day ago' },
  { id: '8', name: 'API Testing Ground', author: 'apitest', description: 'Test API skills with mock endpoints', runtime: 'Node.js 20', likes: 670, emoji: '🔌', color: 'from-amber to-teal', updatedAt: '2 days ago' },
  { id: '9', name: 'Data Viz Studio', author: 'vizlab', description: 'Create data visualizations from context datasets', runtime: 'Python 3.11', likes: 1560, emoji: '📈', color: 'from-coral to-amber', updatedAt: '5 hours ago' },
  { id: '10', name: 'Security Scanner', author: 'seclab', description: 'Run security audit skills in isolated environment', runtime: 'Docker', likes: 780, emoji: '🔒', color: 'from-indigo to-coral-dark', updatedAt: '8 hours ago' },
];

export const organizations = [
  { name: 'SkillsAI', type: 'Enterprise', skills: 342, followers: 12400 },
  { name: 'FlowCraft', type: 'Team', skills: 156, followers: 8900 },
  { name: 'AutomateIO', type: 'Enterprise', skills: 89, followers: 5600 },
  { name: 'NLP Lab', type: 'Research', skills: 234, followers: 15200 },
  { name: 'DevOps AI', type: 'Company', skills: 67, followers: 4300 },
  { name: 'SecLab', type: 'Research', skills: 45, followers: 3100 },
  { name: 'DocSmith', type: 'Team', skills: 78, followers: 6700 },
  { name: 'CodeForge', type: 'Enterprise', skills: 198, followers: 11800 },
];

export const openSourceProjects = [
  { name: 'SkillsKit', stars: 24650, description: 'Core SDK for building and sharing skills' },
  { name: 'ContextLoader', stars: 18920, description: 'Efficient context dataset loading and preprocessing' },
  { name: 'AgentFlow', stars: 31200, description: 'Visual agent workflow orchestration framework' },
  { name: 'PromptForge', stars: 15800, description: 'Prompt engineering toolkit with version control' },
  { name: 'PlaygroundRuntime', stars: 12400, description: 'Sandboxed execution runtime for skill playgrounds' },
  { name: 'SkillsHub CLI', stars: 9870, description: 'Command-line interface for SkillsHub platform' },
  { name: 'AutoRPA', stars: 21300, description: 'RPA automation framework with AI capabilities' },
  { name: 'SkillsHub.js', stars: 8450, description: 'JavaScript client library for SkillsHub API' },
  { name: 'ContextQL', stars: 6780, description: 'Query language for context datasets' },
  { name: 'SkillsBench', stars: 11200, description: 'Benchmarking suite for skill evaluation' },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For individuals getting started',
    features: [
      'Unlimited public skills',
      'Basic playground (2 hrs/day)',
      'Community support',
      '5 GB context storage',
      'Public API access',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/month',
    description: 'For professional developers',
    features: [
      'Everything in Free',
      'Private skills & contexts',
      'Extended playground (8 hrs/day)',
      '50 GB context storage',
      'Priority API access',
      'Advanced analytics',
      'Email support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$45',
    period: '/user/month',
    description: 'For teams building together',
    features: [
      'Everything in Pro',
      'Team workspaces',
      'Unlimited playground',
      '500 GB shared storage',
      'SSO & SAML',
      'Audit logs',
      'Priority support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const enterpriseFeatures = [
  { title: 'Single Sign-On', description: 'SAML 2.0 and OIDC integration with your identity provider', icon: 'shield' },
  { title: 'Private Deployment', description: 'Deploy SkillsHub on your own infrastructure or VPC', icon: 'server' },
  { title: 'Audit Logs', description: 'Complete audit trail of all platform activities', icon: 'clipboard' },
  { title: 'Role-Based Access', description: 'Fine-grained permissions and resource group management', icon: 'users' },
  { title: 'Priority Support', description: 'Dedicated support team with SLA guarantees', icon: 'headphones' },
  { title: 'Custom Integrations', description: 'Connect with your existing CI/CD and DevOps tools', icon: 'plug' },
  { title: 'Data Residency', description: 'Choose where your data is stored and processed', icon: 'globe' },
  { title: 'Advanced Analytics', description: 'Deep insights into skill usage and team productivity', icon: 'chart' },
];

export const docsSections = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'introduction' },
      { title: 'Quick Start', slug: 'quick-start' },
      { title: 'Installation', slug: 'installation' },
      { title: 'Authentication', slug: 'authentication' },
    ],
  },
  {
    title: 'Skills',
    items: [
      { title: 'Creating a Skill', slug: 'creating-skill' },
      { title: 'Skill Card (README)', slug: 'skill-card' },
      { title: 'Version Control', slug: 'version-control' },
      { title: 'Publishing', slug: 'publishing' },
    ],
  },
  {
    title: 'Contexts',
    items: [
      { title: 'Uploading Contexts', slug: 'uploading-contexts' },
      { title: 'Data Formats', slug: 'data-formats' },
      { title: 'Context Viewer', slug: 'context-viewer' },
      { title: 'Versioning', slug: 'versioning' },
    ],
  },
  {
    title: 'Playgrounds',
    items: [
      { title: 'Creating a Playground', slug: 'creating-playground' },
      { title: 'Runtime Configuration', slug: 'runtime-config' },
      { title: 'Environment Variables', slug: 'env-variables' },
      { title: 'Custom Domains', slug: 'custom-domains' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'REST API', slug: 'rest-api' },
      { title: 'Inference API', slug: 'inference-api' },
      { title: 'Webhooks', slug: 'webhooks' },
      { title: 'Rate Limits', slug: 'rate-limits' },
    ],
  },
];

export const skillTags = [
  'All', 'Prompt', 'Agent', 'Tool', 'RPA', 'NLP', 'Code', 'Data', 'DevOps',
  'Security', 'Documentation', 'Testing', 'Automation', 'Translation', 'Writing',
];

export const contextTags = [
  'All', 'Code', 'NLP', 'API', 'Automation', 'Security', 'DevOps', 'UI',
  'Blog', 'Debugging', 'Benchmark', 'Dialog',
];

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function getTypeIcon(type: string): string {
  switch (type) {
    case 'prompt': return '●';
    case 'agent': return '▲';
    case 'tool': return '■';
    case 'rpa': return '◆';
    default: return '●';
  }
}

export function getTypeColor(type: string): string {
  switch (type) {
    case 'prompt': return 'text-coral';
    case 'agent': return 'text-teal';
    case 'tool': return 'text-indigo';
    case 'rpa': return 'text-amber';
    default: return 'text-coral';
  }
}

export function getTypeBgColor(type: string): string {
  switch (type) {
    case 'prompt': return 'bg-coral/10 text-coral';
    case 'agent': return 'bg-teal/10 text-teal';
    case 'tool': return 'bg-indigo/10 text-indigo-light';
    case 'rpa': return 'bg-amber/10 text-amber';
    default: return 'bg-coral/10 text-coral';
  }
}
