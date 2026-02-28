/**
 * SkillsHub Navbar - Professional navigation with icons, mega dropdown, GitHub link
 * Shows: Skills, Contexts, Playgrounds, Docs in main nav
 * Everything else in "More" dropdown (HuggingFace-style)
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { formatNumber } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Plus, Heart, Star } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import {
  Search, Menu, X, ChevronDown,
  Zap, Database, Play, BookOpen,
  MoreHorizontal, Cpu, Globe, Tag,
  Building2, MessageSquare, Newspaper,
  FileText, GraduationCap, MessagesSquare,
  CreditCard, Briefcase, Layers,
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
      { label: 'GitHub', href: GITHUB_REPO, icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search results
  const { data: searchResults, isLoading: searchLoading } = trpc.skills.search.useQuery(
    { query: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length >= 2 }
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchFocused && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setSearchFocused(false);
        setSearchQuery('');
        setMoreOpen(false);
        searchInputRef.current?.blur();
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

          {/* Search with live results */}
          <div ref={searchRef} className="relative hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search skills, contexts, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-10 rounded-lg border border-border bg-muted/30 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-background transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/skills?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchFocused(false);
                  setSearchQuery('');
                  searchInputRef.current?.blur();
                }
              }}
            />
            <kbd className="absolute right-2.5 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/60 px-1.5 text-[10px] font-mono text-muted-foreground/60 pointer-events-none">
              /
            </kbd>

            {/* Search Dropdown */}
            {searchFocused && debouncedQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl overflow-hidden z-[100]">
                {searchLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : searchResults && searchResults.items.length > 0 ? (
                  <div>
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                      Skills ({searchResults.total} results)
                    </div>
                    {searchResults.items.map((item: any) => (
                      <a
                        key={item.id}
                        href={`/skills/${item.author}/${item.slug}`}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-colors cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchFocused(false);
                          setSearchQuery('');
                          navigate(`/skills/${item.author}/${item.slug}`);
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {item.author?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            <span className="text-primary">{item.author}</span>
                            <span className="text-muted-foreground">/</span>
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">♥ {formatNumber(item.likes ?? 0)}</span>
                      </a>
                    ))}
                    {searchResults.total > 8 && (
                      <a
                        href={`/skills?search=${encodeURIComponent(debouncedQuery)}`}
                        className="block px-3 py-2.5 text-center text-sm text-primary hover:bg-muted/60 border-t border-border transition-colors"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchFocused(false);
                          setSearchQuery('');
                          navigate(`/skills?search=${encodeURIComponent(debouncedQuery)}`);
                        }}
                      >
                        View all {searchResults.total} results →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No results found for "{debouncedQuery}"
                  </div>
                )}
              </div>
            )}
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
          <div className="hidden lg:flex items-center gap-1.5 ml-3">
            <ThemeSwitcher />
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background hover:opacity-80 transition-all"
              title="GitHub Repository"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <span className="text-primary text-sm font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/skills/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Skill
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('My favorites coming soon')}>
                    <Heart className="mr-2 h-4 w-4" />
                    My Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('My stars coming soon')}>
                    <Star className="mr-2 h-4 w-4" />
                    My Stars
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info('Settings coming soon')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
