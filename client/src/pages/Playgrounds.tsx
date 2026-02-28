/**
 * Playgrounds Page - Bauhaus Industrial Design
 * Modeled after HuggingFace /spaces page
 * Card grid with colorful playground previews and enhanced interactions
 */
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { Search, Heart, Cpu, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { allPlaygrounds, formatNumber } from '@/lib/data';

const runtimeFilters = ['All', 'Python 3.11', 'Node.js 20', 'Jupyter', 'Docker'];

const gradients = [
  'from-[#1E1B4B] to-[#312E81]',
  'from-[#1E1B4B] via-[#2D2A6E] to-[#14B8A6]',
  'from-[#312E81] to-[#FF6B4A]',
  'from-[#0F766E] to-[#1E1B4B]',
  'from-[#1E1B4B] to-[#D97706]',
  'from-[#7C3AED] to-[#1E1B4B]',
  'from-[#1E1B4B] via-[#3B0764] to-[#FF6B4A]',
  'from-[#0E7490] to-[#312E81]',
  'from-[#1E1B4B] to-[#059669]',
  'from-[#9333EA] to-[#1E1B4B]',
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Playgrounds() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRuntime, setSelectedRuntime] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'likes'>('trending');

  const filteredPlaygrounds = useMemo(() => {
    let filtered = allPlaygrounds;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (selectedRuntime !== 'All') {
      filtered = filtered.filter(p => p.runtime === selectedRuntime);
    }
    if (sortBy === 'likes') return [...filtered].sort((a, b) => b.likes - a.likes);
    return filtered;
  }, [searchQuery, selectedRuntime, sortBy]);

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl">Playgrounds</h1>
                <p className="text-muted-foreground text-sm mt-1">Discover and run 10,000+ interactive skill playgrounds</p>
              </div>
              <Link href="/playgrounds/new">
                <Button className="bg-teal hover:bg-teal/90 text-white font-display font-semibold shadow-sm shadow-teal/15">
                  New Playground
                </Button>
              </Link>
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal/40 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal/20"
              >
                <option value="trending">Trending</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>

            {/* Runtime Filters */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {runtimeFilters.map((rt) => (
                <button
                  key={rt}
                  onClick={() => setSelectedRuntime(rt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                    selectedRuntime === rt
                      ? 'bg-teal text-white shadow-sm shadow-teal/20'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {rt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Playground Grid */}
        <div className="container py-6">
          <p className="text-sm text-muted-foreground mb-4">
            Showing <span className="font-medium text-foreground">{filteredPlaygrounds.length}</span> playgrounds
          </p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredPlaygrounds.map((pg, idx) => (
              <motion.div key={pg.id} variants={fadeIn}>
                <Link href={`/playgrounds/${pg.author}/${pg.name}`}>
                  <div className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300">
                    {/* Colored Header with gradient */}
                    <div className={`h-36 bg-gradient-to-br ${gradients[idx % gradients.length]} relative flex items-center justify-center overflow-hidden`}>
                      {/* Geometric decorations */}
                      <div className="absolute top-3 left-4 w-8 h-8 border border-white/8 rounded-full" />
                      <div className="absolute bottom-4 right-5 w-5 h-5 bg-white/5 rotate-45" />
                      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/10 rounded-full" />
                      
                      <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{pg.emoji}</span>
                      
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/12 backdrop-blur-sm rounded-full px-2.5 py-1">
                        <Heart className="w-3 h-3 text-white/80" />
                        <span className="text-xs text-white/80 font-medium">{formatNumber(pg.likes)}</span>
                      </div>
                      
                      {/* Run button overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                          <Play className="w-4 h-4 text-indigo ml-0.5" />
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold group-hover:text-teal transition-colors truncate">{pg.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{pg.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{pg.author}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Cpu className="w-3 h-3" />
                          <span>{pg.runtime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredPlaygrounds.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-lg mb-1">No playgrounds found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
