/**
 * Agent Builder - Create custom AI agents
 * Single-page: Configure agent + select Skills/Models in Agent Summary with searchable dropdowns
 */
import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import {
  ArrowLeft, Search, Check, X, Bot, Zap, Cpu,
  Rocket, Settings, ChevronDown, Loader2, Sparkles,
  ExternalLink, Key, Eye, EyeOff, Shield, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// ── Model Data ──
interface ModelOption {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  contextWindow: string;
  pricing: string;
}

const modelOptions: ModelOption[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '🟢', description: 'Most capable model for complex reasoning', contextWindow: '128K tokens', pricing: '$5 / 1M input' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', icon: '🟢', description: 'Fast and cost-effective', contextWindow: '128K tokens', pricing: '$0.15 / 1M input' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: '🟠', description: 'Excellent for coding and analysis', contextWindow: '200K tokens', pricing: '$3 / 1M input' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', icon: '🟠', description: 'Ultra-fast for high-volume tasks', contextWindow: '200K tokens', pricing: '$0.25 / 1M input' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', icon: '🔵', description: 'Long context and multimodal', contextWindow: '2M tokens', pricing: '$3.50 / 1M input' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', icon: '🔵', description: 'Fast inference with good quality', contextWindow: '1M tokens', pricing: '$0.075 / 1M input' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta', icon: '🟣', description: 'Open-source, self-hostable', contextWindow: '128K tokens', pricing: '$0.59 / 1M input' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', icon: '🔴', description: 'Strong multilingual support', contextWindow: '128K tokens', pricing: '$2 / 1M input' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', icon: '⚪', description: 'Cost-effective with strong reasoning', contextWindow: '128K tokens', pricing: '$0.27 / 1M input' },
  { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba', icon: '🟡', description: 'Strong in Chinese and English', contextWindow: '128K tokens', pricing: '$0.90 / 1M input' },
];

// ── Searchable Multi-Select Dropdown ──
function SearchableDropdown({
  label,
  icon,
  items,
  selectedIds,
  onToggle,
  renderItem,
  searchPlaceholder,
  allLink,
  allLinkLabel,
}: {
  label: string;
  icon: React.ReactNode;
  items: { id: string; searchText: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  renderItem: (item: any, selected: boolean) => React.ReactNode;
  searchPlaceholder: string;
  allLink: string;
  allLinkLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(i => i.searchText.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors text-sm"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span>{label} ({selectedIds.length})</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>
          </div>

          {/* Items */}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">No results found</div>
            ) : (
              filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    selectedIds.includes(item.id) ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {selectedIds.includes(item.id) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  {renderItem(item, selectedIds.includes(item.id))}
                </button>
              ))
            )}
          </div>

          {/* Footer link */}
          <Link href={allLink} onClick={() => setOpen(false)}>
            <div className="flex items-center justify-center gap-1.5 px-3 py-2.5 border-t border-border text-xs text-primary hover:bg-muted/50 transition-colors cursor-pointer">
              <ExternalLink className="w-3 h-3" />
              {allLinkLabel}
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DepsCreate() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  // Form state
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  // API Key state: keyed by provider name
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // Get unique providers from selected models
  const selectedProviders = useMemo(() => {
    const providers = new Map<string, { provider: string; icon: string; models: string[] }>();
    selectedModelIds.forEach(id => {
      const model = modelOptions.find(m => m.id === id);
      if (model) {
        if (!providers.has(model.provider)) {
          providers.set(model.provider, { provider: model.provider, icon: model.icon, models: [] });
        }
        providers.get(model.provider)!.models.push(model.name);
      }
    });
    return Array.from(providers.values());
  }, [selectedModelIds]);

  const updateApiKey = (provider: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const allKeysConfigured = selectedProviders.every(p => apiKeys[p.provider]?.trim());

  // Fetch real skills from DB
  const { data: skillsData } = trpc.skills.list.useQuery({ limit: 200 });
  const skillItems = useMemo(() => {
    if (!skillsData?.items) return [];
    return skillsData.items.map((s: any) => ({
      id: String(s.id),
      name: s.name,
      author: s.author,
      type: s.type || 'prompt',
      description: s.description || '',
      searchText: `${s.name} ${s.author} ${s.description || ''} ${s.type || ''}`,
    }));
  }, [skillsData]);

  const modelItems = useMemo(() =>
    modelOptions.map(m => ({ ...m, searchText: `${m.name} ${m.provider} ${m.description}` })),
  []);

  const toggleSkill = (id: string) => {
    setSelectedSkillIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };
  const toggleModel = (id: string) => {
    setSelectedModelIds(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleDeploy = () => {
    if (!agentName.trim()) { toast.error('Please enter an agent name'); return; }
    if (selectedSkillIds.length === 0) { toast.error('Please select at least one skill'); return; }
    if (selectedModelIds.length === 0) { toast.error('Please select at least one model'); return; }
    if (!allKeysConfigured) { toast.error('Please configure API keys for all selected model providers'); return; }

    setIsDeploying(true);
    // Simulate deploy then navigate to agent run page
    setTimeout(() => {
      setIsDeploying(false);
      const slug = agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      // Store agent config in sessionStorage for the run page
      sessionStorage.setItem('agent_config', JSON.stringify({
        name: agentName,
        description: agentDescription,
        systemPrompt,
        temperature,
        maxTokens,
        skills: selectedSkillIds.map(id => {
          const s = skillItems.find((si: any) => si.id === id);
          return s ? { id: s.id, name: s.name, author: s.author, type: s.type } : null;
        }).filter(Boolean),
        models: selectedModelIds.map(id => {
          const m = modelOptions.find(mo => mo.id === id);
          return m ? { id: m.id, name: m.name, provider: m.provider, icon: m.icon } : null;
        }).filter(Boolean),
        apiKeys: Object.fromEntries(
          selectedProviders.map(p => [p.provider, apiKeys[p.provider] || ''])
        ),
      }));
      toast.success('Agent deployed successfully!');
      navigate(`/deps/${user?.name || 'user'}/${slug}/run`);
    }, 2000);
  };

  if (loading) {
    return <Layout><div className="container py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div></Layout>;
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-30" />
          <h1 className="font-display font-bold text-2xl mb-3">Sign in to Create Agents</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to create and deploy agents.</p>
          <a href={getLoginUrl()}><Button size="lg">Sign In</Button></a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="container py-4">
            <div className="flex items-center gap-3 mb-3">
              <Link href="/deps">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" /> Back to Agents
                </Button>
              </Link>
            </div>
            <h1 className="font-display font-bold text-2xl mb-1">Create New Agent</h1>
            <p className="text-sm text-muted-foreground">Configure your AI agent, select skills and models, then deploy</p>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Config */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="border border-border rounded-xl p-6 bg-card">
                <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" /> Basic Configuration
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Agent Name *</label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="e.g., Full-Stack Dev Agent"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Description</label>
                    <textarea
                      value={agentDescription}
                      onChange={(e) => setAgentDescription(e.target.value)}
                      placeholder="Describe what your agent does..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* System Prompt */}
              <div className="border border-border rounded-xl p-6 bg-card">
                <h2 className="font-display font-semibold text-sm mb-4">System Prompt</h2>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are an AI agent that..."
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* API Key Configuration */}
              {selectedProviders.length > 0 && (
                <div className="border border-border rounded-xl p-6 bg-card">
                  <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" /> Model API Keys
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    Configure API keys for each model provider. Keys are stored securely in your browser session.
                  </p>
                  <div className="space-y-4">
                    {selectedProviders.map(({ provider, icon, models }) => (
                      <div key={provider} className="rounded-lg border border-border p-4 bg-muted/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{icon}</span>
                            <span className="text-sm font-semibold">{provider}</span>
                            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                              {models.length} model{models.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          {apiKeys[provider]?.trim() ? (
                            <span className="flex items-center gap-1 text-[10px] text-teal">
                              <Shield className="w-3 h-3" /> Configured
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-amber-500">
                              <AlertTriangle className="w-3 h-3" /> Required
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground mb-2">
                          Used for: {models.join(', ')}
                        </div>
                        <div className="relative">
                          <input
                            type={showKeys[provider] ? 'text' : 'password'}
                            value={apiKeys[provider] || ''}
                            onChange={(e) => updateApiKey(provider, e.target.value)}
                            placeholder={`Enter ${provider} API Key (e.g., sk-...)`}
                            className="w-full h-9 px-3 pr-10 rounded-md border border-border bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowKey(provider)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showKeys[provider] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parameters */}
              <div className="border border-border rounded-xl p-6 bg-card">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Temperature: {temperature}</label>
                    <input
                      type="range" min="0" max="2" step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Precise (0)</span>
                      <span>Creative (2)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Tokens: {maxTokens.toLocaleString()}</label>
                    <input
                      type="range" min="256" max="16384" step="256"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>256</span>
                      <span>16,384</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-5 sticky top-20">
                <h3 className="font-display font-semibold text-sm mb-5">Agent Summary</h3>

                {/* Skills Dropdown */}
                <div className="mb-4">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    SKILLS ({selectedSkillIds.length})
                  </p>
                  <SearchableDropdown
                    label="Select Skills"
                    icon={<Zap className="w-3.5 h-3.5" />}
                    items={skillItems}
                    selectedIds={selectedSkillIds}
                    onToggle={toggleSkill}
                    searchPlaceholder="Search skills..."
                    allLink="/skills"
                    allLinkLabel="Browse All Skills"
                    renderItem={(item: any) => (
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.author}/{item.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                      </div>
                    )}
                  />
                  {/* Selected skills tags */}
                  {selectedSkillIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSkillIds.map(id => {
                        const skill = skillItems.find((s: any) => s.id === id);
                        return skill ? (
                          <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-[10px] text-primary border border-primary/10">
                            {skill.name}
                            <button onClick={() => toggleSkill(id)} className="hover:text-red-500">
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Models Dropdown */}
                <div className="mb-4">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    MODELS ({selectedModelIds.length})
                  </p>
                  <SearchableDropdown
                    label="Select Models"
                    icon={<Cpu className="w-3.5 h-3.5" />}
                    items={modelItems}
                    selectedIds={selectedModelIds}
                    onToggle={toggleModel}
                    searchPlaceholder="Search models..."
                    allLink="/models"
                    allLinkLabel="Browse All Models"
                    renderItem={(item: any) => (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{item.icon}</span>
                          <p className="text-xs font-medium">{item.name}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{item.provider} · {item.pricing}</p>
                      </div>
                    )}
                  />
                  {/* Selected models tags */}
                  {selectedModelIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedModelIds.map(id => {
                        const model = modelOptions.find(m => m.id === id);
                        return model ? (
                          <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-coral/5 text-[10px] text-coral border border-coral/10">
                            {model.icon} {model.name}
                            <button onClick={() => toggleModel(id)} className="hover:text-red-500">
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Config Summary */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium">{temperature}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Max Tokens</span>
                    <span className="font-medium">{maxTokens.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deploy Button */}
                <Button
                  onClick={handleDeploy}
                  disabled={isDeploying || !agentName.trim() || (selectedProviders.length > 0 && !allKeysConfigured)}
                  className="w-full mt-5 bg-coral hover:bg-coral/90 text-white font-display font-semibold h-11 shadow-lg shadow-coral/20"
                >
                  {isDeploying ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deploying...</>
                  ) : (
                    <><Rocket className="w-4 h-4 mr-2" /> Deploy Agent</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
