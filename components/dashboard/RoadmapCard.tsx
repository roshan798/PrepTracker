'use client';
import Link from 'next/link';
import { Roadmap } from '@/lib/types';
import { getRoadmapStats } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';
import { ArrowRight, Clock, CheckCircle, Circle, Timer } from 'lucide-react';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const colorBorderMap: Record<string, string> = {
  cyan: 'border-cyan-500/20 hover:border-cyan-500/40',
  violet: 'border-violet-500/20 hover:border-violet-500/40',
  rose: 'border-rose-500/20 hover:border-rose-500/40',
  emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
  amber: 'border-amber-500/20 hover:border-amber-500/40',
};

const colorBgAccent: Record<string, string> = {
  cyan: 'bg-cyan-500/8',
  violet: 'bg-violet-500/8',
  rose: 'bg-rose-500/8',
  emerald: 'bg-emerald-500/8',
  amber: 'bg-amber-500/8',
};

const colorText: Record<string, string> = {
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const stats = getRoadmapStats(roadmap);
  const borderCls = colorBorderMap[roadmap.color] || colorBorderMap.cyan;
  const bgCls = colorBgAccent[roadmap.color] || colorBgAccent.cyan;
  const textCls = colorText[roadmap.color] || colorText.cyan;

  const isComplete = stats.percentage === 100;

  return (
    <Link href={`/roadmaps/${roadmap.id}`}
      className={`group block rounded-2xl border p-5 card-hover transition-all duration-200 ${borderCls} ${isComplete ? 'ring-1 ring-emerald-500/20' : ''}`}
      style={{ backgroundColor: 'var(--bg-secondary)' }}>

      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl border text-2xl ${bgCls} ${borderCls}`}>
          {roadmap.emoji}
        </div>
        <div className="flex flex-col items-end gap-1">
          {roadmap.duration && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
              <Clock size={10} />
              {roadmap.duration}
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle size={10} />
              Complete!
            </span>
          )}
        </div>
      </div>

      <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
        {roadmap.name}
      </h3>
      <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
        {roadmap.description}
      </p>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span className={`text-sm font-bold mono ${textCls}`}>{stats.percentage}%</span>
        </div>
        <ProgressBar percentage={stats.percentage} color={roadmap.color} height="h-2" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle size={11} /> {stats.completed}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Timer size={11} /> {stats.inProgress}
          </span>
          <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <Circle size={11} /> {stats.notStarted}
          </span>
        </div>
        <ArrowRight size={14} className={`transition-transform group-hover:translate-x-1 ${textCls}`} />
      </div>

      {stats.problemsTotal > 0 && (
        <div className="mt-3 pt-3 border-t text-xs mono" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          {stats.problemsCompleted}/{stats.problemsTotal} problems solved
        </div>
      )}
    </Link>
  );
}
