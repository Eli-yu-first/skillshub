/**
 * Blog Page - SkillsHub engineering blog and announcements
 */
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
  image?: string;
}

const blogPosts: BlogPost[] = [
  { id: '1', title: 'Introducing SkillsHub 2.0: The Future of AI Skill Sharing', excerpt: 'Today we are excited to announce SkillsHub 2.0, featuring a completely redesigned platform with support for Agents, enhanced Playgrounds, and our new Deps marketplace.', author: 'SkillsHub Team', date: 'Feb 25, 2026', category: 'Announcement', readTime: '5 min', featured: true },
  { id: '2', title: 'How We Built the Deps Agent Marketplace', excerpt: 'A deep dive into the architecture behind our new Deps feature, which allows users to compose Skills into fully functional AI Agents with one-click deployment.', author: 'Engineering Team', date: 'Feb 22, 2026', category: 'Engineering', readTime: '12 min', featured: true },
  { id: '3', title: 'Scaling SkillsHub to 50K+ Skills: Lessons Learned', excerpt: 'Our journey from 1,000 to 50,000 skills on the platform, including the technical challenges and architectural decisions along the way.', author: 'Infrastructure Team', date: 'Feb 18, 2026', category: 'Engineering', readTime: '10 min' },
  { id: '4', title: 'Community Spotlight: Top 10 Skills of January 2026', excerpt: 'Highlighting the most innovative and popular skills created by our community this month, from code review agents to multilingual translation tools.', author: 'Community Team', date: 'Feb 15, 2026', category: 'Community', readTime: '7 min' },
  { id: '5', title: 'Best Practices for Writing Effective AI Prompts', excerpt: 'A comprehensive guide to crafting prompts that produce consistent, high-quality results across different language models and use cases.', author: 'Dr. Sarah Chen', date: 'Feb 10, 2026', category: 'Tutorial', readTime: '15 min' },
  { id: '6', title: 'SkillsHub Enterprise: Security and Compliance Updates', excerpt: 'New SOC 2 Type II certification, GDPR compliance tools, and enhanced audit logging for enterprise customers.', author: 'Security Team', date: 'Feb 5, 2026', category: 'Enterprise', readTime: '6 min' },
  { id: '7', title: 'Building Multi-Agent Systems with SkillsHub', excerpt: 'Learn how to compose multiple Skills into coordinated agent systems that can handle complex, multi-step tasks autonomously.', author: 'Alex Rivera', date: 'Jan 28, 2026', category: 'Tutorial', readTime: '18 min' },
  { id: '8', title: 'The State of AI Skills in 2026', excerpt: 'Our annual report on the AI skills ecosystem: trends, growth metrics, and predictions for the year ahead.', author: 'Research Team', date: 'Jan 20, 2026', category: 'Research', readTime: '20 min' },
];

const categories = ['All', 'Announcement', 'Engineering', 'Tutorial', 'Community', 'Enterprise', 'Research'];

export default function Blog() {
  const featured = blogPosts.filter(p => p.featured);
  const regular = blogPosts.filter(p => !p.featured);

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display font-bold text-3xl mb-2">Blog</h1>
          <p className="text-muted-foreground text-lg">Engineering insights, product updates, and community stories.</p>
        </motion.div>

        {/* Featured Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {featured.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link href={`/blog/${post.id}`}>
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all h-full">
                  <div className="h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.readTime} read</span>
                    </div>
                    <h2 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3.5 h-3.5" />{post.author}
                        <span className="mx-1">·</span>
                        <Calendar className="w-3.5 h-3.5" />{post.date}
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Regular Posts */}
        <h2 className="font-display font-semibold text-xl mb-6">Recent Posts</h2>
        <div className="space-y-4">
          {regular.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/blog/${post.id}`}>
                <div className="group flex items-start gap-5 p-5 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all bg-card">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/10 to-transparent shrink-0 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.readTime} read</span>
                    </div>
                    <h3 className="font-display font-semibold text-base mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />{post.author}
                      <span>·</span>
                      <Calendar className="w-3 h-3" />{post.date}
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
