/**
 * Collections Page - Curated skill collections
 */
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Layers, Heart, Zap, Clock, User } from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  description: string;
  author: string;
  skillCount: number;
  likes: number;
  updatedAt: string;
  tags: string[];
}

const collections: Collection[] = [
  { id: '1', title: 'Essential Code Review Tools', description: 'The best skills for automated code review across all major languages', author: 'skillsai', skillCount: 24, likes: 1890, updatedAt: '2 days ago', tags: ['code-review', 'quality'] },
  { id: '2', title: 'Full-Stack Development Kit', description: 'Everything you need to build modern web applications with AI assistance', author: 'codeforge', skillCount: 36, likes: 2340, updatedAt: '1 week ago', tags: ['web-dev', 'full-stack'] },
  { id: '3', title: 'Data Science Essentials', description: 'Curated collection of data analysis, visualization, and ML skills', author: 'datalab', skillCount: 28, likes: 1560, updatedAt: '3 days ago', tags: ['data-science', 'ml'] },
  { id: '4', title: 'DevOps Automation Pack', description: 'CI/CD, infrastructure, and deployment automation skills', author: 'devopsai', skillCount: 18, likes: 980, updatedAt: '5 days ago', tags: ['devops', 'automation'] },
  { id: '5', title: 'Content Writing Suite', description: 'AI-powered writing tools for blogs, docs, and marketing copy', author: 'writecraft', skillCount: 15, likes: 1230, updatedAt: '1 day ago', tags: ['writing', 'content'] },
  { id: '6', title: 'Security Audit Toolkit', description: 'Comprehensive security scanning and vulnerability detection skills', author: 'seclab', skillCount: 12, likes: 870, updatedAt: '4 days ago', tags: ['security', 'audit'] },
  { id: '7', title: 'Multi-Agent Starter Pack', description: 'Pre-built agent templates for common multi-agent architectures', author: 'agentverse', skillCount: 20, likes: 2100, updatedAt: '2 days ago', tags: ['agents', 'multi-agent'] },
  { id: '8', title: 'API Development Tools', description: 'Skills for API design, documentation, testing, and monitoring', author: 'docsmith', skillCount: 22, likes: 1450, updatedAt: '1 week ago', tags: ['api', 'development'] },
];

export default function Collections() {
  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-7 h-7 text-primary" />
            <h1 className="font-display font-bold text-3xl">Collections</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Curated collections of skills organized by theme, use case, or workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {collections.map((col, i) => (
            <motion.div key={col.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/collections/${col.id}`}>
                <div className="group p-6 border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Heart className="w-3.5 h-3.5" />{col.likes}</span>
                  </div>
                  <h3 className="font-display font-semibold text-base mb-1.5 group-hover:text-primary transition-colors">{col.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{col.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{col.skillCount} skills</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{col.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{col.updatedAt}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {col.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{t}</span>)}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
