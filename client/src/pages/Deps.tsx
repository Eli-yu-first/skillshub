/**
 * Deps (Agents Market) - Main page for browsing, creating, and deploying AI Agents
 * Users can combine multiple Skills + LLMs to build custom Agents
 * Supports one-click sandbox deployment
 */
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Search, Plus, Bot, Zap, Play, Filter,
  Rocket, Star, TrendingUp, Clock, ArrowRight,
  Cpu, Layers, GitBranch, Users, ChevronRight,
  Sparkles, Shield, Globe, Terminal, Box
} from 'lucide-react';
import { motion } from 'framer-motion';

// ── Types ──
interface AgentCard {
  id: string;
  name: string;
  slug: string;
  author: string;
  description: string;
  skills: string[];
  models: string[];
  status: 'published' | 'deployed' | 'draft';
  likes: number;
  runs: number;
  category: string;
  tags: string[];
  deployUrl?: string;
  createdAt: string;
}

// ── Mock Data ──
const featuredAgents: AgentCard[] = [
  {
    id: '1', name: 'Full-Stack Dev Agent', slug: 'fullstack-dev-agent', author: 'skillsai',
    description: 'End-to-end web development agent that handles frontend, backend, database design, and deployment. Combines React, Node.js, and PostgreSQL skills.',
    skills: ['React Component Builder', 'Node.js API Generator', 'SQL Schema Designer', 'Docker Deployer'],
    models: ['GPT-4o', 'Claude 3.5 Sonnet'],
    status: 'deployed', likes: 2847, runs: 15620, category: 'Development',
    tags: ['web-dev', 'full-stack', 'react', 'node'],
    deployUrl: 'https://sandbox.skillshub.dev/fullstack-dev', createdAt: '2 days ago'
  },
  {
    id: '2', name: 'Research Paper Analyst', slug: 'research-paper-analyst', author: 'academicai',
    description: 'Analyzes academic papers, extracts key findings, generates literature reviews, and creates citation graphs. Perfect for researchers and students.',
    skills: ['Paper Summarizer', 'Citation Formatter', 'Literature Review Writer', 'Data Extractor'],
    models: ['GPT-4o', 'Gemini 1.5 Pro'],
    status: 'deployed', likes: 1923, runs: 8450, category: 'Research',
    tags: ['academic', 'research', 'papers', 'analysis'],
    deployUrl: 'https://sandbox.skillshub.dev/research-analyst', createdAt: '5 days ago'
  },
  {
    id: '3', name: 'Marketing Campaign Builder', slug: 'marketing-campaign-builder', author: 'marketai',
    description: 'Creates comprehensive marketing campaigns including copy, visuals, A/B test variants, and analytics dashboards. Multi-channel support.',
    skills: ['Ad Copy Writer', 'SEO Optimizer', 'Social Media Scheduler', 'Analytics Reporter'],
    models: ['Claude 3.5 Sonnet', 'GPT-4o'],
    status: 'published', likes: 1456, runs: 6230, category: 'Marketing',
    tags: ['marketing', 'seo', 'social-media', 'analytics'],
    createdAt: '1 week ago'
  },
  {
    id: '4', name: 'Legal Document Drafter', slug: 'legal-document-drafter', author: 'legalai',
    description: 'Drafts legal documents including contracts, NDAs, terms of service, and compliance reports. Supports multiple jurisdictions.',
    skills: ['Contract Generator', 'NDA Builder', 'Compliance Checker', 'Legal Clause Library'],
    models: ['GPT-4o', 'Claude 3.5 Sonnet'],
    status: 'deployed', likes: 1234, runs: 5670, category: 'Legal',
    tags: ['legal', 'contracts', 'compliance', 'nda'],
    deployUrl: 'https://sandbox.skillshub.dev/legal-drafter', createdAt: '3 days ago'
  },
  {
    id: '5', name: 'Data Pipeline Architect', slug: 'data-pipeline-architect', author: 'dataops',
    description: 'Designs and implements ETL pipelines, data warehouses, and real-time streaming architectures. Supports AWS, GCP, and Azure.',
    skills: ['ETL Designer', 'Schema Optimizer', 'Airflow DAG Generator', 'Data Quality Monitor'],
    models: ['GPT-4o', 'Gemini 1.5 Pro'],
    status: 'published', likes: 987, runs: 4320, category: 'Data Engineering',
    tags: ['data', 'etl', 'pipeline', 'cloud'],
    createdAt: '4 days ago'
  },
  {
    id: '6', name: 'UI/UX Design System Agent', slug: 'design-system-agent', author: 'designai',
    description: 'Generates complete design systems with component libraries, color palettes, typography scales, and responsive layouts.',
    skills: ['Color Palette Generator', 'Component Library Builder', 'Responsive Layout Designer', 'Accessibility Checker'],
    models: ['Claude 3.5 Sonnet', 'GPT-4o'],
    status: 'deployed', likes: 1567, runs: 7890, category: 'Design',
    tags: ['design', 'ui-ux', 'components', 'accessibility'],
    deployUrl: 'https://sandbox.skillshub.dev/design-system', createdAt: '1 day ago'
  },
];

const agentCategories = [
  'All', 'Development', 'Research', 'Marketing', 'Legal', 'Data Engineering',
  'Design', 'Education', 'Healthcare', 'Finance', 'Content Creation',
  'DevOps', 'Security', 'E-commerce', 'Customer Service'
];

const availableModels = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '🟢' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', icon: '🟢' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: '🟠' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', icon: '🟠' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', icon: '🔵' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', icon: '🔵' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta', icon: '🟣' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', icon: '🔴' },
  { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba', icon: '🟡' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', icon: '⚪' },
];

const platformStats = [
  { label: 'Agents Created', value: '12,450+', icon: <Bot className="w-5 h-5" /> },
  { label: 'Total Runs', value: '2.8M+', icon: <Play className="w-5 h-5" /> },
  { label: 'Skills Combined', value: '45K+', icon: <Zap className="w-5 h-5" /> },
  { label: 'Active Deployments', value: '3,200+', icon: <Rocket className="w-5 h-5" /> },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function Deps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'most-runs' | 'most-liked'>('trending');

  const filteredAgents = useMemo(() => {
    let result = [...featuredAgents];
    if (selectedCategory !== 'All') {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.tags.some(t => t.includes(q))
      );
    }
    switch (sortBy) {
      case 'most-runs': result.sort((a, b) => b.runs - a.runs); break;
      case 'most-liked': result.sort((a, b) => b.likes - a.likes); break;
      case 'newest': break;
      default: result.sort((a, b) => b.runs - a.runs);
    }
    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <Layout>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo via-indigo to-indigo-light py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border border-coral/20 rounded-full animate-[spin_40s_linear_infinite]" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-teal/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coral/5 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6">
              <Bot className="w-4 h-4 text-coral" />
              <span className="text-sm text-white/80 font-medium">Agents Marketplace</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5">
              Build & Deploy
              <br />
              <span className="text-coral">AI Agents</span> in Minutes
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              Combine multiple Skills with powerful LLMs to create custom AI agents.
              Deploy to sandboxed environments with one click.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              <Link href="/deps/create">
                <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-display font-semibold px-8 h-12 shadow-lg shadow-coral/25 transition-all hover:shadow-xl hover:-translate-y-0.5">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-display font-semibold px-8 h-12">
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
              {platformStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center text-coral/70 mb-1">{stat.icon}</div>
                  <div className="text-white font-display font-bold text-xl">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-muted/30 border-b border-border/40">
        <div className="container">
          <h2 className="font-display font-bold text-2xl text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: <Zap className="w-6 h-6" />, title: 'Select Skills', desc: 'Choose from 500+ reusable AI skills across 50 domains' },
              { step: '02', icon: <Cpu className="w-6 h-6" />, title: 'Choose Models', desc: 'Pick one or more LLMs: GPT-4o, Claude, Gemini, Llama, etc.' },
              { step: '03', icon: <Layers className="w-6 h-6" />, title: 'Configure Agent', desc: 'Set parameters, chain skills, define input/output schemas' },
              { step: '04', icon: <Rocket className="w-6 h-6" />, title: 'Deploy & Run', desc: 'One-click deploy to a sandboxed environment with API access' },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: parseInt(item.step) * 0.1 }}
                className="relative bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <div className="absolute -top-3 -left-1 text-5xl font-display font-black text-primary/5 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Models ── */}
      <section className="py-12 bg-background border-b border-border/40">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl">Supported Models</h2>
            <span className="text-sm text-muted-foreground">{availableModels.length} models available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {availableModels.map((model) => (
              <div key={model.id} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group">
                <span className="text-lg">{model.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{model.name}</p>
                  <p className="text-[11px] text-muted-foreground">{model.provider}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agent Browser ── */}
      <section className="py-12 bg-background">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl">Browse Agents</h2>
              <p className="text-sm text-muted-foreground mt-1">Discover community-built agents ready to use or fork</p>
            </div>
            <Link href="/deps/create">
              <Button className="bg-coral hover:bg-coral-dark text-white font-display font-semibold shadow-sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Create Agent
              </Button>
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search agents by name, description, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="trending">Trending</option>
              <option value="most-runs">Most Runs</option>
              <option value="most-liked">Most Liked</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {agentCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Agent Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredAgents.map((agent) => (
              <motion.div key={agent.id} variants={fadeInUp}>
                <Link href={`/deps/${agent.author}/${agent.slug}`}>
                  <div className="group bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-coral/20 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-sm group-hover:text-primary transition-colors">{agent.name}</h3>
                          <p className="text-[11px] text-muted-foreground">by {agent.author}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        agent.status === 'deployed'
                          ? 'bg-teal/10 text-teal border border-teal/20'
                          : agent.status === 'published'
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {agent.status === 'deployed' ? '● Live' : agent.status === 'published' ? '● Published' : '○ Draft'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{agent.description}</p>

                    {/* Skills Used */}
                    <div className="mb-3">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded bg-primary/5 text-[11px] text-primary/80 border border-primary/10">
                            {skill}
                          </span>
                        ))}
                        {agent.skills.length > 3 && (
                          <span className="px-2 py-0.5 rounded bg-muted text-[11px] text-muted-foreground">
                            +{agent.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Models */}
                    <div className="mb-4">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Models</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.models.map((model) => (
                          <span key={model} className="px-2 py-0.5 rounded bg-coral/5 text-[11px] text-coral/80 border border-coral/10">
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/60">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" /> {agent.runs.toLocaleString()} runs
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" /> {agent.likes.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{agent.createdAt}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-16">
              <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No agents found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 bg-gradient-to-br from-indigo via-indigo to-indigo-light">
        <div className="container text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to Build Your Agent?</h2>
          <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
            Combine the power of 500+ skills with leading LLMs. Deploy in seconds.
          </p>
          <Link href="/deps/create">
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-display font-semibold px-8 h-12 shadow-lg shadow-coral/25">
              <Plus className="w-4 h-4 mr-2" />
              Start Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

// Import for the hero section
import { BookOpen } from 'lucide-react';
