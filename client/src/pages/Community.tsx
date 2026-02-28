/**
 * Community Page - Posts, Forum, Learn hub
 */
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  MessageSquare, FileText, GraduationCap, Heart, MessageCircle,
  TrendingUp, Clock, User, ArrowRight, BookOpen, Video, Award
} from 'lucide-react';

type Tab = 'posts' | 'forum' | 'learn';

interface Post {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  likes: number;
  comments: number;
  date: string;
  tags: string[];
}

interface ForumThread {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  category: string;
  solved?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  author: string;
  lessons: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled: number;
}

const posts: Post[] = [
  { id: '1', title: 'How I built a code review agent that saved our team 20 hours/week', author: 'sarah_dev', excerpt: 'Sharing my experience building an automated code review agent using SkillsHub...', likes: 342, comments: 56, date: '2 hours ago', tags: ['agent', 'code-review'] },
  { id: '2', title: 'Best practices for prompt engineering in 2026', author: 'prompt_master', excerpt: 'After testing thousands of prompts, here are the patterns that consistently work...', likes: 567, comments: 89, date: '5 hours ago', tags: ['prompts', 'tutorial'] },
  { id: '3', title: 'Introducing my RPA automation for invoice processing', author: 'rpa_wizard', excerpt: 'A complete walkthrough of building an invoice processing automation...', likes: 234, comments: 34, date: '1 day ago', tags: ['rpa', 'automation'] },
  { id: '4', title: 'Comparing agent frameworks: SkillsHub vs LangChain vs CrewAI', author: 'ai_researcher', excerpt: 'An in-depth comparison of the top agent frameworks available today...', likes: 891, comments: 123, date: '2 days ago', tags: ['agents', 'comparison'] },
  { id: '5', title: 'My journey from 0 to 1000 downloads on SkillsHub', author: 'new_builder', excerpt: 'Tips and lessons learned from publishing my first skill on the platform...', likes: 456, comments: 67, date: '3 days ago', tags: ['community', 'tips'] },
];

const forumThreads: ForumThread[] = [
  { id: '1', title: 'How to handle rate limiting in Inference API?', author: 'dev_user_42', replies: 12, views: 234, lastActivity: '30 min ago', category: 'API', solved: true },
  { id: '2', title: 'Best practices for structuring multi-step agent workflows', author: 'agent_builder', replies: 28, views: 567, lastActivity: '1 hour ago', category: 'Agents' },
  { id: '3', title: 'Playground timeout issues with large context datasets', author: 'data_scientist', replies: 8, views: 156, lastActivity: '3 hours ago', category: 'Playgrounds', solved: false },
  { id: '4', title: 'Feature request: Git LFS support for large context files', author: 'ml_engineer', replies: 45, views: 890, lastActivity: '5 hours ago', category: 'Feature Request' },
  { id: '5', title: 'How to implement streaming responses in Skills?', author: 'backend_dev', replies: 15, views: 345, lastActivity: '8 hours ago', category: 'Skills', solved: true },
  { id: '6', title: 'Organization SSO setup guide needed', author: 'enterprise_admin', replies: 6, views: 123, lastActivity: '1 day ago', category: 'Enterprise' },
];

const courses: Course[] = [
  { id: '1', title: 'Getting Started with SkillsHub', description: 'Learn the fundamentals of creating, sharing, and using skills on the platform.', author: 'SkillsHub Team', lessons: 8, duration: '2 hours', level: 'Beginner', enrolled: 12400 },
  { id: '2', title: 'Advanced Prompt Engineering', description: 'Master the art of crafting effective prompts for various AI models and use cases.', author: 'Dr. Sarah Chen', lessons: 15, duration: '6 hours', level: 'Intermediate', enrolled: 8900 },
  { id: '3', title: 'Building AI Agents from Scratch', description: 'A comprehensive guide to designing, building, and deploying autonomous AI agents.', author: 'Alex Rivera', lessons: 20, duration: '10 hours', level: 'Advanced', enrolled: 5600 },
  { id: '4', title: 'RPA Automation Masterclass', description: 'Learn to automate repetitive tasks using RPA skills and workflow orchestration.', author: 'AutomateIO', lessons: 12, duration: '5 hours', level: 'Intermediate', enrolled: 4200 },
  { id: '5', title: 'Context Dataset Best Practices', description: 'How to create, curate, and version control high-quality context datasets.', author: 'DataLab Team', lessons: 10, duration: '4 hours', level: 'Beginner', enrolled: 3800 },
  { id: '6', title: 'Enterprise SkillsHub Administration', description: 'Managing teams, permissions, and security in SkillsHub Enterprise.', author: 'Enterprise Team', lessons: 8, duration: '3 hours', level: 'Intermediate', enrolled: 2100 },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'posts', label: 'Posts', icon: <FileText className="w-4 h-4" /> },
    { id: 'forum', label: 'Forum', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-3xl mb-2">Community</h1>
          <p className="text-muted-foreground text-lg">Share knowledge, ask questions, and learn from fellow builders.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="group p-5 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all bg-card">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm shrink-0">
                      {post.author[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-base mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.date}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comments}</span>
                        {post.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-muted">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="space-y-3">
            {forumThreads.map((thread, i) => (
              <motion.div key={thread.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="group flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all bg-card">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate">{thread.title}</h3>
                      {thread.solved && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 shrink-0">Solved</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted">{thread.category}</span>
                      <span>{thread.author}</span>
                      <span>{thread.lastActivity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{thread.replies}</span>
                    <span>{thread.views} views</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="group border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all bg-card h-full flex flex-col">
                  <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary/30" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full w-fit mb-3 ${
                      course.level === 'Beginner' ? 'bg-green-500/10 text-green-600' :
                      course.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-600' :
                      'bg-purple-500/10 text-purple-600'
                    }`}>{course.level}</span>
                    <h3 className="font-display font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.lessons} lessons · {course.duration}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{course.enrolled.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
