/**
 * SkillsHub Home Page - Bauhaus Industrial Design
 * Coral (#FF6B4A) + Indigo (#1E1B4B) + Teal (#14B8A6) palette
 * Space Grotesk display + DM Sans body typography
 * Enhanced with framer-motion animations and visual polish
 */
import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Heart, Download, ArrowRight, Users,
  GitBranch, Star, ChevronRight, Terminal, BookOpen, Layers,
  Sparkles, Code2, Bot, Wrench, Workflow
} from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { LOGO_URL } from '@/components/Logo';
import {
  trendingSkills, trendingPlaygrounds, trendingContexts,
  organizations, openSourceProjects, formatNumber, getTypeIcon, getTypeColor
} from '@/lib/data';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/hero-bg-TZT4UsZ7HGvzNgiCN796ku.webp';
const SKILLS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/skills-showcase-2vJQFW3piFETLD4PApu4kF.webp';
const PLAYGROUND_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/playground-preview-CJKMgbZS5F3ehLtnVVLNHg.webp';
const COMMUNITY_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/community-collab-n3NEHmtLgY8dCxCqh3CRh6.webp';
const ENTERPRISE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/enterprise-visual-Jiv6goXyjHEKsCcHkujDym.webp';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const stats = [
  { value: '50K+', label: 'Skills', icon: <Code2 className="w-4 h-4" /> },
  { value: '100K+', label: 'Contexts', icon: <BookOpen className="w-4 h-4" /> },
  { value: '10K+', label: 'Playgrounds', icon: <Layers className="w-4 h-4" /> },
  { value: '250K+', label: 'Developers', icon: <Users className="w-4 h-4" /> },
];

export default function Home() {

  return (
    <Layout>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-indigo min-h-[620px] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-30 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo via-indigo/95 to-indigo/70" />
        </div>
        {/* Geometric decorations */}
        <div className="absolute top-16 right-16 w-40 h-40 border border-coral/15 rounded-full hidden lg:block animate-[spin_30s_linear_infinite]" />
        <div className="absolute top-24 right-24 w-24 h-24 border border-teal/10 rounded-full hidden lg:block animate-[spin_20s_linear_infinite_reverse]" />
        <div className="absolute bottom-20 right-48 w-20 h-20 bg-teal/5 rotate-45 hidden lg:block" />
        <div className="absolute top-32 right-[28%] w-2.5 h-2.5 bg-coral rounded-full hidden lg:block" />
        <div className="absolute bottom-32 right-[20%] w-1.5 h-1.5 bg-teal rounded-full hidden lg:block" />
        <div className="absolute top-[60%] left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-coral/20 to-transparent hidden lg:block" />

        <div className="container relative z-10 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="SkillsHub" className="w-11 h-11 object-contain" />
              <span className="text-coral font-display font-semibold text-sm tracking-[0.2em] uppercase">SkillsHub</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-[1.08] mb-6">
              The Skills Community
              <br />
              <span className="text-coral">Building the Future.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-white/65 leading-relaxed mb-8 max-w-lg">
              The platform where developers collaborate on AI skills, context datasets, and interactive playgrounds. Share, discover, and run reusable prompts, agent logic, and automation scripts.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <Link href="/playgrounds">
                <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-display font-semibold px-7 h-12 shadow-lg shadow-coral/25 transition-all hover:shadow-xl hover:shadow-coral/30 hover:-translate-y-0.5">
                  Explore Playgrounds
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/skills">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-display font-semibold px-7 h-12 transition-all hover:-translate-y-0.5">
                  Browse 50K+ Skills
                </Button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <div className="text-coral/70">{stat.icon}</div>
                  <div>
                    <span className="text-white font-display font-bold text-lg">{stat.value}</span>
                    <span className="text-white/40 text-sm ml-1.5">{stat.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== TRENDING SECTION ===== */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-10"
          >
            <p className="font-display font-bold text-2xl sm:text-3xl">
              Trending on <span className="text-coral">SkillsHub</span> this week
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Trending Skills */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-coral" />
                <h3 className="font-display font-semibold text-base">Skills</h3>
              </div>
              <div className="space-y-1">
                {trendingSkills.map((skill) => (
                  <Link key={skill.id} href={`/skills/${skill.author}/${skill.name}`}>
                    <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/60 transition-all hover:translate-x-0.5">
                      <span className={`mt-1 text-xs ${getTypeColor(skill.type)}`}>{getTypeIcon(skill.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-coral transition-colors">
                          {skill.author}/{skill.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Updated {skill.updatedAt}</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {formatNumber(skill.downloads)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {formatNumber(skill.likes)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/skills" className="flex items-center gap-1 mt-3 px-3 text-sm font-medium text-coral hover:text-coral-dark transition-colors group">
                Browse 50K+ skills <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Trending Playgrounds */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-teal" />
                <h3 className="font-display font-semibold text-base">Playgrounds</h3>
              </div>
              <div className="space-y-2">
                {trendingPlaygrounds.map((pg) => (
                  <Link key={pg.id} href={`/playgrounds/${pg.author}/${pg.name}`}>
                    <div className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo to-indigo-light p-3.5 hover:shadow-lg hover:shadow-indigo/20 transition-all hover:-translate-y-0.5">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-teal/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {pg.name} {pg.emoji}
                          </p>
                          <p className="text-xs text-white/55 mt-1 truncate">{pg.description}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-white/60 shrink-0 ml-2">
                          <Heart className="w-3 h-3" /> {formatNumber(pg.likes)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/playgrounds" className="flex items-center gap-1 mt-3 px-3 text-sm font-medium text-teal hover:text-teal/80 transition-colors group">
                Browse 10K+ playgrounds <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Trending Contexts */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-amber" />
                <h3 className="font-display font-semibold text-base">Contexts</h3>
              </div>
              <div className="space-y-1">
                {trendingContexts.map((ctx) => (
                  <Link key={ctx.id} href={`/contexts/${ctx.author}/${ctx.name}`}>
                    <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/60 transition-all hover:translate-x-0.5">
                      <BookOpen className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-amber transition-colors">
                          {ctx.author}/{ctx.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Updated {ctx.updatedAt}</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {formatNumber(ctx.downloads)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {formatNumber(ctx.likes)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/contexts" className="flex items-center gap-1 mt-3 px-3 text-sm font-medium text-amber hover:text-amber/80 transition-colors group">
                Browse 100K+ contexts <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== PLATFORM FEATURES ===== */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">The Home of AI Skills</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Create, discover, and collaborate on skills better than anywhere else.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Collaboration Platform */}
            <motion.div variants={fadeInUp} className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-coral/20 transition-all">
              <h3 className="font-display font-bold text-xl mb-2">The Collaboration Platform</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Host and collaborate on unlimited public skills, contexts, and playgrounds.
              </p>
              <div className="overflow-hidden rounded-lg">
                <img src={COMMUNITY_IMG} alt="Community collaboration" className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
            </motion.div>

            {/* Open Source Stack */}
            <motion.div variants={fadeInUp} className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-teal/20 transition-all">
              <h3 className="font-display font-bold text-xl mb-2">Move Faster</h3>
              <p className="text-muted-foreground text-sm mb-4">
                With the SkillsHub open source stack, CLI tools, and SDK.
              </p>
              <div className="overflow-hidden rounded-lg">
                <img src={PLAYGROUND_IMG} alt="Playground preview" className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
            </motion.div>

            {/* Explore All Types */}
            <motion.div variants={fadeInUp} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-indigo/20 transition-all">
              <h3 className="font-display font-bold text-xl mb-2">Explore All Skill Types</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Prompts, Agents, Tools, RPA scripts, and more.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Sparkles className="w-5 h-5" />, label: 'Prompts', count: '18K+', color: 'text-coral bg-coral/8' },
                  { icon: <Bot className="w-5 h-5" />, label: 'Agents', count: '12K+', color: 'text-teal bg-teal/8' },
                  { icon: <Wrench className="w-5 h-5" />, label: 'Tools', count: '8K+', color: 'text-indigo-light bg-indigo/8' },
                  { icon: <Workflow className="w-5 h-5" />, label: 'RPA', count: '5K+', color: 'text-amber bg-amber/8' },
                  { icon: <Code2 className="w-5 h-5" />, label: 'Workflows', count: '3K+', color: 'text-coral bg-coral/8' },
                  { icon: <Star className="w-5 h-5" />, label: 'Templates', count: '2K+', color: 'text-teal bg-teal/8' },
                ].map((item) => (
                  <div key={item.label} className={`flex flex-col items-center p-3 rounded-lg ${item.color} hover:scale-105 transition-transform`}>
                    {item.icon}
                    <span className="text-xs font-medium mt-1.5">{item.label}</span>
                    <span className="text-[10px] opacity-60 mt-0.5">{item.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Build Portfolio */}
            <motion.div variants={fadeInUp} className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-amber/20 transition-all">
              <h3 className="font-display font-bold text-xl mb-2">Build Your Portfolio</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Share your work with the world and build your skills profile.
              </p>
              <div className="overflow-hidden rounded-lg">
                <img src={SKILLS_IMG} alt="Skills showcase" className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== ENTERPRISE SECTION ===== */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Accelerate Your Skills</h2>
            <p className="text-muted-foreground text-lg">We provide paid Compute and Enterprise solutions.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Team & Enterprise */}
            <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-xl bg-indigo p-8 text-white group">
              <img src={ENTERPRISE_IMG} alt="Enterprise" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo via-indigo/85 to-indigo/50" />
              <div className="relative z-10">
                <h3 className="font-display font-bold text-2xl mb-3">Team & Enterprise</h3>
                <p className="text-white/65 text-sm mb-6 max-w-md">
                  Give your team the most advanced platform to build AI skills with enterprise-grade security, access controls, and dedicated support.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Single Sign-On', 'Regions', 'Audit Logs', 'Priority Support', 'Resource Groups', 'Private Viewer'].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-white/75">
                      <div className="w-1.5 h-1.5 bg-coral rounded-full shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
                <Link href="/enterprise">
                  <Button className="bg-coral hover:bg-coral-dark text-white font-display font-semibold shadow-lg shadow-coral/25">
                    Getting Started
                  </Button>
                </Link>
                <span className="ml-3 text-sm text-white/50">Starting at $20/user/month</span>
              </div>
            </motion.div>

            {/* Inference & Compute */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-coral/20 transition-all">
                <h3 className="font-display font-bold text-xl mb-2">Inference API</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Access 50K+ skills through a single, unified API with no service fees.
                </p>
                <Link href="/skills">
                  <Button variant="outline" className="font-display font-semibold border-coral/30 text-coral hover:bg-coral/5">
                    Explore Skills
                  </Button>
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-teal/20 transition-all">
                <h3 className="font-display font-bold text-xl mb-2">Compute</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Deploy on optimized runtimes or upgrade your Playgrounds to GPU in a few clicks.
                </p>
                <Link href="/pricing">
                  <Button variant="outline" className="font-display font-semibold border-teal/30 text-teal hover:bg-teal/5">
                    View Pricing
                  </Button>
                </Link>
                <span className="ml-3 text-sm text-muted-foreground">Starting at $0.60/hour for GPU</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== ORGANIZATIONS ===== */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center text-muted-foreground text-sm mb-8"
          >
            More than <span className="font-semibold text-foreground">10,000 organizations</span> are using SkillsHub
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {organizations.map((org) => (
              <motion.div
                key={org.name}
                variants={fadeInUp}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:shadow-sm hover:border-coral/15 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral/10 to-teal/10 flex items-center justify-center font-display font-bold text-sm text-foreground/70">
                  {org.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{org.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-coral/10 text-coral font-medium shrink-0">{org.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{org.skills} skills &middot; {formatNumber(org.followers)} followers</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== OPEN SOURCE ===== */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Our Open Source</h2>
            <p className="text-muted-foreground text-lg">We are building the foundation of skills tooling with the community.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {openSourceProjects.slice(0, 9).map((project) => (
              <motion.a
                key={project.name}
                variants={fadeInUp}
                href="#"
                className="group flex items-start gap-3 p-4 rounded-lg border border-border hover:border-coral/30 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded bg-coral/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-coral group-hover:text-white transition-colors">
                  <GitBranch className="w-4 h-4 text-coral group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold group-hover:text-coral transition-colors">{project.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3" /> {formatNumber(project.stars)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-indigo relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 border border-coral/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-teal/10 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-coral/20 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-teal/20 rounded-full" />
        </div>
        <div className="container text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Ready to build the future of AI skills?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/55 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of developers sharing and collaborating on the next generation of AI automation.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-display font-semibold px-8 h-12 shadow-lg shadow-coral/25 transition-all hover:shadow-xl hover:shadow-coral/30 hover:-translate-y-0.5">
                Sign Up Free
              </Button>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-display font-semibold px-8 h-12 transition-all hover:-translate-y-0.5">
                  Read the Docs
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
