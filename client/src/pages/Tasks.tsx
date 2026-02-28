/**
 * Tasks Page - Browse skills by task category
 */
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Code2, FileText, MessageSquare, Search as SearchIcon, Shield, Wrench,
  Globe, BarChart3, Zap, Bot, Palette, Database, BookOpen, Terminal,
  Workflow, Bug, FileCode, Mic, Image, Video
} from 'lucide-react';

interface TaskCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  skillCount: number;
  color: string;
}

const taskCategories: TaskCategory[] = [
  { id: 'code-generation', name: 'Code Generation', description: 'Generate code from natural language descriptions', icon: <Code2 className="w-6 h-6" />, skillCount: 4230, color: 'bg-blue-500/10 text-blue-600' },
  { id: 'code-review', name: 'Code Review', description: 'Automated code review and quality analysis', icon: <Bug className="w-6 h-6" />, skillCount: 2180, color: 'bg-red-500/10 text-red-600' },
  { id: 'text-generation', name: 'Text Generation', description: 'Generate text content for various purposes', icon: <FileText className="w-6 h-6" />, skillCount: 8920, color: 'bg-green-500/10 text-green-600' },
  { id: 'summarization', name: 'Summarization', description: 'Summarize documents, articles, and conversations', icon: <BookOpen className="w-6 h-6" />, skillCount: 3450, color: 'bg-purple-500/10 text-purple-600' },
  { id: 'translation', name: 'Translation', description: 'Translate text between languages', icon: <Globe className="w-6 h-6" />, skillCount: 2890, color: 'bg-cyan-500/10 text-cyan-600' },
  { id: 'chatbot', name: 'Chatbot / Dialog', description: 'Build conversational AI assistants', icon: <MessageSquare className="w-6 h-6" />, skillCount: 5670, color: 'bg-orange-500/10 text-orange-600' },
  { id: 'data-analysis', name: 'Data Analysis', description: 'Analyze and visualize data automatically', icon: <BarChart3 className="w-6 h-6" />, skillCount: 3120, color: 'bg-indigo-500/10 text-indigo-600' },
  { id: 'automation', name: 'Automation / RPA', description: 'Automate repetitive tasks and workflows', icon: <Workflow className="w-6 h-6" />, skillCount: 4560, color: 'bg-amber-500/10 text-amber-600' },
  { id: 'security', name: 'Security Audit', description: 'Security scanning and vulnerability detection', icon: <Shield className="w-6 h-6" />, skillCount: 1890, color: 'bg-rose-500/10 text-rose-600' },
  { id: 'api-integration', name: 'API Integration', description: 'Connect and orchestrate APIs', icon: <Zap className="w-6 h-6" />, skillCount: 2340, color: 'bg-yellow-500/10 text-yellow-600' },
  { id: 'agent-orchestration', name: 'Agent Orchestration', description: 'Multi-agent systems and workflow orchestration', icon: <Bot className="w-6 h-6" />, skillCount: 1670, color: 'bg-teal-500/10 text-teal-600' },
  { id: 'documentation', name: 'Documentation', description: 'Auto-generate technical documentation', icon: <FileCode className="w-6 h-6" />, skillCount: 2780, color: 'bg-slate-500/10 text-slate-600' },
  { id: 'testing', name: 'Testing', description: 'Generate and run automated tests', icon: <Terminal className="w-6 h-6" />, skillCount: 2450, color: 'bg-emerald-500/10 text-emerald-600' },
  { id: 'design', name: 'Design / UI', description: 'UI design generation and prototyping', icon: <Palette className="w-6 h-6" />, skillCount: 1230, color: 'bg-pink-500/10 text-pink-600' },
  { id: 'devops', name: 'DevOps', description: 'CI/CD, infrastructure, and deployment automation', icon: <Wrench className="w-6 h-6" />, skillCount: 1890, color: 'bg-sky-500/10 text-sky-600' },
  { id: 'data-processing', name: 'Data Processing', description: 'ETL pipelines and data transformation', icon: <Database className="w-6 h-6" />, skillCount: 2670, color: 'bg-violet-500/10 text-violet-600' },
  { id: 'speech', name: 'Speech / Audio', description: 'Speech recognition, synthesis, and audio processing', icon: <Mic className="w-6 h-6" />, skillCount: 890, color: 'bg-fuchsia-500/10 text-fuchsia-600' },
  { id: 'image', name: 'Image Processing', description: 'Image generation, editing, and analysis', icon: <Image className="w-6 h-6" />, skillCount: 1560, color: 'bg-lime-500/10 text-lime-600' },
  { id: 'video', name: 'Video Processing', description: 'Video generation, editing, and analysis', icon: <Video className="w-6 h-6" />, skillCount: 670, color: 'bg-red-400/10 text-red-500' },
  { id: 'search', name: 'Search / Retrieval', description: 'Semantic search and information retrieval', icon: <SearchIcon className="w-6 h-6" />, skillCount: 2340, color: 'bg-blue-400/10 text-blue-500' },
];

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = taskCategories.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl mb-2">Tasks</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse skills organized by task type. Find the right skill for your specific use case.
          </p>
        </motion.div>

        <div className="relative max-w-md mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link href={`/skills?task=${task.id}`}>
                <div className="group p-5 border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card h-full">
                  <div className={`w-12 h-12 rounded-xl ${task.color} flex items-center justify-center mb-4`}>
                    {task.icon}
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{task.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                  <p className="text-xs font-medium text-primary">{task.skillCount.toLocaleString()} skills</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
