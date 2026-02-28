/**
 * Datasets Page - Traditional datasets for training and evaluation
 */
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Search, Heart, Download, Database, FileText, HardDrive } from 'lucide-react';
import { formatNumber } from '@/lib/data';

interface Dataset {
  id: string;
  name: string;
  author: string;
  description: string;
  size: string;
  format: string;
  rows: string;
  downloads: number;
  likes: number;
  updatedAt: string;
  tags: string[];
  license: string;
}

const datasets: Dataset[] = [
  { id: '1', name: 'SkillPrompts-1M', author: 'skillshub', description: 'One million curated AI prompts across 50 domains with quality ratings', size: '4.2 GB', format: 'Parquet', rows: '1,000,000', downloads: 234500, likes: 4520, updatedAt: '2 days ago', tags: ['prompts', 'nlp', 'curated'], license: 'Apache 2.0' },
  { id: '2', name: 'AgentTraces-500K', author: 'agentverse', description: 'Agent execution traces with step-by-step reasoning chains', size: '8.7 GB', format: 'JSONL', rows: '500,000', downloads: 178900, likes: 3890, updatedAt: '1 week ago', tags: ['agents', 'reasoning', 'traces'], license: 'MIT' },
  { id: '3', name: 'CodeReview-Pairs', author: 'skillsai', description: 'Code before/after pairs with review comments for training', size: '12.3 GB', format: 'Parquet', rows: '2,500,000', downloads: 345200, likes: 5670, updatedAt: '3 days ago', tags: ['code', 'review', 'training'], license: 'Apache 2.0' },
  { id: '4', name: 'AutomationScripts-DB', author: 'automate-io', description: 'RPA and automation scripts with documentation', size: '3.1 GB', format: 'JSON', rows: '150,000', downloads: 89700, likes: 1890, updatedAt: '5 days ago', tags: ['rpa', 'automation', 'scripts'], license: 'MIT' },
  { id: '5', name: 'MultiLang-Instructions', author: 'polyglot', description: 'Instruction-following dataset in 40+ languages', size: '15.8 GB', format: 'Parquet', rows: '5,000,000', downloads: 456700, likes: 7230, updatedAt: '1 day ago', tags: ['multilingual', 'instructions', 'nlp'], license: 'CC-BY-4.0' },
  { id: '6', name: 'API-Specs-Collection', author: 'docsmith', description: 'OpenAPI specifications from 50K+ public APIs', size: '6.4 GB', format: 'YAML/JSON', rows: '50,000', downloads: 123400, likes: 2340, updatedAt: '1 week ago', tags: ['api', 'openapi', 'documentation'], license: 'Apache 2.0' },
  { id: '7', name: 'SecurityVuln-Reports', author: 'seclab', description: 'Security vulnerability reports with CVE mappings', size: '2.8 GB', format: 'JSONL', rows: '280,000', downloads: 67800, likes: 1560, updatedAt: '4 days ago', tags: ['security', 'vulnerabilities', 'cve'], license: 'CC-BY-NC-4.0' },
  { id: '8', name: 'DevOps-Configs-10K', author: 'opsdata', description: 'Production DevOps configurations (K8s, Docker, Terraform)', size: '1.9 GB', format: 'Mixed', rows: '10,000', downloads: 45600, likes: 980, updatedAt: '2 weeks ago', tags: ['devops', 'kubernetes', 'terraform'], license: 'MIT' },
  { id: '9', name: 'UI-Accessibility-Tests', author: 'designdata', description: 'UI component accessibility test cases and results', size: '890 MB', format: 'JSON', rows: '75,000', downloads: 34200, likes: 780, updatedAt: '1 week ago', tags: ['ui', 'accessibility', 'testing'], license: 'Apache 2.0' },
  { id: '10', name: 'ChatBot-Conversations', author: 'chatdata', description: 'Multi-turn chatbot conversations with quality annotations', size: '7.5 GB', format: 'Parquet', rows: '3,200,000', downloads: 289300, likes: 4120, updatedAt: '3 days ago', tags: ['chatbot', 'dialog', 'nlp'], license: 'CC-BY-4.0' },
];

const datasetTags = ['All', 'prompts', 'agents', 'code', 'nlp', 'multilingual', 'api', 'security', 'devops', 'automation'];

export default function Datasets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'downloads' | 'likes'>('trending');

  const filtered = datasets
    .filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag === 'All' || d.tags.includes(selectedTag);
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'likes') return b.likes - a.likes;
      return b.downloads - a.downloads;
    });

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-7 h-7 text-primary" />
            <h1 className="font-display font-bold text-3xl">Datasets</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover and download datasets for training, fine-tuning, and evaluating AI skills. Community-contributed and professionally curated.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search datasets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
            {(['trending', 'downloads', 'likes'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${sortBy === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {datasetTags.map(tag => (
            <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${selectedTag === tag ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'}`}>
              {tag}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} datasets</p>

        <div className="space-y-3">
          {filtered.map((dataset, i) => (
            <motion.div key={dataset.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link href={`/datasets/${dataset.author}/${dataset.name}`}>
                <div className="group p-4 border border-border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all bg-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-primary">{dataset.author}/</span>
                        <span className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{dataset.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{dataset.description}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-muted-foreground/70">Updated {dataset.updatedAt}</span>
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"><HardDrive className="w-3 h-3" />{dataset.size}</span>
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"><FileText className="w-3 h-3" />{dataset.format}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{dataset.rows} rows</span>
                        {dataset.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 border border-border rounded-full text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{formatNumber(dataset.downloads)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatNumber(dataset.likes)}</span>
                    </div>
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
