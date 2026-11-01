'use client';
import Link from 'next/link';
import { Roadmap } from '@/lib/types';
import { getRoadmapStats } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, Pin, Timer } from 'lucide-react';

interface RoadmapCardProps {
  roadmap: Roadmap;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onTogglePin: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

const colorText: Record<string, string> = {
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

const colorBorder: Record<string, string> = {
  cyan: 'rgba(6,182,212,0.65)',
  violet: 'rgba(139,92,246,0.65)',
  rose: 'rgba(244,63,94,0.65)',
  emerald: 'rgba(16,185,129,0.65)',
  amber: 'rgba(245,158,11,0.65)',
};

export default function RoadmapCard({ roadmap, canMoveUp, canMoveDown, onTogglePin, onMove }: RoadmapCardProps) {
  const stats = getRoadmapStats(roadmap);
  const textCls = colorText[roadmap.color] || colorText.cyan;
  const isComplete = stats.percentage === 100;

  return (
    <article className={`roadmap-card-shell group rounded-2xl border card-hover ${isComplete ? 'is-complete' : ''}`}
      style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <Link href={`/roadmaps/${roadmap.id}`} className="roadmap-card-link block p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="roadmap-card-emoji" aria-hidden="true">{roadmap.emoji}</span>
            <div className="min-w-0">
              <span className="page-kicker block mb-1">{roadmap.type === 'predefined' ? 'Learning path' : 'Custom path'}</span>
              <h3 className="roadmap-card-title truncate">{roadmap.name}</h3>
            </div>
          </div>
          <div
            className="roadmap-progress-ring shrink-0"
            role="img"
            aria-label={`${stats.percentage}% complete`}
            style={{
              background: `conic-gradient(${colorBorder[roadmap.color] || colorBorder.cyan} ${stats.percentage}%, var(--bg-tertiary) ${stats.percentage}% 100%)`,
            }}
          >
            <span>{stats.percentage}%</span>
          </div>
        </div>

        <p className="roadmap-card-description line-clamp-2 mb-5" style={{ color: 'var(--text-secondary)' }}>
          {roadmap.description || 'A structured path to build your skills and track your progress.'}
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Progress</span>
            {roadmap.duration && <span className="text-xs mono" style={{ color: 'var(--text-secondary)' }}>{roadmap.duration}</span>}
          </div>
          <ProgressBar percentage={stats.percentage} color={roadmap.color} height="h-2" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mono">
            <span className={`flex items-center gap-1 ${textCls}`}>
              <CheckCircle size={12} /> {stats.completed}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Timer size={12} /> {stats.inProgress}
            </span>
            <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Circle size={12} /> {stats.notStarted}
            </span>
          </div>
          <ArrowRight size={16} className={`roadmap-card-arrow shrink-0 ${textCls}`} />
        </div>

        {stats.problemsTotal > 0 && (
          <div className="roadmap-card-problems mt-4 pt-3 border-t text-xs mono" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            {stats.problemsCompleted} of {stats.problemsTotal} practice problems solved
          </div>
        )}
      </Link>

      <div className="roadmap-card-actions flex items-center justify-between gap-2 px-4 py-2.5 border-t"
        style={{ borderColor: 'var(--border)' }}>
        <button
          type="button"
          onClick={onTogglePin}
          aria-label={roadmap.isPinned ? `Unpin ${roadmap.name}` : `Pin ${roadmap.name}`}
          title={roadmap.isPinned ? 'Unpin roadmap' : 'Pin roadmap'}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${roadmap.isPinned ? 'text-violet-400' : ''}`}
          style={{ color: roadmap.isPinned ? undefined : 'var(--text-secondary)' }}>
          <Pin size={13} />
          {roadmap.isPinned ? 'Pinned' : 'Pin'}
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={!canMoveUp}
            aria-label={`Move ${roadmap.name} up`}
            title="Move up"
            className="roadmap-order-button p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={!canMoveDown}
            aria-label={`Move ${roadmap.name} down`}
            title="Move down"
            className="roadmap-order-button p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
