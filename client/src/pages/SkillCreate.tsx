/**
 * SkillCreate Page - Online skill editor with Markdown preview
 * Allows users to create and publish skills to the platform
 */
import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { motion } from 'framer-motion';
import {
  Save, Eye, Code2, Plus, X, FileText, Folder,
  Upload, Loader2, ArrowLeft, Tag, Globe, Lock,
  File, Trash2, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SkillFile {
  path: string;
  name: string;
  content: string | null;
  size: number;
  mimeType: string | null;
  isDirectory: boolean;
}

const SKILL_TYPES = [
  { value: 'prompt', label: 'Prompt', description: 'Reusable prompt template' },
  { value: 'agent', label: 'Agent', description: 'Autonomous agent logic' },
  { value: 'tool', label: 'Tool', description: 'Tool or function' },
  { value: 'rpa', label: 'RPA', description: 'Robotic process automation' },
  { value: 'workflow', label: 'Workflow', description: 'Multi-step workflow' },
  { value: 'template', label: 'Template', description: 'Project template' },
];

const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicense'];

export default function SkillCreate() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [readme, setReadme] = useState(`# My Skill\n\nDescribe your skill here.\n\n## Usage\n\n\`\`\`\nskillshub install author/skill-name\n\`\`\`\n\n## Features\n\n- Feature 1\n- Feature 2\n\n## License\n\nMIT\n`);
  const [type, setType] = useState('prompt');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [license, setLicense] = useState('MIT');
  const [isPublic, setIsPublic] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [files, setFiles] = useState<SkillFile[]>([
    { path: '/', name: 'SKILL.md', content: '# Skill Configuration\n\nname: my-skill\nversion: 1.0.0\n', size: 50, mimeType: 'text/markdown', isDirectory: false },
  ]);
  const [newFileName, setNewFileName] = useState('');
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const slug = useMemo(() => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }, [name]);

  // Categories
  const { data: categoriesData } = trpc.categories.list.useQuery();
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  // Create mutation
  const createMutation = trpc.skills.create.useMutation({
    onSuccess: (data) => {
      toast.success('Skill published successfully!');
      navigate(`/skills/${user?.name || 'user'}/${slug}`);
    },
    onError: (err) => {
      toast.error(`Failed to create skill: ${err.message}`);
    },
  });

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddFile = () => {
    const fn = newFileName.trim();
    if (!fn) return;
    if (files.some(f => f.name === fn && f.path === '/')) {
      toast.error('File already exists');
      return;
    }
    setFiles([...files, {
      path: '/',
      name: fn,
      content: '',
      size: 0,
      mimeType: fn.endsWith('.md') ? 'text/markdown' : fn.endsWith('.json') ? 'application/json' : 'text/plain',
      isDirectory: false,
    }]);
    setNewFileName('');
    setEditingFile(files.length);
    setEditingContent('');
  };

  const handleDeleteFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    if (editingFile === index) {
      setEditingFile(null);
      setEditingContent('');
    }
  };

  const handleSaveFile = () => {
    if (editingFile === null) return;
    const updated = [...files];
    updated[editingFile] = {
      ...updated[editingFile],
      content: editingContent,
      size: new TextEncoder().encode(editingContent).length,
    };
    setFiles(updated);
    setEditingFile(null);
    toast.success('File saved');
  };

  const handlePublish = () => {
    if (!name.trim()) { toast.error('Please enter a skill name'); return; }
    if (!slug) { toast.error('Invalid skill name'); return; }

    // Add README.md to files if not exists
    const allFiles = [...files];
    const hasReadme = allFiles.some(f => f.name === 'README.md' && f.path === '/');
    if (!hasReadme) {
      allFiles.unshift({
        path: '/',
        name: 'README.md',
        content: readme,
        size: new TextEncoder().encode(readme).length,
        mimeType: 'text/markdown',
        isDirectory: false,
      });
    }

    createMutation.mutate({
      name: name.trim(),
      slug,
      description: description.trim() || undefined,
      readme,
      type: type as any,
      categoryId: categoryId || undefined,
      tags: tags.length > 0 ? tags : undefined,
      license,
      isPublic,
      files: allFiles,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-30" />
          <h1 className="font-display font-bold text-2xl mb-3">Sign in to Create Skills</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to create and publish skills.</p>
          <a href={getLoginUrl()}>
            <Button size="lg">Sign In</Button>
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 lg:py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/skills')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl">Create New Skill</h1>
            <p className="text-sm text-muted-foreground">Build and publish a skill to the SkillsHub community</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name & Slug */}
            <div className="border border-border rounded-xl p-6 bg-card">
              <h2 className="font-display font-semibold text-sm mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Skill Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., code-reviewer"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                  {slug && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      URL: <span className="font-mono text-primary">{user?.name}/{slug}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of what your skill does..."
                    className="w-full h-20 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>
            </div>

            {/* README Editor */}
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <h2 className="font-display font-semibold text-sm">README.md</h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewMode(false)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!previewMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Code2 className="w-3.5 h-3.5 inline mr-1" />Edit
                  </button>
                  <button
                    onClick={() => setPreviewMode(true)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${previewMode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />Preview
                  </button>
                </div>
              </div>
              {previewMode ? (
                <div className="p-6 min-h-[400px]">
                  <MarkdownRenderer content={readme} />
                </div>
              ) : (
                <textarea
                  value={readme}
                  onChange={(e) => setReadme(e.target.value)}
                  className="w-full min-h-[400px] p-4 font-mono text-sm bg-background resize-y focus:outline-none"
                  placeholder="Write your README in Markdown..."
                />
              )}
            </div>

            {/* Files */}
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-sm">Files</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="filename.ts"
                    className="h-8 px-3 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
                  />
                  <Button size="sm" variant="outline" onClick={handleAddFile} className="h-8 gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
              </div>

              {files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Folder className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No files yet. Add files to your skill.</p>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  {files.map((file, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2 border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${editingFile === i ? 'bg-primary/5' : ''}`}>
                      <File className="w-4 h-4 text-muted-foreground shrink-0" />
                      <button
                        onClick={() => { setEditingFile(i); setEditingContent(file.content || ''); }}
                        className="flex-1 text-left text-sm font-medium hover:text-primary transition-colors truncate"
                      >
                        {file.name}
                      </button>
                      <span className="text-xs text-muted-foreground">{file.size} B</span>
                      <button onClick={() => handleDeleteFile(i)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File Editor */}
              {editingFile !== null && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">{files[editingFile]?.name}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingFile(null)} className="h-7 text-xs">Cancel</Button>
                      <Button size="sm" onClick={handleSaveFile} className="h-7 text-xs gap-1"><Save className="w-3 h-3" />Save</Button>
                    </div>
                  </div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full h-48 p-3 font-mono text-xs rounded-lg border border-border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Publish</h3>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all flex-1 ${isPublic ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}
                >
                  <Globe className="w-4 h-4" /> Public
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all flex-1 ${!isPublic ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}
                >
                  <Lock className="w-4 h-4" /> Private
                </button>
              </div>
              <Button
                className="w-full gap-2"
                onClick={handlePublish}
                disabled={createMutation.isPending || !name.trim()}
              >
                {createMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Publish Skill</>
                )}
              </Button>
            </div>

            {/* Type */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Skill Type</h3>
              <div className="space-y-2">
                {SKILL_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${type === t.value ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'}`}
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className="text-xs block text-muted-foreground">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Category</h3>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select category...</option>
                {categoriesData?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">Tags</h3>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag..."
                  className="flex-1 h-8 px-3 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button size="sm" variant="outline" onClick={handleAddTag} className="h-8">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                    <Tag className="w-3 h-3" />{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* License */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="font-display font-semibold text-sm mb-4">License</h3>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {LICENSES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
