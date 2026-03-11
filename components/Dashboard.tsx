'use client'

import React from 'react'
import Link from 'next/link'
import {
  Code2, Zap, Layers, BookOpen, Target, ChevronRight,
  TrendingUp, CheckCircle2, Clock, Circle, Award, Flame
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { calculateRoadmapProgress } from '@/lib/utils'
import { Roadmap } from '@/lib/types'

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2, Zap, Layers, BookOpen, Target,
}

const COLOR_GRADIENTS: Record<string, string> = {
  violet: 'from-violet-600/20 to-violet-800/5 border-violet-500/20',
  amber: 'from-amber-600/20 to-amber-800/5 border-amber-500/20',
  emerald: 'from-emerald-600/20 to-emerald-800/5 border-emerald-500/20',
  cyan: 'from-cyan-600/20 to-cyan-800/5 border-cyan-500/20',
  rose: 'from-rose-600/20 to-rose-800/5 border-rose-500/20',
  blue: 'from-blue-600/20 to-blue-800/5 border-blue-500/20',
}

const PROGRESS_COLORS: Record<string, string> = {
  violet: 'from-violet-500 to-violet-700',
  amber: 'from-amber-400 to-amber-600',
  emerald: 'from-emerald-400 to-emerald-600',
  cyan: 'from-cyan-400 to-cyan-600',
  rose: 'from-rose-400 to-rose-600',
  blue: 'from-blue-400 to-blue-600',
}

const ICON_COLORS: Record<string, string> = {
  violet: 'text-violet-400 bg-violet-500/10',
  amber: 'text-amber-400 bg-amber-500/10',
  emerald: 'text-emerald-400 bg-emerald-500/10',
  cyan: 'text-cyan-400 bg-cyan-500/10',
  rose: 'text-rose-400 bg-rose-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
}

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const progress = calculateRoadmapProgress(roadmap)
  const Icon = ICONS[roadmap.icon] || BookOpen
  const gradient = COLOR_GRADIENTS[roadmap.color] || COLOR_GRADIENTS.violet
  const progressColor = PROGRESS_COLORS[roadmap.color] || PROGRESS_GRADIENTS.violet
  const iconColor = ICON_COLORS[roadmap.color] || ICON_COLORS.violet

  return (
    <Link href={`/roadmaps/${roadmap.id}`}>
      <div className={`card bg-gradient-to-br ${gradient} hover:scale-[1.01] cursor-pointer p-5 group transition-all duration-200`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor} border border-current/10`}>
            <Icon size={20} />
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>
            <span>{roadmap.totalWeeks}w</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base mb-1 leading-tight group-hover:text-violet-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {roadmap.name}
        </h3>
        <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {roadmap.description}
        </p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Progress</span>
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
              {progress.percentage}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-700`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-base font-display font-bold text-emerald-400">{progress.completed}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Done</div>
          </div>
          <div className="text-center">
            <div className="text-base font-display font-bold text-amber-400">{progress.inProgress}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Active</div>
          </div>
          <div className="text-center">
            <div className="text-base font-display font-bold" style={{ color: 'var(--text-muted)' }}>{progress.notStarted}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Left</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{progress.total} topics total</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { state } = useStore()

  // Global stats
  const allStats = state.roadmaps.reduce(
    (acc, r) => {
      const p = calculateRoadmapProgress(r)
      acc.total += p.total
      acc.completed += p.completed
      acc.inProgress += p.inProgress
      return acc
    },
    { total: 0, completed: 0, inProgress: 0 }
  )
  const globalPct = allStats.total > 0 ? Math.round((allStats.completed / allStats.total) * 100) : 0

  const predefined = state.roadmaps.filter(r => r.type === 'predefined')
  const custom = state.roadmaps.filter(r => r.type === 'custom')

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={16} className="text-orange-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-orange-400">Keep going!</span>
        </div>
        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
          Your Prep Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Track your progress across DSA, LeetCode patterns, and System Design.
        </p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-violet-400" />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Overall</span>
          </div>
          <div className="font-display font-bold text-2xl text-gradient">{globalPct}%</div>
          <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
              style={{ width: `${globalPct}%` }}
            />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Completed</span>
          </div>
          <div className="font-display font-bold text-2xl text-emerald-400">{allStats.completed}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>topics done</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>In Progress</span>
          </div>
          <div className="font-display font-bold text-2xl text-amber-400">{allStats.inProgress}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>active now</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Circle size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Remaining</span>
          </div>
          <div className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
            {allStats.total - allStats.completed - allStats.inProgress}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>to go</div>
        </div>
      </div>

      {/* Predefined roadmaps */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Award size={18} className="text-violet-400" />
          Predefined Roadmaps
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {predefined.map(r => (
            <RoadmapCard key={r.id} roadmap={r} />
          ))}
        </div>
      </div>

      {/* Custom roadmaps */}
      {custom.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Target size={18} className="text-emerald-400" />
            Custom Roadmaps
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {custom.map(r => (
              <RoadmapCard key={r.id} roadmap={r} />
            ))}
          </div>
        </div>
      )}

      {/* Getting started hint */}
      {globalPct === 0 && (
        <div className="mt-8 card p-6 border-dashed text-center">
          <Target size={32} className="mx-auto mb-3 text-violet-400 opacity-60" />
          <h3 className="font-display font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
            Ready to start prepping?
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Click any roadmap above to begin tracking your progress. Mark topics as in-progress or completed as you study!
          </p>
          <Link href="/roadmaps/dsa-roadmap" className="btn-primary inline-flex items-center gap-2">
            Start with DSA <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}
