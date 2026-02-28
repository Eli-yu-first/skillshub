/**
 * Profile Page - User profile with favorites list
 */
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { formatNumber, getTypeIcon, getTypeColor, getTypeBgColor } from '@/lib/data';
import { getLoginUrl } from '@/const';
import { motion } from 'framer-motion';
import {
  Heart, Download, Bookmark, BookmarkCheck, User, Settings,
  Star, Clock, Loader2, LogIn, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ProfileTab = 'favorites' | 'skills' | 'activity';

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');

  // Fetch user's favorite skills
  const { data: favoriteSkills, isLoading: favsLoading } = trpc.favorites.skills.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const utils = trpc.useUtils();
  const removeFavMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      utils.favorites.skills.invalidate();
      toast.success('Removed from favorites');
    },
  });

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h1 className="font-display font-bold text-2xl mb-2">Sign in to view your profile</h1>
          <p className="text-muted-foreground mb-6">Access your favorites, skills, and activity history.</p>
          <a href={getLoginUrl()}>
            <Button className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </a>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'favorites' as ProfileTab, label: 'Favorites', icon: <Bookmark className="w-4 h-4" />, count: favoriteSkills?.length || 0 },
    { id: 'skills' as ProfileTab, label: 'My Skills', icon: <Star className="w-4 h-4" /> },
    { id: 'activity' as ProfileTab, label: 'Activity', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Profile Header */}
        <div className="border-b border-border">
          <div className="container py-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-3xl">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl">{user?.name || 'User'}</h1>
                <p className="text-muted-foreground text-sm mt-1">{user?.email || ''}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" />{favoriteSkills?.length || 0} favorites</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Joined {new Date(user?.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="container">
            <div className="flex items-center gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
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
          </div>
        </div>

        {/* Content */}
        <div className="container py-6">
          {activeTab === 'favorites' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display font-semibold text-lg mb-4">Favorite Skills</h2>
              {favsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </div>
              ) : !favoriteSkills || favoriteSkills.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="mb-2">No favorites yet</p>
                  <p className="text-sm">Browse skills and click the bookmark icon to save them here.</p>
                  <Link href="/skills">
                    <Button variant="outline" className="mt-4">Browse Skills</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteSkills.map((skill: any) => {
                    const tags = typeof skill.tags === 'string' ? JSON.parse(skill.tags) : (skill.tags || []);
                    return (
                      <div key={skill.id} className="border border-border rounded-xl p-5 bg-card hover:border-primary/20 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <Link href={`/skills/${skill.author}/${skill.slug}`}>
                            <h3 className="font-display font-semibold text-sm group-hover:text-primary transition-colors cursor-pointer">
                              {skill.author}/{skill.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => removeFavMutation.mutate({ targetType: 'skill', targetId: skill.id })}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                            title="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{skill.description}</p>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getTypeBgColor(skill.type)}`}>
                            {skill.type}
                          </span>
                          {tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(skill.likes ?? 0)}</span>
                          <span className="flex items-center gap-1"><Download className="w-3 h-3" />{formatNumber(skill.downloads ?? 0)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center py-12 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="mb-2">No published skills yet</p>
                <p className="text-sm">Create and publish your first skill to see it here.</p>
                <Link href="/skills/new">
                  <Button variant="outline" className="mt-4">Create Skill</Button>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Activity history coming soon.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
