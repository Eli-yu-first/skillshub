/**
 * Agent Builder - Create custom AI agents by combining Skills + LLMs
 * Step-by-step wizard: Select Skills → Choose Models → Configure → Deploy
 */
import { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, ArrowRight, Search, Check, X, Bot, Zap, Cpu,
  Layers, Rocket, Settings, Play, Terminal, Globe, Shield,
  ChevronDown, ChevronUp, Plus, Minus, Info, Code2, Copy,
  CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ──
interface SkillOption {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  author: string;
}

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  contextWindow: string;
  pricing: string;
}

// ── Mock Data ──
const skillOptions: SkillOption[] = [
  { id: '1', name: 'React Component Builder', category: 'Web Development', type: 'tool', description: 'Generates production-ready React components with TypeScript', author: 'skillsai' },
  { id: '2', name: 'Node.js API Generator', category: 'Web Development', type: 'tool', description: 'Creates RESTful and GraphQL API endpoints', author: 'skillsai' },
  { id: '3', name: 'SQL Schema Designer', category: 'Database', type: 'tool', description: 'Designs optimized database schemas with migrations', author: 'dataops' },
  { id: '4', name: 'Docker Deployer', category: 'DevOps', type: 'agent', description: 'Containerizes and deploys applications', author: 'devopsai' },
  { id: '5', name: 'Paper Summarizer', category: 'Research', type: 'prompt', description: 'Summarizes academic papers with key findings', author: 'academicai' },
  { id: '6', name: 'Code Reviewer', category: 'Development', type: 'agent', description: 'Reviews code for bugs, security, and best practices', author: 'skillsai' },
  { id: '7', name: 'SEO Optimizer', category: 'Marketing', type: 'tool', description: 'Optimizes content for search engines', author: 'marketai' },
  { id: '8', name: 'Contract Generator', category: 'Legal', type: 'prompt', description: 'Generates legal contracts and agreements', author: 'legalai' },
  { id: '9', name: 'Data Visualizer', category: 'Data Science', type: 'tool', description: 'Creates charts and dashboards from data', author: 'dataops' },
  { id: '10', name: 'Email Campaign Writer', category: 'Marketing', type: 'prompt', description: 'Writes personalized email campaigns', author: 'marketai' },
  { id: '11', name: 'Unit Test Generator', category: 'Development', type: 'tool', description: 'Generates comprehensive unit tests', author: 'skillsai' },
  { id: '12', name: 'API Documentation Writer', category: 'Documentation', type: 'prompt', description: 'Creates API docs from code', author: 'docsai' },
  { id: '13', name: 'CSS Animator', category: 'Web Development', type: 'tool', description: 'Creates CSS animations and transitions', author: 'designai' },
  { id: '14', name: 'Python Script Generator', category: 'Development', type: 'tool', description: 'Generates Python scripts for automation', author: 'pyai' },
  { id: '15', name: 'Translation Engine', category: 'NLP', type: 'agent', description: 'Translates text between 50+ languages', author: 'nlpai' },
  { id: '16', name: 'Image Prompt Crafter', category: 'Creative', type: 'prompt', description: 'Creates detailed prompts for image generation', author: 'artai' },
];

const modelOptions: ModelOption[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: '🟢', description: 'Most capable model for complex reasoning', contextWindow: '128K tokens', pricing: '$5 / 1M input tokens' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', icon: '🟢', description: 'Fast and cost-effective for simple tasks', contextWindow: '128K tokens', pricing: '$0.15 / 1M input tokens' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: '🟠', description: 'Excellent for coding and analysis', contextWindow: '200K tokens', pricing: '$3 / 1M input tokens' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', icon: '🟠', description: 'Ultra-fast for high-volume tasks', contextWindow: '200K tokens', pricing: '$0.25 / 1M input tokens' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', icon: '🔵', description: 'Long context and multimodal support', contextWindow: '2M tokens', pricing: '$3.50 / 1M input tokens' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', icon: '🔵', description: 'Fast inference with good quality', contextWindow: '1M tokens', pricing: '$0.075 / 1M input tokens' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta', icon: '🟣', description: 'Open-source, self-hostable', contextWindow: '128K tokens', pricing: '$0.59 / 1M input tokens' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', icon: '🔴', description: 'European model with strong multilingual', contextWindow: '128K tokens', pricing: '$2 / 1M input tokens' },
  { id: 'qwen-2.5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba', icon: '🟡', description: 'Strong in Chinese and English', contextWindow: '128K tokens', pricing: '$0.90 / 1M input tokens' },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', icon: '⚪', description: 'Cost-effective with strong reasoning', contextWindow: '128K tokens', pricing: '$0.27 / 1M input tokens' },
];

const steps = [
  { id: 1, title: 'Select Skills', icon: <Zap className="w-4 h-4" /> },
  { id: 2, title: 'Choose Models', icon: <Cpu className="w-4 h-4" /> },
  { id: 3, title: 'Configure', icon: <Settings className="w-4 h-4" /> },
  { id: 4, title: 'Deploy', icon: <Rocket className="w-4 h-4" /> },
];

export default function DepsCreate() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [expandedSkillCategory, setExpandedSkillCategory] = useState<string | null>(null);

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const filtered = skillSearch
      ? skillOptions.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()) || s.category.toLowerCase().includes(skillSearch.toLowerCase()))
      : skillOptions;
    const groups: Record<string, SkillOption[]> = {};
    filtered.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [skillSearch]);

  const filteredModels = useMemo(() => {
    if (!modelSearch) return modelOptions;
    const q = modelSearch.toLowerCase();
    return modelOptions.filter(m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q));
  }, [modelSearch]);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleModel = (id: string) => {
    setSelectedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedSkills.length > 0;
      case 2: return selectedModels.length > 0;
      case 3: return agentName.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="container py-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/deps">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" /> Back to Agents
                </Button>
              </Link>
            </div>
            <h1 className="font-display font-bold text-2xl mb-1">Create New Agent</h1>
            <p className="text-sm text-muted-foreground">Combine skills and models to build a custom AI agent</p>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mt-6">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      currentStep === step.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : currentStep > step.id
                        ? 'bg-teal/10 text-teal cursor-pointer hover:bg-teal/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-3.5 h-3.5" /> : step.icon}
                    <span className="hidden sm:inline">{step.title}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 h-px mx-1 ${currentStep > step.id ? 'bg-teal' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="container py-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Skills */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display font-bold text-xl">Select Skills</h2>
                    <p className="text-sm text-muted-foreground mt-1">{selectedSkills.length} skills selected</p>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search skills..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Selected Skills Bar */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    {selectedSkills.map(id => {
                      const skill = skillOptions.find(s => s.id === id);
                      return skill ? (
                        <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {skill.name}
                          <button onClick={() => toggleSkill(id)} className="hover:bg-primary/20 rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Skills by Category */}
                <div className="space-y-3">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedSkillCategory(expandedSkillCategory === category ? null : category)}
                        className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-sm">{category}</span>
                          <span className="text-xs text-muted-foreground">({skills.length} skills)</span>
                        </div>
                        {expandedSkillCategory === category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {expandedSkillCategory === category && (
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2 bg-background">
                              {skills.map(skill => (
                                <button
                                  key={skill.id}
                                  onClick={() => toggleSkill(skill.id)}
                                  className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                                    selectedSkills.includes(skill.id)
                                      ? 'border-primary/40 bg-primary/5'
                                      : 'border-border hover:border-primary/20 hover:bg-muted/30'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                    selectedSkills.includes(skill.id) ? 'border-primary bg-primary' : 'border-border'
                                  }`}>
                                    {selectedSkills.includes(skill.id) && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium">{skill.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{skill.type}</span>
                                      <span className="text-[10px] text-muted-foreground">by {skill.author}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Models */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display font-bold text-xl">Choose Models</h2>
                    <p className="text-sm text-muted-foreground mt-1">{selectedModels.length} models selected</p>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => toggleModel(model.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
                        selectedModels.includes(model.id)
                          ? 'border-primary/40 bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/20 hover:bg-muted/30'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        selectedModels.includes(model.id) ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {selectedModels.includes(model.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{model.icon}</span>
                          <span className="font-display font-semibold text-sm">{model.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                          <span className="px-1.5 py-0.5 rounded bg-muted">{model.provider}</span>
                          <span>{model.contextWindow}</span>
                          <span className="text-coral">{model.pricing}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Configure */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-bold text-xl mb-6">Configure Agent</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Config */}
                  <div className="lg:col-span-2 space-y-5">
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

                    <div>
                      <label className="block text-sm font-medium mb-1.5">System Prompt</label>
                      <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="You are an AI agent that..."
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Temperature: {temperature}</label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
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
                        <label className="block text-sm font-medium mb-1.5">Max Tokens: {maxTokens}</label>
                        <input
                          type="range"
                          min="256"
                          max="16384"
                          step="256"
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

                  {/* Summary Sidebar */}
                  <div className="bg-card border border-border rounded-xl p-5 h-fit sticky top-20">
                    <h3 className="font-display font-semibold text-sm mb-4">Agent Summary</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Skills ({selectedSkills.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedSkills.map(id => {
                            const skill = skillOptions.find(s => s.id === id);
                            return skill ? (
                              <span key={id} className="px-2 py-0.5 rounded bg-primary/5 text-[11px] text-primary/80 border border-primary/10">
                                {skill.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Models ({selectedModels.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedModels.map(id => {
                            const model = modelOptions.find(m => m.id === id);
                            return model ? (
                              <span key={id} className="px-2 py-0.5 rounded bg-coral/5 text-[11px] text-coral/80 border border-coral/10">
                                {model.icon} {model.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Temperature</span>
                          <span className="font-medium">{temperature}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Max Tokens</span>
                          <span className="font-medium">{maxTokens.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Deploy */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-bold text-xl mb-6">Deploy Agent</h2>

                {!deploySuccess ? (
                  <div className="max-w-2xl mx-auto">
                    {/* Deploy Preview */}
                    <div className="bg-card border border-border rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-coral/20 flex items-center justify-center">
                          <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-lg">{agentName || 'Untitled Agent'}</h3>
                          <p className="text-sm text-muted-foreground">{agentDescription || 'No description'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">Skills</p>
                          <p className="text-sm font-medium">{selectedSkills.length} skills</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">Models</p>
                          <p className="text-sm font-medium">{selectedModels.length} models</p>
                        </div>
                      </div>

                      {/* Deployment Options */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Deployment Options</h4>
                        {[
                          { id: 'sandbox', icon: <Terminal className="w-4 h-4" />, title: 'Sandbox Environment', desc: 'Isolated container with API access. Free tier available.', badge: 'Recommended' },
                          { id: 'serverless', icon: <Globe className="w-4 h-4" />, title: 'Serverless Function', desc: 'Auto-scaling with pay-per-invocation pricing.', badge: 'Pro' },
                          { id: 'dedicated', icon: <Shield className="w-4 h-4" />, title: 'Dedicated Instance', desc: 'Persistent compute with guaranteed resources.', badge: 'Enterprise' },
                        ].map((opt, idx) => (
                          <div key={opt.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                            idx === 0 ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20'
                          }`}>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              {opt.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{opt.title}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                  opt.badge === 'Recommended' ? 'bg-teal/10 text-teal' :
                                  opt.badge === 'Pro' ? 'bg-coral/10 text-coral' :
                                  'bg-primary/10 text-primary'
                                }`}>{opt.badge}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                            </div>
                            {idx === 0 && <Check className="w-4 h-4 text-primary shrink-0 mt-1" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deploy Button */}
                    <Button
                      onClick={handleDeploy}
                      disabled={isDeploying}
                      size="lg"
                      className="w-full bg-coral hover:bg-coral-dark text-white font-display font-semibold h-12 shadow-lg shadow-coral/25"
                    >
                      {isDeploying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deploying to Sandbox...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Deploy to Sandbox
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  /* Deploy Success */
                  <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-teal" />
                      </div>
                      <h3 className="font-display font-bold text-2xl mb-2">Agent Deployed!</h3>
                      <p className="text-muted-foreground">Your agent is now live and ready to use.</p>
                    </motion.div>

                    {/* API Endpoint */}
                    <div className="bg-card border border-border rounded-xl p-5 mb-6 text-left">
                      <h4 className="text-sm font-medium mb-3">API Endpoint</h4>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 font-mono text-sm">
                        <code className="flex-1 truncate text-primary">
                          https://api.skillshub.dev/agents/{agentName.toLowerCase().replace(/\s+/g, '-')}/invoke
                        </code>
                        <button className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors">
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>

                      <h4 className="text-sm font-medium mt-4 mb-3">Quick Start</h4>
                      <div className="rounded-lg bg-indigo p-4 text-left overflow-x-auto">
                        <pre className="text-xs text-white/80 font-mono">
{`curl -X POST \\
  https://api.skillshub.dev/agents/${agentName.toLowerCase().replace(/\s+/g, '-')}/invoke \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Your input here",
    "parameters": {
      "temperature": ${temperature},
      "max_tokens": ${maxTokens}
    }
  }'`}
                        </pre>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3">
                      <Link href="/deps">
                        <Button variant="outline" className="font-display font-semibold">
                          Back to Agents
                        </Button>
                      </Link>
                      <Button className="bg-primary text-primary-foreground font-display font-semibold">
                        <Play className="w-4 h-4 mr-1.5" />
                        Open Playground
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {!deploySuccess && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="font-display font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                  disabled={!canProceed()}
                  className="bg-primary text-primary-foreground font-display font-semibold"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
