/**
 * Skills Page - Connected to tRPC backend
 * Modeled after HuggingFace /models page
 */
import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { Search, Heart, Download, SlidersHorizontal, X, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { formatNumber, getTypeIcon, getTypeColor, getTypeBgColor } from '@/lib/data';

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'trending' | 'likes' | 'downloads' | 'recent' | 'alphabetical'>('trending');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data from tRPC
  const { data: categoriesData, isLoading: catsLoading } = trpc.categories.list.useQuery();
  const { data: skillsData, isLoading: skillsLoading } = trpc.skills.list.useQuery({
    limit: 200,
    categoryId: selectedCategory !== 'All' ? Number(selectedCategory) : undefined,
    search: searchQuery || undefined,
  });

  const categories = categoriesData ?? [];
  const skills = skillsData?.items ?? [];

  const sortedSkills = useMemo(() => {
    const list = [...skills];
    switch (sortBy) {
      case 'likes': return list.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
      case 'downloads': return list.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
      case 'recent': return list.sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());
      case 'alphabetical': return list.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      default: return list.sort((a, b) => ((b.downloads ?? 0) + (b.likes ?? 0)) - ((a.downloads ?? 0) + (a.likes ?? 0)));
    }
  }, [skills, sortBy]);

  const isLoading = catsLoading || skillsLoading;

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl">Skills</h1>
                <p className="text-muted-foreground text-sm mt-1">Browse and discover {skillsData?.total ? `${skillsData.total}+` : ''} reusable AI skills</p>
              </div>
              <Link href="/skills/new">
                <Button className="bg-coral hover:bg-coral-dark text-white font-display font-semibold shadow-sm shadow-coral/15">
                  New Skill
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
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral/40 transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-coral/20"
              >
                <option value="trending">Trending</option>
                <option value="likes">Most Liked</option>
                <option value="downloads">Most Downloaded</option>
                <option value="recent">Recently Updated</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container py-6">
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-56 shrink-0`}>
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-sm">Categories</h3>
                  <button className="lg:hidden" onClick={() => setShowFilters(false)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      selectedCategory === 'All'
                        ? 'bg-coral text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(String(cat.id))}
                      className={`text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all flex justify-between items-center ${
                        selectedCategory === String(cat.id)
                          ? 'bg-coral text-white shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] opacity-60 ml-1">{cat.skillCount}</span>
                    </button>
                  ))}
                </div>

                {/* Type Legend */}
                <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border/60">
                  <h4 className="font-display font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-wider">Skill Types</h4>
                  <div className="space-y-2.5">
                    {[
                      { icon: '●', label: 'Prompt', color: 'text-coral', desc: 'AI prompt templates' },
                      { icon: '▲', label: 'Agent', color: 'text-teal', desc: 'Multi-step logic flows' },
                      { icon: '■', label: 'Tool', color: 'text-indigo-light', desc: 'Utility functions' },
                      { icon: '◆', label: 'RPA', color: 'text-amber', desc: 'Automation scripts' },
                      { icon: '◇', label: 'Workflow', color: 'text-purple-500', desc: 'Orchestrated pipelines' },
                      { icon: '○', label: 'Template', color: 'text-blue-500', desc: 'Reusable templates' },
                    ].map((type) => (
                      <div key={type.label} className="flex items-center gap-2.5">
                        <span className={`${type.color} text-sm`}>{type.icon}</span>
                        <div>
                          <span className="text-sm font-medium text-foreground/80">{type.label}</span>
                          <p className="text-[10px] text-muted-foreground">{type.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Skills List */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-4">
                Showing <span className="font-medium text-foreground">{sortedSkills.length}</span> skills
                {selectedCategory !== 'All' && categories.length > 0 && (
                  <> in <span className="font-medium text-coral">{categories.find(c => String(c.id) === selectedCategory)?.name}</span></>
                )}
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-coral" />
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                  className="space-y-2"
                >
                  {sortedSkills.map((skill) => {
                    const tags: string[] = (() => {
                      try {
                        if (typeof skill.tags === 'string') return JSON.parse(skill.tags);
                        if (Array.isArray(skill.tags)) return skill.tags;
                        return [];
                      } catch { return []; }
                    })();
                    return (
                      <motion.div key={skill.id} variants={fadeIn}>
                        <Link href={`/skills/${skill.author}/${skill.slug}`}>
                          <div className="group flex items-start gap-4 p-4 rounded-xl border border-border hover:border-coral/25 hover:shadow-md hover:shadow-coral/5 bg-card transition-all duration-200">
                            <span className={`mt-1 text-sm ${getTypeColor(skill.type ?? 'prompt')}`}>{getTypeIcon(skill.type ?? 'prompt')}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold group-hover:text-coral transition-colors">
                                  {skill.author}<span className="text-muted-foreground/50">/</span>{skill.name}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getTypeBgColor(skill.type ?? 'prompt')}`}>
                                  {skill.type}
                                </span>
                                {skill.isFeatured && (
                                  <span className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-amber/10 text-amber font-medium">
                                    <TrendingUp className="w-2.5 h-2.5" /> featured
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{skill.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  Updated {skill.updatedAt ? new Date(skill.updatedAt).toLocaleDateString() : 'recently'}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Download className="w-3 h-3" /> {formatNumber(skill.downloads ?? 0)}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Heart className="w-3 h-3" /> {formatNumber(skill.likes ?? 0)}
                                </span>
                                <div className="flex gap-1.5 ml-auto">
                                  {tags.slice(0, 3).map((tag: string) => (
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
                    );
                  })}
                </motion.div>
              )}

              {!isLoading && sortedSkills.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="font-display font-semibold text-lg mb-1">No skills found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
