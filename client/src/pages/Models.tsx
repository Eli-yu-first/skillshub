/**
 * Models Page - AI Models compatible with SkillsHub Skills
 */
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown, Heart, Download, Filter, Cpu, ChevronRight, Zap, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/data';

interface Model {
  id: string;
  name: string;
  author: string;
  description: string;
  provider: string;
  params: string;
  license: string;
  likes: number;
  downloads: number;
  updatedAt: string;
  tags: string[];
  isOpen: boolean;
}

const models: Model[] = [
  { id: '1', name: 'GPT-4o', author: 'openai', description: 'Multimodal model with advanced reasoning and vision capabilities', provider: 'OpenAI', params: '~1.8T', license: 'Proprietary', likes: 45200, downloads: 2340000, updatedAt: '1 day ago', tags: ['text-generation', 'multimodal', 'reasoning'], isOpen: false },
  { id: '2', name: 'Claude-3.5-Sonnet', author: 'anthropic', description: 'High-performance model with strong coding and analysis capabilities', provider: 'Anthropic', params: 'Unknown', license: 'Proprietary', likes: 38900, downloads: 1890000, updatedAt: '3 days ago', tags: ['text-generation', 'coding', 'analysis'], isOpen: false },
  { id: '3', name: 'Llama-3.1-405B', author: 'meta', description: 'Open-source large language model with state-of-the-art performance', provider: 'Meta', params: '405B', license: 'Llama 3.1', likes: 52100, downloads: 3120000, updatedAt: '1 week ago', tags: ['text-generation', 'open-source'], isOpen: true },
  { id: '4', name: 'Qwen2.5-72B', author: 'qwen', description: 'Multilingual model with strong performance across benchmarks', provider: 'Alibaba', params: '72B', license: 'Apache 2.0', likes: 28700, downloads: 1560000, updatedAt: '2 days ago', tags: ['text-generation', 'multilingual'], isOpen: true },
  { id: '5', name: 'DeepSeek-V3', author: 'deepseek', description: 'Mixture-of-experts model with efficient inference', provider: 'DeepSeek', params: '671B MoE', license: 'MIT', likes: 41300, downloads: 2780000, updatedAt: '5 days ago', tags: ['text-generation', 'moe', 'coding'], isOpen: true },
  { id: '6', name: 'Gemini-2.0-Flash', author: 'google', description: 'Fast multimodal model optimized for speed and efficiency', provider: 'Google', params: 'Unknown', license: 'Proprietary', likes: 33400, downloads: 1920000, updatedAt: '4 days ago', tags: ['multimodal', 'fast-inference'], isOpen: false },
  { id: '7', name: 'Mistral-Large-2', author: 'mistralai', description: 'Flagship model with strong multilingual and coding capabilities', provider: 'Mistral AI', params: '123B', license: 'Apache 2.0', likes: 24800, downloads: 1340000, updatedAt: '1 week ago', tags: ['text-generation', 'multilingual', 'coding'], isOpen: true },
  { id: '8', name: 'Phi-4', author: 'microsoft', description: 'Small but powerful model with strong reasoning', provider: 'Microsoft', params: '14B', license: 'MIT', likes: 19600, downloads: 980000, updatedAt: '3 days ago', tags: ['text-generation', 'small-model', 'reasoning'], isOpen: true },
  { id: '9', name: 'FLUX.1-dev', author: 'black-forest-labs', description: 'State-of-the-art text-to-image generation model', provider: 'BFL', params: '12B', license: 'Apache 2.0', likes: 35200, downloads: 2100000, updatedAt: '2 weeks ago', tags: ['image-generation', 'diffusion'], isOpen: true },
  { id: '10', name: 'Whisper-large-v3', author: 'openai', description: 'Robust speech recognition model supporting 99 languages', provider: 'OpenAI', params: '1.5B', license: 'MIT', likes: 22100, downloads: 1670000, updatedAt: '1 month ago', tags: ['speech-recognition', 'multilingual'], isOpen: true },
  { id: '11', name: 'Command-R+', author: 'cohere', description: 'Enterprise-grade model optimized for RAG and tool use', provider: 'Cohere', params: '104B', license: 'CC-BY-NC', likes: 15800, downloads: 780000, updatedAt: '2 weeks ago', tags: ['text-generation', 'rag', 'tool-use'], isOpen: true },
  { id: '12', name: 'Stable-Diffusion-3.5', author: 'stabilityai', description: 'Advanced image generation with improved text rendering', provider: 'Stability AI', params: '8B', license: 'Stability AI', likes: 29400, downloads: 1890000, updatedAt: '3 weeks ago', tags: ['image-generation', 'diffusion'], isOpen: true },
];

const modelTags = ['All', 'text-generation', 'multimodal', 'coding', 'image-generation', 'speech-recognition', 'open-source', 'multilingual', 'reasoning'];

export default function Models() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'downloads' | 'likes' | 'updated'>('trending');
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const filtered = models
    .filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.author.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag === 'All' || m.tags.includes(selectedTag);
      const matchOpen = !showOpenOnly || m.isOpen;
      return matchSearch && matchTag && matchOpen;
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
            <Cpu className="w-7 h-7 text-primary" />
            <h1 className="font-display font-bold text-3xl">Models</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse AI models compatible with SkillsHub. Use these models to power your Skills, or integrate them into your Agents and Playgrounds.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={showOpenOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOpenOnly(!showOpenOnly)}
              className="gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              Open Source Only
            </Button>
            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
              {(['trending', 'downloads', 'likes'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${sortBy === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {modelTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} models</p>

        <div className="space-y-3">
          {filtered.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/models/${model.author}/${model.name}`}>
                <div className="group p-4 border border-border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all bg-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-primary">{model.author}/</span>
                        <span className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{model.name}</span>
                        {model.isOpen ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-teal/10 text-teal rounded-full">
                            <Globe className="w-3 h-3" /> Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-full">
                            <Lock className="w-3 h-3" /> Proprietary
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{model.description}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-muted-foreground/70">Updated {model.updatedAt}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{model.params} params</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{model.provider}</span>
                        {model.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 border border-border rounded-full text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{formatNumber(model.downloads)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatNumber(model.likes)}</span>
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
