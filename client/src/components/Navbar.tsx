/**
 * SkillsHub Navbar - Professional navigation with icons, mega dropdown, GitHub link
 * Shows: Skills, Contexts, Playgrounds, Docs in main nav
 * Everything else in "More" dropdown (HuggingFace-style)
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Search, Menu, X, ChevronDown,
  Zap, Database, Play, BookOpen,
  MoreHorizontal, Cpu, Globe, Tag,
  Building2, MessageSquare, Newspaper,
  FileText, GraduationCap, MessagesSquare,
  CreditCard, Briefcase, Github, Layers,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

const GITHUB_REPO = 'https://github.com/Eli-yu-first/skillshub';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavLinks: NavItem[] = [
  { label: 'Skills', href: '/skills', icon: <Zap className="w-4 h-4" /> },
  { label: 'Contexts', href: '/contexts', icon: <Database className="w-4 h-4" /> },
  { label: 'Playgrounds', href: '/playgrounds', icon: <Play className="w-4 h-4" /> },
  { label: 'Deps', href: '/deps', icon: <Bot className="w-4 h-4" /> },
  { label: 'Docs', href: '/docs', icon: <BookOpen className="w-4 h-4" /> },
];

interface DropdownSection {
  title: string;
  items: NavItem[];
}

const moreDropdownSections: DropdownSection[] = [
  {
    title: 'Platform',
    items: [
      { label: 'Deps (Agents)', href: '/deps', icon: <Bot className="w-4 h-4" /> },
      { label: 'Models', href: '/models', icon: <Cpu className="w-4 h-4" /> },
      { label: 'Datasets', href: '/datasets', icon: <Layers className="w-4 h-4" /> },
      { label: 'Tasks', href: '/tasks', icon: <Tag className="w-4 h-4" /> },
      { label: 'Collections', href: '/collections', icon: <Globe className="w-4 h-4" /> },
      { label: 'Languages', href: '/languages', icon: <Globe className="w-4 h-4" /> },
      { label: 'Organizations', href: '/organizations', icon: <Building2 className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Blog', href: '/blog', icon: <Newspaper className="w-4 h-4" /> },
      { label: 'Posts', href: '/posts', icon: <FileText className="w-4 h-4" /> },
      { label: 'Learn', href: '/learn', icon: <GraduationCap className="w-4 h-4" /> },
      { label: 'Discord', href: '#', icon: <MessagesSquare className="w-4 h-4" /> },
      { label: 'Forum', href: '/forum', icon: <MessageSquare className="w-4 h-4" /> },
      { label: 'GitHub', href: GITHUB_REPO, icon: <Github className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Solutions',
    items: [
      { label: 'Enterprise Hub', href: '/enterprise', icon: <Building2 className="w-4 h-4" /> },
      { label: 'SkillsHub PRO', href: '/pricing', icon: <CreditCard className="w-4 h-4" /> },
      { label: 'Expert Support', href: '/enterprise', icon: <Briefcase className="w-4 h-4" /> },
      { label: 'Inference API', href: '/docs', icon: <Zap className="w-4 h-4" /> },
    ],
  },
];

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchFocused && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
        setSearchQuery('');
        setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-sm'
          : 'border-b border-border/40 bg-background/80 backdrop-blur-md'
      }`}>
        <div className="container flex h-14 items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-1 group">
            <Logo size={28} />
          </Link>

          {/* Search */}
          <div ref={searchRef} className="relative hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search skills, contexts, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-10 rounded-lg border border-border bg-muted/30 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-background transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            <kbd className="absolute right-2.5 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/60 px-1.5 text-[10px] font-mono text-muted-foreground/60 pointer-events-none">
              /
            </kbd>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-auto">
            {mainNavLinks.map((link) => {
              const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 ${
                    isActive
                      ? 'text-primary'
                      : 'text-foreground/60 hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>{link.icon}</span>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 ${
                  moreOpen
                    ? 'text-foreground bg-muted/60'
                    : 'text-foreground/60 hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-[420px] bg-popover border border-border rounded-xl shadow-xl shadow-black/8 py-3 z-50">
                  <div className="grid grid-cols-2 gap-x-2">
                    {moreDropdownSections.map((section) => (
                      <div key={section.title} className="px-2 mb-3 last:mb-0">
                        <p className="px-3 py-1.5 text-[11px] font-display font-semibold text-primary uppercase tracking-wider">
                          {section.title}
                        </p>
                        {section.items.map((item) => {
                          const isExternal = item.href.startsWith('http');
                          if (isExternal) {
                            return (
                              <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground hover:bg-muted/60 rounded-md transition-colors"
                                onClick={() => setMoreOpen(false)}
                              >
                                <span className="text-muted-foreground">{item.icon}</span>
                                {item.label}
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground hover:bg-muted/60 rounded-md transition-colors"
                              onClick={() => setMoreOpen(false)}
                            >
                              <span className="text-muted-foreground">{item.icon}</span>
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side: Theme + GitHub + Auth */}
          <div className="hidden lg:flex items-center gap-2 ml-3">
            <ThemeSwitcher />
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              title="GitHub Repository"
            >
              <Github className="w-[18px] h-[18px]" />
            </a>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 px-2.5 py-1.5 text-[13px] font-medium rounded-md text-foreground/60 hover:text-foreground hover:bg-muted/60 transition-all">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {user?.name || 'Profile'}
                </Link>
                <Button variant="ghost" size="sm" className="text-[13px] font-medium h-8 px-3" onClick={() => logout()}>
                  Log Out
                </Button>
              </div>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost" size="sm" className="text-[13px] font-medium h-8 px-3">
                    Log In
                  </Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button size="sm" className="text-[13px] font-medium h-8 px-4 shadow-sm">
                    Sign Up
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden ml-auto p-2 text-foreground/70 hover:text-foreground rounded-md hover:bg-muted/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
            <div className="container py-4 space-y-1">
              {/* Mobile Search */}
              <div className="relative flex items-center mb-4">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search skills, contexts, users..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Main nav links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    location === link.href
                      ? 'text-primary bg-primary/8'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* More sections */}
              {moreDropdownSections.map((section) => (
                <div key={section.title} className="pt-2 mt-1 border-t border-border/60">
                  <p className="px-3 py-1.5 text-xs font-display font-semibold text-primary uppercase tracking-wider">{section.title}</p>
                  {section.items.map((item) => {
                    const isExternal = item.href.startsWith('http');
                    if (isExternal) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}

              {/* Theme + Auth */}
              <div className="pt-3 mt-2 border-t border-border space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-muted-foreground font-medium">Theme</span>
                  <ThemeSwitcher />
                </div>
                <div className="flex gap-2">
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full text-sm h-10">
                          Profile
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="flex-1 text-sm h-10" onClick={() => { logout(); setMobileOpen(false); }}>
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <a href={getLoginUrl()} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-sm h-10">
                          Log In
                        </Button>
                      </a>
                      <a href={getLoginUrl()} className="flex-1">
                        <Button size="sm" className="w-full text-sm h-10">
                          Sign Up
                        </Button>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
