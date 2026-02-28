/**
 * Organizations Page - Browse organizations on SkillsHub
 */
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Search, Users, Building2, Zap, Star } from 'lucide-react';
import { formatNumber } from '@/lib/data';

interface Organization {
  id: string;
  name: string;
  handle: string;
  description: string;
  type: 'Enterprise' | 'Research' | 'Team' | 'Community' | 'Startup';
  skills: number;
  members: number;
  followers: number;
  verified: boolean;
  avatar: string;
}

const orgs: Organization[] = [
  { id: '1', name: 'SkillsAI', handle: 'skillsai', description: 'Building the next generation of AI-powered development tools', type: 'Enterprise', skills: 342, members: 48, followers: 12400, verified: true, avatar: 'S' },
  { id: '2', name: 'FlowCraft', handle: 'flowcraft', description: 'Visual workflow automation and data pipeline tools', type: 'Team', skills: 156, members: 23, followers: 8900, verified: true, avatar: 'F' },
  { id: '3', name: 'AutomateIO', handle: 'automate-io', description: 'Enterprise RPA and process automation solutions', type: 'Enterprise', skills: 89, members: 35, followers: 5600, verified: true, avatar: 'A' },
  { id: '4', name: 'NLP Lab', handle: 'nlplab', description: 'Academic research group focused on NLP and language understanding', type: 'Research', skills: 234, members: 15, followers: 15200, verified: true, avatar: 'N' },
  { id: '5', name: 'DevOps AI', handle: 'devopsai', description: 'AI-powered DevOps tools and infrastructure automation', type: 'Startup', skills: 67, members: 12, followers: 4300, verified: false, avatar: 'D' },
  { id: '6', name: 'SecLab', handle: 'seclab', description: 'Security research and automated vulnerability detection', type: 'Research', skills: 45, members: 8, followers: 3100, verified: true, avatar: 'S' },
  { id: '7', name: 'DocSmith', handle: 'docsmith', description: 'Automated documentation generation and management', type: 'Team', skills: 78, members: 18, followers: 6700, verified: false, avatar: 'D' },
  { id: '8', name: 'CodeForge', handle: 'codeforge', description: 'Open source code generation and analysis tools', type: 'Enterprise', skills: 198, members: 56, followers: 11800, verified: true, avatar: 'C' },
  { id: '9', name: 'AgentVerse', handle: 'agentverse', description: 'Multi-agent systems and autonomous AI research', type: 'Research', skills: 123, members: 20, followers: 9200, verified: true, avatar: 'A' },
  { id: '10', name: 'DataLab', handle: 'datalab', description: 'Data science tools and context dataset curation', type: 'Community', skills: 56, members: 145, followers: 7800, verified: false, avatar: 'D' },
  { id: '11', name: 'TestForge', handle: 'testforge', description: 'Automated testing and quality assurance tools', type: 'Startup', skills: 34, members: 9, followers: 2800, verified: false, avatar: 'T' },
  { id: '12', name: 'Polyglot AI', handle: 'polyglot', description: 'Multilingual AI translation and localization', type: 'Enterprise', skills: 87, members: 31, followers: 6200, verified: true, avatar: 'P' },
];

const orgTypes = ['All', 'Enterprise', 'Research', 'Team', 'Community', 'Startup'];

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filtered = orgs.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'All' || o.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-7 h-7 text-primary" />
            <h1 className="font-display font-bold text-3xl">Organizations</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover teams, companies, and research groups building on SkillsHub.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search organizations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex flex-wrap gap-2">
            {orgTypes.map(t => (
              <button key={t} onClick={() => setSelectedType(t)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${selectedType === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((org, i) => (
            <motion.div key={org.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link href={`/organizations/${org.handle}`}>
                <div className="group p-5 border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-card">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
                      {org.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-sm group-hover:text-primary transition-colors truncate">{org.name}</h3>
                        {org.verified && <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{org.type}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{org.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{org.skills} skills</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{org.members} members</span>
                    <span>{formatNumber(org.followers)} followers</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
