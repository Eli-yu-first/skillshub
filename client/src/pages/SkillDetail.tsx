/**
 * SkillDetail Page - Complete skill detail view with README, files, community, history, inference
 * Uses real database data via tRPC
 */
import { useState, useMemo } from 'react';
import { useParams, Link } from 'wouter';
import Layout from '@/components/Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { formatNumber, getTypeIcon, getTypeColor, getTypeBgColor } from '@/lib/data';
import { motion } from 'framer-motion';
import {
  Heart, Download, GitBranch, GitCommit, MessageSquare, Play, Copy, Check,
  FileText, Folder, ChevronRight, Clock, Tag, Share2,
  Code2, Terminal, AlertCircle, Bookmark, BookmarkCheck,
  ChevronDown, File, FolderOpen, ExternalLink, Loader2,
  Twitter, Linkedin, Facebook, Link2, Star, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SkillVersionControl from '@/components/SkillVersionControl';

type Tab = 'readme' | 'files' | 'community' | 'versions' | 'api';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  content?: string | null;
  mimeType?: string | null;
  children?: FileNode[];
}

function buildFileTree(files: any[]): FileNode[] {
  const root: FileNode[] = [];
  const dirMap = new Map<string, FileNode>();

  // Sort: directories first, then files
  const sorted = [...files].sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const f of sorted) {
    const node: FileNode = {
      name: f.name,
      type: f.isDirectory ? 'folder' : 'file',
      size: f.size || undefined,
      content: f.content,
      mimeType: f.mimeType,
      children: f.isDirectory ? [] : undefined,
    };

    if (f.isDirectory) {
      const fullPath = f.path === '/' ? `/${f.name}` : `${f.path}/${f.name}`;
      dirMap.set(fullPath, node);
    }

    if (f.path === '/') {
      root.push(node);
    } else {
      const parent = dirMap.get(f.path);
      if (parent && parent.children) {
        parent.children.push(node);
      } else {
        root.push(node);
      }
    }
  }

  return root;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTree({ nodes, depth = 0, onFileClick }: { nodes: FileNode[]; depth?: number; onFileClick?: (f: FileNode) => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src', 'tests', 'examples']));

  const toggle = (name: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div>
      {nodes.map(node => (
        <div key={node.name}>
          <div
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 cursor-pointer text-sm transition-colors"
            style={{ paddingLeft: `${depth * 20 + 12}px` }}
            onClick={() => {
              if (node.type === 'folder') toggle(node.name);
              else if (onFileClick) onFileClick(node);
            }}
          >
            {node.type === 'folder' ? (
              <>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded.has(node.name) ? '' : '-rotate-90'}`} />
                {expanded.has(node.name) ? <FolderOpen className="w-4 h-4 text-primary" /> : <Folder className="w-4 h-4 text-primary" />}
              </>
            ) : (
              <>
                <span className="w-3.5" />
                <File className="w-4 h-4 text-muted-foreground" />
              </>
            )}
            <span className="flex-1 truncate text-foreground">{node.name}</span>
            {node.size !== undefined && node.size > 0 && <span className="text-xs text-muted-foreground">{formatFileSize(node.size)}</span>}
          </div>
          {node.type === 'folder' && expanded.has(node.name) && node.children && (
            <FileTree nodes={node.children} depth={depth + 1} onFileClick={onFileClick} />
          )}
        </div>
      ))}
    </div>
  );
}

function ShareMenu({ author, name, description }: { author: string; name: string; description: string }) {
  const [open, setOpen] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = `Check out ${author}/${name} on SkillsHub: ${description}`;

  const share = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
        setOpen(false);
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} className="gap-1.5">
        <Share2 className="w-4 h-4" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-2 min-w-[180px]">
            <button onClick={() => share('twitter')} className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              <Twitter className="w-4 h-4" /> Share on X / Twitter
            </button>
            <button onClick={() => share('linkedin')} className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              <Linkedin className="w-4 h-4" /> Share on LinkedIn
            </button>
            <button onClick={() => share('facebook')} className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              <Facebook className="w-4 h-4" /> Share on Facebook
            </button>
            <div className="border-t border-border my-1" />
            <button onClick={() => share('copy')} className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
              <Link2 className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SkillDetail() {
  const params = useParams<{ author: string; name: string }>();
  const { author, name } = params;
  const [activeTab, setActiveTab] = useState<Tab>('readme');
  const [liked, setLiked] = useState(false);
  const [apiInput, setApiInput] = useState('function add(a, b) {\n  return a + b;\n}');
  const [apiOutput, setApiOutput] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const { user, isAuthenticated } = useAuth();

  // Fetch skill data from tRPC
  const { data: skill, isLoading: skillLoading } = trpc.skills.bySlug.useQuery(
    { author: author || '', slug: name || '' },
    { enabled: !!author && !!name }
  );

  // Fetch files
  const { data: filesData } = trpc.skills.files.useQuery(
    { skillId: skill?.id || 0 },
    { enabled: !!skill?.id }
  );

  // Fetch commits
  const { data: commitsData } = trpc.skills.commits.useQuery(
    { skillId: skill?.id || 0 },
    { enabled: !!skill?.id }
  );

  // Fetch discussions
  const { data: discussionsData } = trpc.discussions.list.useQuery(
    { targetType: 'skill', targetId: skill?.id || 0 },
    { enabled: !!skill?.id }
  );

  // Fetch reviews
  const { data: reviewsData } = trpc.reviews.list.useQuery(
    { skillId: skill?.id || 0 },
    { enabled: !!skill?.id }
  );
  const { data: ratingData } = trpc.reviews.rating.useQuery(
    { skillId: skill?.id || 0 },
    { enabled: !!skill?.id }
  );

  // Fetch related skills
  const skillTags = useMemo(() => {
    if (!skill?.tags) return null;
    try {
      return typeof skill.tags === 'string' ? JSON.parse(skill.tags) : skill.tags;
    } catch { return null; }
  }, [skill?.tags]);
  const { data: relatedSkillsData } = trpc.skills.related.useQuery(
    { skillId: skill?.id || 0, categoryId: skill?.categoryId || null, tags: skillTags, limit: 6 },
    { enabled: !!skill?.id }
  );

  // Check favorite status
  const { data: isFav } = trpc.favorites.check.useQuery(
    { targetType: 'skill', targetId: skill?.id || 0 },
    { enabled: !!skill?.id && isAuthenticated }
  );

  const utils = trpc.useUtils();
  const addFavMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      utils.favorites.check.invalidate({ targetType: 'skill', targetId: skill?.id || 0 });
      toast.success('Added to favorites');
    },
  });
  const removeFavMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      utils.favorites.check.invalidate({ targetType: 'skill', targetId: skill?.id || 0 });
      toast.success('Removed from favorites');
    },
  });
  const createReviewMutation = trpc.reviews.create.useMutation({
    onSuccess: () => {
      utils.reviews.list.invalidate({ skillId: skill?.id || 0 });
      utils.reviews.rating.invalidate({ skillId: skill?.id || 0 });
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review submitted!');
    },
    onError: () => toast.error('Failed to submit review'),
  });
  const createDiscussionMutation = trpc.discussions.create.useMutation({
    onSuccess: () => {
      utils.discussions.list.invalidate({ targetType: 'skill', targetId: skill?.id || 0 });
      setNewDiscussionTitle('');
      setNewDiscussionContent('');
      setIsCreatingDiscussion(false);
      toast.success('Discussion created successfully!');
    },
    onError: () => toast.error('Failed to create discussion: please login first'),
  });
  const forkMutation = trpc.skills.fork.useMutation({
    onSuccess: (data) => {
      toast.success('Skill forked successfully!');
      window.location.href = `/skills/${user?.name || 'user'}/${data.slug}`;
    },
    onError: () => toast.error('Failed to fork skill'),
  });

  const fileTree = useMemo(() => buildFileTree(filesData || []), [filesData]);
  const files = filesData || [];
  const commits = commitsData || [];
  const discussions_ = discussionsData || [];

  // Get README content from files
  const readmeContent = useMemo(() => {
    const readmeFile = files.find(f => f.name === 'README.md' && f.path === '/');
    return readmeFile?.content || `# ${skill?.name || name}\n\n${skill?.description || 'No README available.'}`;
  }, [files, skill, name]);

  if (skillLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading skill...</p>
        </div>
      </Layout>
    );
  }

  if (!skill) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl mb-2">Skill Not Found</h1>
          <p className="text-muted-foreground mb-6">The skill &quot;{author}/{name}&quot; could not be found.</p>
          <Link href="/skills"><Button>Browse Skills</Button></Link>
        </div>
      </Layout>
    );
  }

  const tags = typeof skill.tags === 'string' ? JSON.parse(skill.tags) : (skill.tags || []);

  const handleApiTest = () => {
    setApiLoading(true);
    setApiOutput('');
    setTimeout(() => {
      setApiOutput(JSON.stringify({
        score: 92,
        summary: "Clean and functional code. Minor suggestion for type safety.",
        suggestions: [
          {
            line: 1,
            severity: "low",
            category: "type-safety",
            message: "Consider adding TypeScript type annotations for parameters",
            suggested_fix: "function add(a: number, b: number): number {\n  return a + b;\n}"
          }
        ],
        metrics: { complexity: 1, maintainability: 95 }
      }, null, 2));
      setApiLoading(false);
    }, 1500);
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(`skillshub install ${author}/${name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Install command copied to clipboard');
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add favorites');
      return;
    }
    if (isFav) {
      removeFavMutation.mutate({ targetType: 'skill', targetId: skill.id });
    } else {
      addFavMutation.mutate({ targetType: 'skill', targetId: skill.id });
    }
  };

  const fileCount = files.filter(f => !f.isDirectory).length;

  const tabList: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'readme', label: 'README', icon: <FileText className="w-4 h-4" /> },
    { id: 'files', label: 'Files', icon: <Folder className="w-4 h-4" />, count: fileCount },
    { id: 'community', label: 'Community', icon: <MessageSquare className="w-4 h-4" />, count: discussions_.length },
    { id: 'versions', label: 'History', icon: <GitCommit className="w-4 h-4" />, count: commits.length },
    { id: 'api', label: 'Inference API', icon: <Play className="w-4 h-4" /> },
  ];

  const formatTimeAgo = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <Layout>
      <div className="container py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/skills" className="hover:text-foreground transition-colors">Skills</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/organizations`} className="hover:text-foreground transition-colors">{author}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{name}</span>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-lg ${getTypeColor(skill.type)}`}>{getTypeIcon(skill.type)}</span>
                <h1 className="font-display font-bold text-2xl lg:text-3xl">
                  <span className="text-primary">{author}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span>{name}</span>
                </h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTypeBgColor(skill.type)}`}>
                  {skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}
                </span>
              </div>
              <p className="text-muted-foreground text-base mb-3">{skill.description}</p>
              <div className="flex items-center gap-3 flex-wrap">
                {tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary/30 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {formatTimeAgo(skill.updatedAt)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={liked ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setLiked(!liked); toast.success(liked ? 'Removed from likes' : 'Added to likes'); }}
                className="gap-1.5"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {formatNumber((skill.likes ?? 0) + (liked ? 1 : 0))}
              </Button>
              <Button
                variant={isFav ? 'default' : 'outline'}
                size="sm"
                onClick={handleFavoriteToggle}
                className="gap-1.5"
              >
                {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {isFav ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!isAuthenticated) { toast.error('Please log in to fork'); return; }
                  forkMutation.mutate({ skillId: skill.id });
                }}
                disabled={forkMutation.isPending}
                className="gap-1.5"
              >
                <GitBranch className="w-4 h-4" />
                {forkMutation.isPending ? 'Forking...' : `Fork (${formatNumber(skill.forks ?? 0)})`}
              </Button>
              <ShareMenu author={author || ''} name={name || ''} description={skill.description || ''} />
            </div>
          </div>
        </motion.div>

        {/* Install Banner */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg mb-6">
          <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />
          <code className="flex-1 text-sm font-mono text-foreground">skillshub install {author}/{name}</code>
          <button onClick={handleCopyInstall} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 pb-6 border-b border-border flex-wrap">
          <span className="flex items-center gap-1.5"><Download className="w-4 h-4" />{formatNumber(skill.downloads ?? 0)} downloads</span>
          <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" />{formatNumber(skill.likes ?? 0)} likes</span>
          <span className="flex items-center gap-1.5"><GitCommit className="w-4 h-4" />{commits.length} commits</span>
          <span className="flex items-center gap-1.5"><Folder className="w-4 h-4" />{fileCount} files</span>
          <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" />v{skill.version || '1.0.0'}</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedFile(null); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* README Tab */}
            {activeTab === 'readme' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MarkdownRenderer content={readmeContent} />
              </motion.div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="border border-border rounded-lg overflow-hidden flex flex-col md:flex-row h-[600px] bg-card">
                  {/* Left Sidebar: File Tree */}
                  <div className="md:w-64 border-b md:border-b-0 md:border-r border-border flex flex-col items-stretch overflow-hidden">
                    <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between shadow-sm z-10">
                      <div className="flex items-center gap-2 text-sm">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">main</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2 group">
                      <FileTree nodes={fileTree} onFileClick={(f) => setSelectedFile(f)} />
                    </div>
                  </div>

                  {/* Right Panel: Content Viewer */}
                  <div className="flex-1 flex flex-col overflow-hidden bg-background">
                    {selectedFile ? (
                      <>
                        <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{selectedFile.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {formatFileSize(selectedFile.size)}
                          </span>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                          {(selectedFile.name.endsWith('.md') || selectedFile.name.endsWith('.mdx')) ? (
                            <MarkdownRenderer content={selectedFile.content || ''} />
                          ) : (
                            <pre className="text-sm font-mono text-foreground whitespace-pre">
                              <code>{selectedFile.content || '// Empty file'}</code>
                            </pre>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                        <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium">No file selected.</p>
                        <p className="text-xs mt-1">Select a file from the tree to view its content.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Community Tab */}
            {activeTab === 'community' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-lg">Discussions ({discussions_.length})</h2>
                  {!isCreatingDiscussion && (
                     <Button size="sm" onClick={() => setIsCreatingDiscussion(true)}>New Discussion</Button>
                  )}
                </div>

                {isCreatingDiscussion && (
                  <div className="border border-border rounded-xl p-5 bg-card mb-6 mb-8 shadow-sm">
                    <h3 className="font-medium text-sm mb-4">Start a new discussion</h3>
                    <input
                      type="text"
                      placeholder="Title of your discussion..."
                      value={newDiscussionTitle}
                      onChange={(e) => setNewDiscussionTitle(e.target.value)}
                      className="w-full p-2.5 mb-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <textarea
                      placeholder="Describe what you want to discuss..."
                      value={newDiscussionContent}
                      onChange={(e) => setNewDiscussionContent(e.target.value)}
                      className="w-full h-32 p-3 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="ghost" size="sm" onClick={() => setIsCreatingDiscussion(false)}>Cancel</Button>
                      <Button 
                        size="sm" 
                        disabled={!newDiscussionTitle.trim() || createDiscussionMutation.isPending}
                        onClick={() => createDiscussionMutation.mutate({
                          targetType: 'skill',
                          targetId: skill.id,
                          title: newDiscussionTitle,
                          content: newDiscussionContent
                        })}
                      >
                        {createDiscussionMutation.isPending ? 'Posting...' : 'Post Discussion'}
                      </Button>
                    </div>
                  </div>
                )}

                {!isCreatingDiscussion && discussions_.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl mb-6">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No discussions yet. Be the first to start one!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {discussions_.map((d: any) => (
                      <div key={d.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/20 transition-all cursor-pointer">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${d.status === 'open' ? 'bg-green-500' : d.status === 'resolved' ? 'bg-purple-500' : 'bg-gray-400'}`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 truncate">{d.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{formatTimeAgo(d.createdAt)}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                              d.status === 'open' ? 'bg-green-500/10 text-green-600' :
                              d.status === 'resolved' ? 'bg-purple-500/10 text-purple-600' :
                              'bg-gray-500/10 text-gray-600'
                            }`}>
                              {d.status}
                            </span>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <MessageSquare className="w-3.5 h-3.5" />{d.replyCount || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* History Tab - Version Control */}
            {activeTab === 'versions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SkillVersionControl skillId={skill.id} skillAuthor={skill.author} />
              </motion.div>
            )}

            {/* Inference API Tab */}
            {activeTab === 'api' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-display font-semibold text-lg mb-4">Inference API</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Test this skill directly in your browser. Enter your input below and click &quot;Run&quot; to see the output.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Input</label>
                    <textarea
                      value={apiInput}
                      onChange={(e) => setApiInput(e.target.value)}
                      className="w-full h-64 p-4 rounded-lg border border-border bg-muted/30 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                      placeholder="Enter your code or input here..."
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <Button onClick={handleApiTest} disabled={apiLoading} className="gap-2">
                        {apiLoading ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        {apiLoading ? 'Running...' : 'Run'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setApiInput(''); setApiOutput(''); }}>
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Output</label>
                    <div className="w-full h-64 p-4 rounded-lg border border-border bg-muted/30 font-mono text-sm overflow-auto">
                      {apiOutput ? (
                        <pre className="text-foreground whitespace-pre-wrap">{apiOutput}</pre>
                      ) : (
                        <span className="text-muted-foreground">Output will appear here after running...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* API Endpoint */}
                <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
                  <h3 className="text-sm font-medium mb-3">REST API Endpoint</h3>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-md border border-border">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/10 text-green-600">POST</span>
                    <code className="text-sm font-mono text-foreground flex-1">https://api.skillshub.dev/v1/skills/{author}/{name}/run</code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`https://api.skillshub.dev/v1/skills/${author}/${name}/run`); toast.success('API URL copied'); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Example Request</h4>
                    <pre className="p-3 bg-background rounded-md border border-border text-xs font-mono overflow-x-auto">
{`curl -X POST https://api.skillshub.dev/v1/skills/${author}/${name}/run \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input": {"prompt": "your input here"}}'`}
                    </pre>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Python SDK</h4>
                    <pre className="p-3 bg-background rounded-md border border-border text-xs font-mono overflow-x-auto">
{`from skillshub import SkillsHub

client = SkillsHub(api_key="YOUR_API_KEY")
result = client.skills.run("${author}/${name}", {
    "prompt": "your input here"
})
print(result.output)`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Card */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">About</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className={`flex items-center gap-1.5 font-medium ${getTypeColor(skill.type)}`}>
                    {getTypeIcon(skill.type)} {skill.type.charAt(0).toUpperCase() + skill.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-medium">{formatNumber(skill.downloads ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-medium">{formatNumber(skill.likes ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-xs">v{skill.version || '1.0.0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">License</span>
                  <span className="text-xs">{skill.license || 'MIT'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-xs">{formatTimeAgo(skill.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Author Card */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Author</h3>
              <Link href="/organizations">
                <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                    {author?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{author}</p>
                    <p className="text-xs text-muted-foreground">View profile</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Tags */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Link key={tag} href={`/skills?tag=${tag}`}>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rating Summary */}
            {ratingData && ratingData.count > 0 && (
              <div className="border border-border rounded-xl p-5 bg-card">
                <h3 className="font-display font-semibold text-sm mb-4">Ratings</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold">{Number(ratingData.average).toFixed(1)}</span>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(ratingData.average)) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{ratingData.count} reviews</span>
                  </div>
                </div>
              </div>
            )}

            {/* Related Skills */}
            {relatedSkillsData && relatedSkillsData.length > 0 && (
              <div className="border border-border rounded-xl p-5 bg-card">
                <h3 className="font-display font-semibold text-sm mb-4">Related Skills</h3>
                <div className="space-y-3">
                  {relatedSkillsData.map((rs: any) => (
                    <Link key={rs.id} href={`/skills/${rs.author}/${rs.slug}`}>
                      <div className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${getTypeBgColor(rs.type)}`}>
                          {getTypeIcon(rs.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{rs.author}/{rs.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{rs.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Heart className="w-3 h-3" />{formatNumber(rs.likes ?? 0)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Compatible Models */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Compatible Models</h3>
              <div className="space-y-2">
                {['GPT-4o', 'Claude-3.5-Sonnet', 'DeepSeek-V3', 'Llama-3.1-405B'].map(model => (
                  <div key={model} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{model}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-display font-bold text-xl mb-6">Reviews & Ratings</h2>

          {/* Write Review */}
          {isAuthenticated && (
            <div className="border border-border rounded-xl p-6 bg-card mb-8">
              <h3 className="font-medium text-sm mb-4">Write a Review</h3>
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(s)}
                    className="p-0.5"
                  >
                    <Star className={`w-6 h-6 transition-colors ${
                      s <= (hoverRating || reviewRating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'
                    }`} />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{reviewRating}/5</span>
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this skill..."
                className="w-full h-24 p-3 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex justify-end mt-3">
                <Button
                  size="sm"
                  onClick={() => createReviewMutation.mutate({ skillId: skill.id, rating: reviewRating, comment: reviewComment || undefined })}
                  disabled={createReviewMutation.isPending}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviewsData && reviewsData.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.map((review: any) => (
                <div key={review.id} className="border border-border rounded-xl p-5 bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {(review.userName || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.userName || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No reviews yet. Be the first to review this skill!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
