'use client';
import { useAppState } from '@/lib/store';
import RoadmapCard from './RoadmapCard';
import { getRoadmapStats } from '@/lib/utils';
import { Target, TrendingUp, Award, Flame } from 'lucide-react';

export default function Dashboard() {
  const state = useAppState();
  const allStats = state.roadmaps.map(r => ({ roadmap: r, stats: getRoadmapStats(r) }));

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
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
          Dashboard 🚀
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Track your job switch preparation across all roadmaps.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <div key={label} className={`fade-in rounded-2xl border p-4`}
            style={{ animationDelay: `${i * 0.07}s`, backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className={`inline-flex p-2 rounded-xl border mb-3 ${bg}`}>
              <Icon size={16} className={color} />
            </div>
            <div className={`text-2xl font-bold mono mb-1 ${color}`}>{value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
          All Roadmaps
        </h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium mono border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
          {state.roadmaps.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.roadmaps.map((roadmap, i) => (
          <div key={roadmap.id} className="fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
            <RoadmapCard roadmap={roadmap} />
          </div>
        ))}
      </div>
    </div>
  );
}
