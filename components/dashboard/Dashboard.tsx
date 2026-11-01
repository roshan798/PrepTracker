'use client';
import Link from 'next/link';
import { useAppDispatch, useAppState } from '@/lib/store';
import RoadmapCard from './RoadmapCard';
import { getRoadmapStats } from '@/lib/utils';
import { sortRoadmaps } from '@/lib/roadmap-utils';
import { ArrowRight, Target, TrendingUp, Award, Flame } from 'lucide-react';

export default function Dashboard() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const roadmaps = sortRoadmaps(state.roadmaps);
  const pinnedRoadmaps = roadmaps.filter(roadmap => roadmap.isPinned === true);
  const unpinnedRoadmaps = roadmaps.filter(roadmap => roadmap.isPinned !== true);
  const allStats = roadmaps.map(r => ({ roadmap: r, stats: getRoadmapStats(r) }));
  const nextPath = allStats.find(item => item.stats.percentage < 100 && item.roadmap.topics.length > 0)
    ?? allStats.find(item => item.roadmap.topics.length > 0)
    ?? allStats[0];
  const nextTopic = nextPath?.roadmap.topics.find(topic => topic.status !== 'completed');

  const totalTopics = allStats.reduce((sum, s) => sum + s.stats.total, 0);
  const completedTopics = allStats.reduce((sum, s) => sum + s.stats.completed, 0);
  const inProgressTopics = allStats.reduce((sum, s) => sum + s.stats.inProgress, 0);
  const totalProblems = allStats.reduce((sum, s) => sum + s.stats.problemsTotal, 0);
  const completedProblems = allStats.reduce((sum, s) => sum + s.stats.problemsCompleted, 0);
  const overallPct = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  const statCards = [
    { label: 'Overall Progress', value: `${overallPct}%`, icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Topics Completed', value: `${completedTopics}/${totalTopics}`, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'In Progress', value: inProgressTopics, icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Problems Solved', value: `${completedProblems}/${totalProblems}`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  ];

  return (
    <div className="page-container p-5 md:p-8 max-w-7xl mx-auto">
      <div className="dashboard-hero mb-7 fade-in">
        <div className="dashboard-intro">
          <div className="page-kicker mb-4">Your preparation, in focus</div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <h1 className="page-title mb-3">Make your<br className="hidden lg:block" /> next move<span className="text-cyan-400">.</span></h1>
              <p className="page-description">
                Small steps, visible momentum. Pick up where you left off.
              </p>
            </div>
            <div className="dashboard-date-tag mono text-xs px-3 py-2 rounded-full border" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
              {roadmaps.length} learning paths
            </div>
          </div>
        </div>
        <section className="dashboard-focus" aria-label="Recommended next step">
          <div className="page-kicker mb-4">Your next step</div>
          {nextPath ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <span className="dashboard-focus-emoji">{nextPath.roadmap.emoji}</span>
                <div className="min-w-0">
                  <h2 className="dashboard-focus-title">{nextPath.roadmap.name}</h2>
                  <p className="dashboard-focus-caption">
                    {nextTopic
                      ? `Continue with ${nextTopic.name}`
                      : nextPath.stats.percentage === 100
                        ? 'This path is complete — revisit your progress'
                        : 'Add topics to start tracking this path'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Path progress</span>
                <span className="mono text-sm font-bold" style={{ color: 'var(--accent-cyan)' }}>{nextPath.stats.percentage}%</span>
              </div>
              <div className="dashboard-focus-track" role="progressbar" aria-label={`${nextPath.roadmap.name} progress`} aria-valuenow={nextPath.stats.percentage} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${nextPath.stats.percentage}%` }} />
              </div>
              <Link className="dashboard-focus-link" href={`/roadmaps/${nextPath.roadmap.id}`}>
                {nextTopic ? 'Continue learning' : nextPath.stats.percentage === 100 ? 'Review roadmap' : 'Set up roadmap'} <ArrowRight size={15} />
              </Link>
            </>
          ) : (
            <div>
              <h2 className="dashboard-focus-title mb-2">Start with one path</h2>
              <p className="dashboard-focus-caption">Choose a roadmap from the sidebar or create a custom path to begin.</p>
            </div>
          )}
        </section>
      </div>

      <div className="dashboard-stats grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <div key={label} className="dashboard-stat surface-card fade-in p-4 md:p-5"
            style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="flex items-center justify-between mb-5">
              <span className="page-kicker">{label}</span>
              <span className={`inline-flex p-2 rounded-xl border ${bg}`}>
                <Icon size={15} className={color} />
              </span>
            </div>
            <div className={`dashboard-stat-value text-3xl md:text-4xl font-bold mb-1 ${color}`}>{value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label === 'Overall Progress' ? 'across all paths' : label === 'Topics Completed' ? 'topics finished' : label === 'In Progress' ? 'topics underway' : 'practice completed'}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-section-heading mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="page-kicker mb-2">Choose your next step</div>
          <h2 className="section-title">Learning paths</h2>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold mono border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          {roadmaps.length} paths
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roadmaps.map((roadmap, i) => {
          const group = roadmap.isPinned ? pinnedRoadmaps : unpinnedRoadmaps;
          const groupIndex = group.findIndex(item => item.id === roadmap.id);
          return (
          <div key={roadmap.id} className="fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
            <RoadmapCard
              roadmap={roadmap}
              canMoveUp={groupIndex > 0}
              canMoveDown={groupIndex < group.length - 1}
              onTogglePin={() => dispatch({ type: 'TOGGLE_ROADMAP_PIN', payload: roadmap.id })}
              onMove={direction => dispatch({ type: 'MOVE_ROADMAP', payload: { id: roadmap.id, direction } })}
            />
          </div>
          );
        })}
      </div>
    </div>
  );
}
