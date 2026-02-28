/**
 * Agent Builder - Create custom AI agents
 * Features:
 * - Model API Key config dialog (per-provider specific fields + validation + status)
 * - Agent Summary dropdown with "All / Favorites / My" tabs
 * - "Browse All" opens full-screen modal for Skills/Models
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
  Key, Eye, EyeOff, Shield, AlertTriangle, CheckCircle2,
  ExternalLink, Star, User as UserIcon, Globe, Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

// ── Provider-specific configuration fields ──
interface ConfigField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'password' | 'text' | 'url';
  helpText?: string;
}

const PROVIDER_CONFIG: Record<string, { fields: ConfigField[]; docsUrl: string; description: string }> = {
  OpenAI: {
    description: 'Configure your OpenAI API access for GPT models.',
    docsUrl: 'https://platform.openai.com/api-keys',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'sk-proj-...', required: true, type: 'password', helpText: 'Get from platform.openai.com/api-keys' },
      { key: 'orgId', label: 'Organization ID', placeholder: 'org-...', required: false, type: 'text', helpText: 'Optional. Found in Settings > Organization' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.openai.com/v1', required: false, type: 'url', helpText: 'Custom endpoint for Azure OpenAI or proxies' },
    ],
  },
  Anthropic: {
    description: 'Configure your Anthropic API access for Claude models.',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'sk-ant-api03-...', required: true, type: 'password', helpText: 'Get from console.anthropic.com/settings/keys' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.anthropic.com', required: false, type: 'url', helpText: 'Custom endpoint if using a proxy' },
    ],
  },
  Google: {
    description: 'Configure your Google AI Studio API access for Gemini models.',
    docsUrl: 'https://aistudio.google.com/apikey',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'AIza...', required: true, type: 'password', helpText: 'Get from aistudio.google.com/apikey' },
      { key: 'projectId', label: 'Project ID', placeholder: 'my-project-id', required: false, type: 'text', helpText: 'Optional. GCP project ID for Vertex AI' },
      { key: 'region', label: 'Region', placeholder: 'us-central1', required: false, type: 'text', helpText: 'Optional. Vertex AI region' },
    ],
  },
  Meta: {
    description: 'Configure access for Llama models via a hosting provider.',
    docsUrl: 'https://llama.meta.com/',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'Your hosting provider API key', required: true, type: 'password', helpText: 'API key from Together AI, Fireworks, or other Llama host' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.together.xyz/v1', required: true, type: 'url', helpText: 'Endpoint of your Llama hosting provider' },
    ],
  },
  Mistral: {
    description: 'Configure your Mistral AI API access.',
    docsUrl: 'https://console.mistral.ai/api-keys/',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'Your Mistral API key', required: true, type: 'password', helpText: 'Get from console.mistral.ai/api-keys' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.mistral.ai/v1', required: false, type: 'url', helpText: 'Custom endpoint if needed' },
    ],
  },
  DeepSeek: {
    description: 'Configure your DeepSeek API access.',
    docsUrl: 'https://platform.deepseek.com/api_keys',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'sk-...', required: true, type: 'password', helpText: 'Get from platform.deepseek.com/api_keys' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://api.deepseek.com/v1', required: false, type: 'url', helpText: 'Custom endpoint if needed' },
    ],
  },
  Alibaba: {
    description: 'Configure your Alibaba Cloud DashScope API access for Qwen models.',
    docsUrl: 'https://dashscope.console.aliyun.com/',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'sk-...', required: true, type: 'password', helpText: 'Get from DashScope console' },
      { key: 'baseUrl', label: 'Base URL', placeholder: 'https://dashscope.aliyuncs.com/compatible-mode/v1', required: false, type: 'url', helpText: 'Custom endpoint if needed' },
    ],
  },
};

// ── Model Config Dialog ──
function ModelConfigDialog({
  provider,
  icon,
  models,
  config,
  onSave,
  onClose,
}: {
  provider: string;
  icon: string;
  models: string[];
  config: Record<string, string>;
  onSave: (config: Record<string, string>) => void;
  onClose: () => void;
}) {
  const providerConfig = PROVIDER_CONFIG[provider] || PROVIDER_CONFIG['OpenAI'];
  const [localConfig, setLocalConfig] = useState<Record<string, string>>({ ...config });
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const updateField = (key: string, value: string) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
    setValidated(false);
  };

  const requiredFilled = providerConfig.fields
    .filter(f => f.required)
    .every(f => localConfig[f.key]?.trim());

  const handleValidate = async () => {
    setValidating(true);
    // Simulate API key validation (in real app, call backend to verify)
    await new Promise(r => setTimeout(r, 1500));
    setValidating(false);
    if (requiredFilled) {
      setValidated(true);
      toast.success(`${provider} API key validated successfully`);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleSave = () => {
    if (!requiredFilled) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(localConfig);
    toast.success(`${provider} configuration saved`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className="font-display font-semibold text-base">{provider} Configuration</h3>
                <p className="text-xs text-muted-foreground">{models.join(', ')}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{providerConfig.description}</p>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {providerConfig.fields.map(field => (
            <div key={field.key}>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 text-xs">*</span>}
                {!field.required && <span className="text-muted-foreground text-[10px]">(optional)</span>}
              </label>
              <div className="relative">
                <input
                  type={field.type === 'password' && !showFields[field.key] ? 'password' : 'text'}
                  value={localConfig[field.key] || ''}
                  onChange={e => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowFields(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showFields[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {field.helpText && (
                <p className="text-[10px] text-muted-foreground mt-1">{field.helpText}</p>
              )}
            </div>
          ))}

          {/* Docs link */}
          <a
            href={providerConfig.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-2"
          >
            <ExternalLink className="w-3 h-3" /> Get API keys from {provider} documentation
          </a>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleValidate}
            disabled={!requiredFilled || validating}
            className="gap-1.5"
          >
            {validating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Validating...</>
            ) : validated ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Validated</>
            ) : (
              <><Shield className="w-3.5 h-3.5" /> Validate</>
            )}
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={!requiredFilled} className="gap-1.5">
              <Check className="w-3.5 h-3.5" /> Save Configuration
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Browse All Modal ──
function BrowseAllModal({
  title,
  items,
  selectedIds,
  onToggle,
  renderItem,
  searchPlaceholder,
  onClose,
}: {
  title: string;
  items: { id: string; searchText: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  renderItem: (item: any, selected: boolean) => React.ReactNode;
  searchPlaceholder: string;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(i => i.searchText.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display font-semibold text-base">{title}</h3>
            <p className="text-xs text-muted-foreground">{selectedIds.length} selected</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No results found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map(item => {
                const selected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggle(item.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-all ${
                      selected ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20 hover:bg-muted/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      selected ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {renderItem(item, selected)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/20 flex justify-end shrink-0">
          <Button size="sm" onClick={onClose}>Done ({selectedIds.length} selected)</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Searchable Multi-Select Dropdown with Tabs ──
type TabFilter = 'all' | 'favorites' | 'mine';

function SearchableDropdown({
  label,
  icon,
  items,
  selectedIds,
  onToggle,
  renderItem,
  searchPlaceholder,
  onBrowseAll,
  browseAllLabel,
  showTabs,
  favoritedIds,
  myIds,
}: {
  label: string;
  icon: React.ReactNode;
  items: { id: string; searchText: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  renderItem: (item: any, selected: boolean) => React.ReactNode;
  searchPlaceholder: string;
  onBrowseAll: () => void;
  browseAllLabel: string;
  showTabs?: boolean;
  favoritedIds?: string[];
  myIds?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabFilter>('all');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    // Apply tab filter
    if (tab === 'favorites' && favoritedIds) {
      list = list.filter(i => favoritedIds.includes(i.id));
    } else if (tab === 'mine' && myIds) {
      list = list.filter(i => myIds.includes(i.id));
    }
    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i => i.searchText.toLowerCase().includes(q));
    }
    return list;
  }, [items, search, tab, favoritedIds, myIds]);

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
          {/* Tabs */}
          {showTabs && (
            <div className="flex items-center gap-1 px-2 pt-2 pb-1">
              {([
                { key: 'all' as TabFilter, label: 'All', icon: <Globe className="w-3 h-3" /> },
                { key: 'favorites' as TabFilter, label: 'Favorites', icon: <Star className="w-3 h-3" /> },
                { key: 'mine' as TabFilter, label: 'My', icon: <UserIcon className="w-3 h-3" /> },
              ]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    tab === t.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          )}

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

          {/* Footer: Browse All */}
          <button
            onClick={() => { setOpen(false); onBrowseAll(); }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 border-t border-border text-xs text-primary hover:bg-muted/50 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            {browseAllLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──
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

  // Model config state: keyed by provider -> config fields
  const [modelConfigs, setModelConfigs] = useState<Record<string, Record<string, string>>>({});
  const [configDialogProvider, setConfigDialogProvider] = useState<string | null>(null);

  // Browse All modals
  const [showBrowseSkills, setShowBrowseSkills] = useState(false);
  const [showBrowseModels, setShowBrowseModels] = useState(false);

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

  // Check config status per provider
  const getConfigStatus = (provider: string): 'required' | 'not_completed' | 'configured' => {
    const config = modelConfigs[provider];
    if (!config) return 'required';
    const providerFields = PROVIDER_CONFIG[provider]?.fields || [];
    const requiredFields = providerFields.filter(f => f.required);
    const filledRequired = requiredFields.filter(f => config[f.key]?.trim());
    if (filledRequired.length === 0) return 'required';
    if (filledRequired.length < requiredFields.length) return 'not_completed';
    return 'configured';
  };

  const allConfigured = selectedProviders.every(p => getConfigStatus(p.provider) === 'configured');

  // Fetch real skills from DB
  const { data: skillsData } = trpc.skills.list.useQuery({ limit: 200 });
  const { data: favData } = trpc.favorites?.list?.useQuery(undefined, { enabled: !!user });

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

  const favoritedSkillIds = useMemo(() => {
    if (!favData) return [];
    return (favData as any[]).map((f: any) => String(f.skillId));
  }, [favData]);

  const mySkillIds = useMemo(() => {
    if (!skillItems.length || !user) return [];
    return skillItems.filter((s: any) => s.author === user.name).map((s: any) => s.id);
  }, [skillItems, user]);

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
    if (!allConfigured) { toast.error('Please configure all model providers'); return; }

    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      const slug = agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      // Build apiKeys from configs (use the apiKey field from each provider)
      const apiKeys: Record<string, string> = {};
      selectedProviders.forEach(p => {
        const cfg = modelConfigs[p.provider];
        if (cfg?.apiKey) apiKeys[p.provider] = cfg.apiKey;
      });
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
        apiKeys,
        modelConfigs,
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

              {/* Model API Key Configuration - Per Model with Config Button */}
              {selectedModelIds.length > 0 && (
                <div className="border border-border rounded-xl p-6 bg-card">
                  <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" /> Model API Keys
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    Click the configure button next to each model provider to set up API credentials.
                  </p>
                  <div className="space-y-3">
                    {selectedProviders.map(({ provider, icon, models }) => {
                      const status = getConfigStatus(provider);
                      return (
                        <div key={provider} className="flex items-center gap-3 rounded-lg border border-border p-3 bg-muted/10">
                          <span className="text-xl shrink-0">{icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{provider}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{models.join(', ')}</p>
                          </div>
                          {/* Config button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfigDialogProvider(provider)}
                            className="gap-1.5 shrink-0"
                          >
                            <Wrench className="w-3.5 h-3.5" /> Configure
                          </Button>
                          {/* Status badge */}
                          <div className="shrink-0">
                            {status === 'configured' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal/10 text-[10px] font-medium text-teal border border-teal/20">
                                <CheckCircle2 className="w-3 h-3" /> Configured
                              </span>
                            )}
                            {status === 'not_completed' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-[10px] font-medium text-amber-500 border border-amber-500/20">
                                <AlertTriangle className="w-3 h-3" /> Not Completed
                              </span>
                            )}
                            {status === 'required' && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-[10px] font-medium text-red-500 border border-red-500/20">
                                <Key className="w-3 h-3" /> Required
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
                    onBrowseAll={() => setShowBrowseSkills(true)}
                    browseAllLabel="Browse All Skills"
                    showTabs
                    favoritedIds={favoritedSkillIds}
                    myIds={mySkillIds}
                    renderItem={(item: any) => (
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.author}/{item.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                      </div>
                    )}
                  />
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
                    onBrowseAll={() => setShowBrowseModels(true)}
                    browseAllLabel="Browse All Models"
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
                  disabled={isDeploying || !agentName.trim() || (selectedProviders.length > 0 && !allConfigured)}
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

      {/* Model Config Dialog */}
      <AnimatePresence>
        {configDialogProvider && (() => {
          const p = selectedProviders.find(sp => sp.provider === configDialogProvider);
          return p ? (
            <ModelConfigDialog
              key={p.provider}
              provider={p.provider}
              icon={p.icon}
              models={p.models}
              config={modelConfigs[p.provider] || {}}
              onSave={(cfg) => setModelConfigs(prev => ({ ...prev, [p.provider]: cfg }))}
              onClose={() => setConfigDialogProvider(null)}
            />
          ) : null;
        })()}
      </AnimatePresence>

      {/* Browse All Skills Modal */}
      <AnimatePresence>
        {showBrowseSkills && (
          <BrowseAllModal
            title="Browse All Skills"
            items={skillItems}
            selectedIds={selectedSkillIds}
            onToggle={toggleSkill}
            searchPlaceholder="Search skills by name, author, description..."
            onClose={() => setShowBrowseSkills(false)}
            renderItem={(item: any) => (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.author}/{item.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
              </div>
            )}
          />
        )}
      </AnimatePresence>

      {/* Browse All Models Modal */}
      <AnimatePresence>
        {showBrowseModels && (
          <BrowseAllModal
            title="Browse All Models"
            items={modelItems}
            selectedIds={selectedModelIds}
            onToggle={toggleModel}
            searchPlaceholder="Search models by name, provider..."
            onClose={() => setShowBrowseModels(false)}
            renderItem={(item: any) => (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{item.icon}</span>
                  <p className="text-xs font-medium">{item.name}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">{item.provider} · {item.contextWindow} · {item.pricing}</p>
              </div>
            )}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
