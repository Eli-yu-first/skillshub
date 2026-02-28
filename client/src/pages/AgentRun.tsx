/**
 * Agent Run Page - AI Task Dispatch System
 * Left: Chat interface with real LLM integration
 * Right: Selected skills as "team members" (roles) that receive dispatched tasks
 */
import { useState, useRef, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import Layout from '@/components/Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import {
  Send, Bot, User, Zap, ArrowLeft, Cpu,
  Loader2, Sparkles, Activity,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  skills: { id: string; name: string; author: string; type: string }[];
  models: { id: string; name: string; provider: string; icon: string }[];
  apiKeys?: Record<string, string>;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  dispatched?: { skillName: string; status: 'pending' | 'running' | 'done' | 'error' }[];
  model?: string;
  provider?: string;
  tokensUsed?: number;
}

interface SkillStatus {
  id: string;
  name: string;
  author: string;
  type: string;
  status: 'idle' | 'active' | 'done' | 'error';
  lastTask?: string;
  taskCount: number;
}

const ROLE_COLORS: Record<string, string> = {
  prompt: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  agent: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  tool: 'bg-green-500/10 text-green-600 border-green-500/20',
  rpa: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  workflow: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  template: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
};

const ROLE_ICONS: Record<string, string> = {
  prompt: '💬',
  agent: '🤖',
  tool: '🔧',
  rpa: '⚙️',
  workflow: '🔄',
  template: '📋',
};

export default function AgentRun() {
  const [, params] = useRoute('/deps/:author/:slug');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  const [skillStatuses, setSkillStatuses] = useState<SkillStatus[]>([]);

  // tRPC mutation for real LLM chat
  const chatMutation = trpc.agentChat.send.useMutation();

  useEffect(() => {
    const stored = sessionStorage.getItem('agent_config');
    if (stored) {
      try {
        const config = JSON.parse(stored) as AgentConfig;
        setAgentConfig(config);
        setSkillStatuses(config.skills.map(s => ({
          id: s.id,
          name: s.name,
          author: s.author,
          type: s.type,
          status: 'idle',
          taskCount: 0,
        })));
        setMessages([{
          id: 'welcome',
          role: 'system',
          content: `**${config.name}** is ready with ${config.skills.length} skill${config.skills.length > 1 ? 's' : ''} and ${config.models.length} model${config.models.length > 1 ? 's' : ''}. Your instructions will be intelligently dispatched to the appropriate skill modules.\n\n*Powered by ${config.models.length > 0 ? config.models.map(m => m.name).join(', ') : 'SkillsHub Built-in LLM'}*`,
          timestamp: new Date(),
        }]);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real LLM dispatch
  const handleDispatch = async (userMessage: string) => {
    if (!agentConfig) return;
    setIsProcessing(true);

    // Activate all skills
    setSkillStatuses(prev => prev.map(s => ({
      ...s, status: 'active' as const, lastTask: userMessage.slice(0, 50)
    })));

    try {
      // Build conversation history for context
      const chatHistory = messages
        .filter(m => m.role !== 'system')
        .slice(-10)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      chatHistory.push({ role: 'user', content: userMessage });

      // Determine which API key and provider to use
      const primaryModel = agentConfig.models[0];
      const provider = primaryModel?.provider;
      const apiKey = provider && agentConfig.apiKeys ? agentConfig.apiKeys[provider] : undefined;

      const result = await chatMutation.mutateAsync({
        messages: chatHistory,
        systemPrompt: agentConfig.systemPrompt,
        temperature: agentConfig.temperature,
        maxTokens: agentConfig.maxTokens,
        skills: agentConfig.skills.map(s => ({ name: s.name, type: s.type })),
        modelProvider: provider,
        apiKey: apiKey,
      });

      // Mark skills as done
      setSkillStatuses(prev => prev.map(s => ({
        ...s, status: 'done' as const, taskCount: s.taskCount + 1
      })));

      // Add assistant response
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: result.content,
        timestamp: new Date(),
        dispatched: agentConfig.skills.map(s => ({ skillName: s.name, status: 'done' as const })),
        model: result.model,
        provider: result.provider,
        tokensUsed: result.tokensUsed,
      }]);

    } catch (error: any) {
      // Error handling
      setSkillStatuses(prev => prev.map(s => ({
        ...s, status: 'error' as const
      })));

      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `**Error**: ${error.message || 'Failed to get response from LLM. Please check your API key configuration and try again.'}`,
        timestamp: new Date(),
      }]);

      toast.error('Failed to get AI response');
    } finally {
      setIsProcessing(false);
      // Reset statuses after delay
      setTimeout(() => {
        setSkillStatuses(prev => prev.map(s => ({ ...s, status: 'idle' as const })));
      }, 3000);
    }
  };

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || isProcessing) return;

    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date(),
    }]);
    setInput('');
    handleDispatch(msg);
  };

  if (!agentConfig) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-30" />
          <h1 className="font-display font-bold text-2xl mb-3">Agent Not Found</h1>
          <p className="text-muted-foreground mb-6">This agent hasn't been configured yet. Create one first.</p>
          <Link href="/deps/create">
            <Button>Create New Agent</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3 shrink-0">
        <Link href="/deps">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-coral/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-semibold text-sm truncate">{agentConfig.name}</h1>
          <p className="text-[10px] text-muted-foreground truncate">{agentConfig.description || 'AI Agent'}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
            <Zap className="w-3 h-3" /> {agentConfig.skills.length} Skills
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50">
            <Cpu className="w-3 h-3" /> {agentConfig.models.length} Models
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role !== 'user' && (
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                      msg.role === 'system' ? 'bg-muted' : 'bg-gradient-to-br from-primary/20 to-coral/20'
                    }`}>
                      {msg.role === 'system' ? <Sparkles className="w-4 h-4 text-muted-foreground" /> : <Bot className="w-4 h-4 text-primary" />}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`rounded-xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : msg.role === 'system'
                        ? 'bg-muted/50 border border-border'
                        : 'bg-card border border-border'
                    }`}>
                      {msg.role === 'user' ? (
                        <p>{msg.content}</p>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>
                    {/* Dispatch info */}
                    {msg.dispatched && msg.dispatched.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {msg.dispatched.map((d, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {d.skillName}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Model info */}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                      {msg.model && msg.provider && (
                        <span className="text-[10px] text-muted-foreground/60">
                          via {msg.provider} ({msg.model}){msg.tokensUsed ? ` · ${msg.tokensUsed} tokens` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-coral/20 shrink-0 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with AI models...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card/50 p-4">
            <div className="flex items-end gap-3 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your instruction... (Enter to send, Shift+Enter for new line)"
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 min-h-[44px] max-h-[120px]"
                  style={{ height: 'auto', overflow: 'hidden' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                size="icon"
                className="h-11 w-11 rounded-xl bg-primary shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Skills Team Panel */}
        <div className="w-72 border-l border-border bg-card/30 overflow-y-auto hidden lg:block">
          <div className="p-4">
            <h2 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">
              Virtual Team ({skillStatuses.length})
            </h2>

            <div className="space-y-3">
              {skillStatuses.map((skill) => (
                <motion.div
                  key={skill.id}
                  animate={{
                    scale: skill.status === 'active' ? 1.02 : 1,
                  }}
                  className={`rounded-xl border p-3 transition-all ${
                    skill.status === 'active'
                      ? 'border-primary/40 bg-primary/5 shadow-sm shadow-primary/10'
                      : skill.status === 'done'
                      ? 'border-teal/30 bg-teal/5'
                      : skill.status === 'error'
                      ? 'border-red-500/30 bg-red-500/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                      ROLE_COLORS[skill.type] || 'bg-muted'
                    } border`}>
                      {ROLE_ICONS[skill.type] || '🔧'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{skill.name}</p>
                      <p className="text-[10px] text-muted-foreground">{skill.author}</p>
                    </div>
                    <div className="shrink-0">
                      {skill.status === 'active' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      {skill.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-teal" />}
                      {skill.status === 'idle' && <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                      {skill.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                    </div>
                  </div>

                  {skill.lastTask && (
                    <p className="text-[10px] text-muted-foreground mt-2 truncate pl-11">
                      {skill.status === 'active' ? '⚡ Processing: ' : '✓ Last: '}{skill.lastTask}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2 pl-11">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${ROLE_COLORS[skill.type] || 'bg-muted text-muted-foreground border-border'}`}>
                      {skill.type}
                    </span>
                    {skill.taskCount > 0 && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Activity className="w-2.5 h-2.5" /> {skill.taskCount} tasks
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Models Info */}
            {agentConfig.models.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Models
                </h2>
                <div className="space-y-2">
                  {agentConfig.models.map((model) => (
                    <div key={model.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                      <span className="text-sm">{model.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{model.name}</p>
                        <p className="text-[10px] text-muted-foreground">{model.provider}</p>
                      </div>
                      {agentConfig.apiKeys?.[model.provider] ? (
                        <CheckCircle2 className="w-3 h-3 text-teal shrink-0" />
                      ) : (
                        <span className="text-[9px] text-amber-500 shrink-0">Built-in</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Config */}
            <div className="mt-6 p-3 rounded-lg bg-muted/30 border border-border">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Config</h3>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium">{agentConfig.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Tokens</span>
                  <span className="font-medium">{agentConfig.maxTokens.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
