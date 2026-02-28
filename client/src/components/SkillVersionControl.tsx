/**
 * Skill Version Control Component
 * Displays commit history, allows version comparison and rollback
 */
import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  GitCommit, Clock, User, Plus, Minus, RotateCcw,
  ChevronDown, ChevronRight, Loader2, FileText, AlertTriangle,
  ArrowLeftRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SkillVersionControlProps {
  skillId: number;
  skillAuthor: string;
}

export default function SkillVersionControl({ skillId, skillAuthor }: SkillVersionControlProps) {
  const { user } = useAuth();
  const isOwner = user?.name === skillAuthor;
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [showRollbackDialog, setShowRollbackDialog] = useState(false);
  const [rollbackHash, setRollbackHash] = useState('');
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null);

  const { data: commits, isLoading, refetch } = trpc.skills.commits.useQuery({ skillId });

  const { data: commitDetail, isLoading: detailLoading } = trpc.skills.commitDetail.useQuery(
    { skillId, hash: expandedCommit || '' },
    { enabled: !!expandedCommit }
  );

  const rollbackMutation = trpc.skills.rollback.useMutation({
    onSuccess: () => {
      toast.success('Successfully rolled back to selected version');
      setShowRollbackDialog(false);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleCommitSelect = (hash: string) => {
    if (!compareMode) return;
    setSelectedCommits(prev => {
      if (prev.includes(hash)) return prev.filter(h => h !== hash);
      if (prev.length >= 2) return [prev[1], hash];
      return [...prev, hash];
    });
  };

  // Compare two commits
  const compareData = useMemo(() => {
    if (selectedCommits.length !== 2 || !commits) return null;
    const [older, newer] = selectedCommits
      .map(h => (commits as any[]).find((c: any) => c.hash === h))
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return { older, newer };
  }, [selectedCommits, commits]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading version history...</p>
      </div>
    );
  }

  const commitList = (commits as any[]) || [];

  if (commitList.length === 0) {
    return (
      <div className="text-center py-12">
        <GitCommit className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="font-display font-semibold text-lg mb-1">No version history</h3>
        <p className="text-sm text-muted-foreground">Changes will appear here when commits are made.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-sm">
            {commitList.length} Commit{commitList.length !== 1 ? 's' : ''}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              setCompareMode(!compareMode);
              setSelectedCommits([]);
            }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {compareMode ? 'Exit Compare' : 'Compare'}
          </Button>
        </div>
      </div>

      {/* Compare Info */}
      {compareMode && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary">
          <ArrowLeftRight className="w-3.5 h-3.5 inline mr-1.5" />
          Select 2 commits to compare. {selectedCommits.length}/2 selected.
          {compareData && (
            <div className="mt-2 p-2 bg-background rounded border border-border">
              <p className="font-medium text-foreground mb-1">Comparison</p>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Older</span>
                  <p className="font-mono text-[11px]">{compareData.older?.hash}</p>
                  <p className="text-[10px]">{compareData.older?.message}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Newer</span>
                  <p className="font-mono text-[11px]">{compareData.newer?.hash}</p>
                  <p className="text-[10px]">{compareData.newer?.message}</p>
                </div>
              </div>
              <div className="mt-2 flex gap-3 text-[10px]">
                <span className="text-green-500 flex items-center gap-0.5">
                  <Plus className="w-3 h-3" /> +{(compareData.newer?.additions || 0) - (compareData.older?.additions || 0)} additions
                </span>
                <span className="text-red-500 flex items-center gap-0.5">
                  <Minus className="w-3 h-3" /> -{(compareData.newer?.deletions || 0) - (compareData.older?.deletions || 0)} deletions
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Commit Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {commitList.map((commit: any, idx: number) => {
            const isExpanded = expandedCommit === commit.hash;
            const isSelected = selectedCommits.includes(commit.hash);

            return (
              <motion.div
                key={commit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="relative"
              >
                <div
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                    isSelected ? 'bg-primary/5 border border-primary/20' : ''
                  } ${isExpanded ? 'bg-muted/30' : ''}`}
                  onClick={() => {
                    if (compareMode) {
                      toggleCommitSelect(commit.hash);
                    } else {
                      setExpandedCommit(isExpanded ? null : commit.hash);
                    }
                  }}
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-[10px] h-[10px] rounded-full mt-1.5 shrink-0 ${
                    idx === 0 ? 'bg-primary' : isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
                  } ring-2 ring-background`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[11px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {commit.hash}
                      </span>
                      {idx === 0 && (
                        <span className="text-[9px] uppercase tracking-wider text-teal bg-teal/10 px-1.5 py-0.5 rounded font-medium">
                          Latest
                        </span>
                      )}
                      {compareMode && isSelected && (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{commit.message}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {commit.authorName || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(commit.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                      {(commit.additions > 0 || commit.deletions > 0) && (
                        <>
                          <span className="text-green-500 flex items-center gap-0.5">
                            <Plus className="w-3 h-3" /> {commit.additions || 0}
                          </span>
                          <span className="text-red-500 flex items-center gap-0.5">
                            <Minus className="w-3 h-3" /> {commit.deletions || 0}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isOwner && idx > 0 && !compareMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRollbackHash(commit.hash);
                          setShowRollbackDialog(true);
                        }}
                      >
                        <RotateCcw className="w-3 h-3" /> Rollback
                      </Button>
                    )}
                    {!compareMode && (
                      isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-[31px] pl-3 pb-3 border-l border-dashed border-border">
                        {detailLoading ? (
                          <div className="py-4 text-center">
                            <Loader2 className="w-4 h-4 animate-spin mx-auto text-primary" />
                          </div>
                        ) : commitDetail ? (
                          <div className="space-y-2">
                            {(commitDetail as any).snapshot ? (
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Snapshot Files</p>
                                {(() => {
                                  try {
                                    const snap = JSON.parse((commitDetail as any).snapshot);
                                    return (
                                      <div className="space-y-1">
                                        {snap.files?.map((f: any, i: number) => (
                                          <div key={i} className="flex items-center gap-2 text-xs">
                                            <FileText className="w-3 h-3 text-muted-foreground" />
                                            <span className="font-mono text-[11px]">{f.path}</span>
                                            <span className="text-muted-foreground text-[10px]">({f.size || 0} bytes)</span>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  } catch {
                                    return <p className="text-xs text-muted-foreground">Snapshot data available</p>;
                                  }
                                })()}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">No snapshot data for this commit</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No details available</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rollback Confirmation Dialog */}
      <Dialog open={showRollbackDialog} onOpenChange={setShowRollbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Rollback to Version
            </DialogTitle>
            <DialogDescription>
              This will restore the skill files and README to the state at commit <code className="font-mono text-primary">{rollbackHash}</code>.
              Current changes will be overwritten. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRollbackDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => rollbackMutation.mutate({ skillId, commitHash: rollbackHash })}
              disabled={rollbackMutation.isPending}
              className="gap-1.5"
            >
              {rollbackMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              Confirm Rollback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
