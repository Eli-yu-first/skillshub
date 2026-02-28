/**
 * User Profile Page
 * Displays user's created skills, favorited skills, and created agents
 */
import { useState, useMemo } from 'react';
import { Link, useRoute } from 'wouter';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import {
  User as UserIcon, Code2, Star, Bot, Calendar,
  ExternalLink, Loader2, Zap, GitFork, MessageSquare,
  Heart, Plus, Settings, Mail, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

type ProfileTab = 'skills' | 'favorites' | 'agents';

export default function UserProfile() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, params] = useRoute('/profile/:username');
  const username = params?.username || user?.name || '';
  const [activeTab, setActiveTab] = useState<ProfileTab>('skills');

  // Fetch user's skills
  const { data: allSkills, isLoading: skillsLoading } = trpc.skills.list.useQuery({ limit: 500 });
  const { data: favorites, isLoading: favsLoading } = trpc.favorites?.list?.useQuery(undefined, { enabled: !!user });
  const { data: myAgents, isLoading: agentsLoading } = trpc.profile?.myAgents?.useQuery(undefined, { enabled: !!user });

  const userSkills = useMemo(() => {
    if (!allSkills?.items) return [];
    return allSkills.items.filter((s: any) => s.author === username);
  }, [allSkills, username]);

  const favoritedSkills = useMemo(() => {
    if (!favorites || !allSkills?.items) return [];
    const favIds = new Set((favorites as any[]).map((f: any) => f.skillId));
    return allSkills.items.filter((s: any) => favIds.has(s.id));
  }, [favorites, allSkills]);

  const isOwnProfile = user?.name === username;

  if (authLoading) {
    return <Layout><div className="container py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div></Layout>;
  }

  const tabs: { key: ProfileTab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'skills', label: 'My Skills', icon: <Code2 className="w-4 h-4" />, count: userSkills.length },
    { key: 'favorites', label: 'Favorites', icon: <Star className="w-4 h-4" />, count: favoritedSkills.length },
    { key: 'agents', label: 'Agents', icon: <Bot className="w-4 h-4" />, count: (myAgents as any[])?.length || 0 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Profile Header */}
        <div className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container py-10">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-coral flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg shadow-primary/20 shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-bold text-2xl mb-1">{username}</h1>
                {user?.email && isOwnProfile && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5" /> {userSkills.length} skills
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> {favoritedSkills.length} favorites
                  </span>
                  <span className="flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> {(myAgents as any[])?.length || 0} agents
                  </span>
                  {user?.role === 'admin' && isOwnProfile && (
                    <span className="flex items-center gap-1 text-primary">
                      <Shield className="w-3.5 h-3.5" /> Admin
                    </span>
                  )}
                </div>
                {user?.createdAt && isOwnProfile && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                )}
              </div>

              {/* Actions */}
              {isOwnProfile && (
                <div className="flex gap-2 shrink-0">
                  <Link href="/skills/create">
                    <Button size="sm" className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> New Skill
                    </Button>
                  </Link>
                  <Link href="/deps/create">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Bot className="w-3.5 h-3.5" /> New Agent
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border bg-card/50">
          <div className="container">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-8">
          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div>
              {skillsLoading ? (
                <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
              ) : userSkills.length === 0 ? (
                <EmptyState
                  icon={<Code2 className="w-12 h-12" />}
                  title="No skills yet"
                  description={isOwnProfile ? "Create your first skill to share with the community." : `${username} hasn't created any skills yet.`}
                  action={isOwnProfile ? <Link href="/skills/create"><Button size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Create Skill</Button></Link> : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userSkills.map((skill: any) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              {favsLoading ? (
                <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
              ) : favoritedSkills.length === 0 ? (
                <EmptyState
                  icon={<Star className="w-12 h-12" />}
                  title="No favorites yet"
                  description={isOwnProfile ? "Browse skills and add them to your favorites." : `${username} hasn't favorited any skills yet.`}
                  action={isOwnProfile ? <Link href="/skills"><Button size="sm" className="gap-1.5"><Zap className="w-3.5 h-3.5" /> Browse Skills</Button></Link> : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoritedSkills.map((skill: any) => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div>
              {agentsLoading ? (
                <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
              ) : !(myAgents as any[])?.length ? (
                <EmptyState
                  icon={<Bot className="w-12 h-12" />}
                  title="No agents yet"
                  description={isOwnProfile ? "Create your first AI agent to automate tasks." : `${username} hasn't created any agents yet.`}
                  action={isOwnProfile ? <Link href="/deps/create"><Button size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Create Agent</Button></Link> : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(myAgents as any[]).map((agent: any) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ── Skill Card ──
function SkillCard({ skill }: { skill: any }) {
  return (
    <Link href={`/skills/${skill.author}/${skill.name}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="border border-border rounded-xl p-4 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer h-full"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm truncate">{skill.name}</h3>
            <p className="text-[10px] text-muted-foreground">{skill.author}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{skill.description || 'No description'}</p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {skill.likes || 0}</span>
          <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {skill.forks || 0}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {skill.discussions || 0}</span>
          {skill.type && (
            <span className="ml-auto px-1.5 py-0.5 rounded bg-muted text-[9px] font-medium uppercase">{skill.type}</span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

// ── Agent Card ──
function AgentCard({ agent }: { agent: any }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="border border-border rounded-xl p-4 bg-card hover:border-coral/30 hover:shadow-lg hover:shadow-coral/5 transition-all h-full"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-coral" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-sm truncate">{agent.name}</h3>
          <p className="text-[10px] text-muted-foreground">{agent.author}</p>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
          agent.status === 'published' ? 'bg-teal/10 text-teal' : 'bg-muted text-muted-foreground'
        }`}>
          {agent.status || 'draft'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{agent.description || 'No description'}</p>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        {agent.createdAt && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(agent.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Empty State ──
function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-16">
      <div className="text-muted-foreground/30 mb-4 flex justify-center">{icon}</div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
