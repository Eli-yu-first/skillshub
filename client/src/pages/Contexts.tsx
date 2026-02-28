/**
 * Contexts Page - Bauhaus Industrial Design
 * Modeled after HuggingFace /datasets page
 * Enhanced with animations and visual polish
 */
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { Search, Heart, Download, Database, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { allContexts, contextTags, formatNumber } from '@/lib/data';

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Contexts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'likes' | 'downloads'>('trending');

  const filteredContexts = useMemo(() => {
    let filtered = allContexts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    if (selectedTag !== 'All') {
      const tagLower = selectedTag.toLowerCase();
      filtered = filtered.filter(c => c.tags.some(t => t.toLowerCase().includes(tagLower)));
    }
    switch (sortBy) {
      case 'likes': return [...filtered].sort((a, b) => b.likes - a.likes);
      case 'downloads': return [...filtered].sort((a, b) => b.downloads - a.downloads);
      default: return [...filtered].sort((a, b) => b.downloads + b.likes - a.downloads - a.likes);
    }
  }, [searchQuery, selectedTag, sortBy]);

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl">Contexts</h1>
                <p className="text-muted-foreground text-sm mt-1">Browse and discover 100,000+ context datasets for your skills</p>
              </div>
              <Link href="/contexts/new">
                <Button className="bg-amber hover:bg-amber/90 text-indigo font-display font-semibold shadow-sm shadow-amber/15">
                  New Context
                </Button>
              </Link>
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by name, author, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber/20 focus:border-amber/40 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-amber/20"
              >
                <option value="trending">Trending</option>
                <option value="likes">Most Liked</option>
                <option value="downloads">Most Downloaded</option>
              </select>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {contextTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                    selectedTag === tag
                      ? 'bg-amber text-indigo shadow-sm shadow-amber/20'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Context List */}
        <div className="container py-6">
          <p className="text-sm text-muted-foreground mb-4">
            Showing <span className="font-medium text-foreground">{filteredContexts.length}</span> contexts
            {selectedTag !== 'All' && <> filtered by <span className="font-medium text-amber">{selectedTag}</span></>}
          </p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-2"
          >
            {filteredContexts.map((ctx) => (
              <motion.div key={ctx.id} variants={fadeIn}>
                <Link href={`/contexts/${ctx.author}/${ctx.name}`}>
                  <div className="group flex items-start gap-4 p-4 rounded-xl border border-border hover:border-amber/25 hover:shadow-md hover:shadow-amber/5 bg-card transition-all duration-200">
                    <div className="w-10 h-10 rounded-lg bg-amber/8 flex items-center justify-center shrink-0 group-hover:bg-amber group-hover:text-white transition-all duration-200">
                      <Database className="w-5 h-5 text-amber group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold group-hover:text-amber transition-colors">
                          {ctx.author}<span className="text-muted-foreground/50">/</span>{ctx.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ctx.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">Updated {ctx.updatedAt}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <HardDrive className="w-3 h-3" /> {ctx.size}
                        </span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{ctx.format}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Download className="w-3 h-3" /> {formatNumber(ctx.downloads)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="w-3 h-3" /> {formatNumber(ctx.likes)}
                        </span>
                        <div className="flex gap-1.5 ml-auto">
                          {ctx.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredContexts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-lg mb-1">No contexts found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
