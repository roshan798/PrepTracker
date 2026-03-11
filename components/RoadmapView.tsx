'use client'

import React, { useEffect, useRef } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Code2, Zap, Layers, BookOpen, Target,
  CheckCircle2, Clock, Circle, TrendingUp, Plus, Edit2,
  ChevronDown, ChevronsDown, ChevronsUp, Trophy
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { calculateRoadmapProgress } from '@/lib/utils'
import TopicItem from './TopicItem'
import AddItemModal from './AddItemModal'

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2, Zap, Layers, BookOpen, Target,
}

const PROGRESS_COLORS: Record<string, string> = {
  violet: 'from-violet-500 to-violet-700',
  amber: 'from-amber-400 to-amber-600',
  emerald: 'from-emerald-400 to-emerald-600',
  cyan: 'from-cyan-400 to-cyan-600',
  rose: 'from-rose-400 to-rose-600',
  blue: 'from-blue-400 to-blue-600',
}

const HEADER_GRADIENTS: Record<string, string> = {
  violet: 'from-violet-900/30 via-transparent',
  amber: 'from-amber-900/30 via-transparent',
  emerald: 'from-emerald-900/30 via-transparent',
  cyan: 'from-cyan-900/30 via-transparent',
  rose: 'from-rose-900/30 via-transparent',
  blue: 'from-blue-900/30 via-transparent',
}

interface Props {
  roadmapId: string
}

export default function RoadmapView({ roadmapId }: Props) {
  const { state, dispatch } = useStore()
  const [showAddTopic, setShowAddTopic] = React.useState(false)
  const [editingTopicId, setEditingTopicId] = React.useState<string | null>(null)
  const didFireConfetti = useRef(false)

  const roadmap = state.roadmaps.find(r => r.id === roadmapId)
  if (!roadmap) return null

  const progress = calculateRoadmapProgress(roadmap)
  const Icon = ICONS[roadmap.icon] || BookOpen
  const isCustom = roadmap.type === 'custom'
  const progressColor = PROGRESS_COLORS[roadmap.color] || PROGRESS_COLORS.violet
  const headerGrad = HEADER_GRADIENTS[roadmap.color] || HEADER_GRADIENTS.violet

  // Confetti on 100%
  useEffect(() => {
    if (progress.percentage === 100 && !didFireConfetti.current) {
      didFireConfetti.current = true
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } })
      })
    }
    if (progress.percentage < 100) {
      didFireConfetti.current = false
    }
  }, [progress.percentage])

  const expandAll = () => {
    roadmap.topics.forEach(t => {
      if (!t.expanded) dispatch({ type: 'TOGGLE_TOPIC', roadmapId, topicId: t.id })
    })
  }

  const collapseAll = () => {
    roadmap.topics.forEach(t => {
      if (t.expanded) dispatch({ type: 'TOGGLE_TOPIC', roadmapId, topicId: t.id })
    })
  }

  const handleDeleteTopic = (topicId: string) => {
    if (confirm('Delete this topic and all its subtopics?')) {
      dispatch({ type: 'DELETE_TOPIC', roadmapId, topicId })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className={`card bg-gradient-to-b ${headerGrad} to-transparent p-6 mb-6`}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs mb-4 hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={13} /> Dashboard
        </Link>

        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-${roadmap.color}-500/10 border border-${roadmap.color}-500/20`}>
            <Icon size={24} className={`text-${roadmap.color}-400`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                {roadmap.name}
              </h1>
              {progress.percentage === 100 && (
                <span className="flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                  <Trophy size={10} /> Complete!
                </span>
              )}
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {roadmap.description}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={13} /> {progress.completed} done
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock size={13} /> {progress.inProgress} active
              </span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <Circle size={13} /> {progress.notStarted} left
              </span>
            </div>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              {progress.percentage}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-700`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {roadmap.topics.length} topics · {roadmap.totalWeeks} weeks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={expandAll} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <ChevronsDown size={13} /> Expand All
          </button>
          <button onClick={collapseAll} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <ChevronsUp size={13} /> Collapse
          </button>
          {isCustom && (
            <button
              onClick={() => setShowAddTopic(true)}
              className="btn-primary flex items-center gap-1.5 text-xs py-1.5"
            >
              <Plus size={13} /> Add Topic
            </button>
          )}
        </div>
      </div>

      {/* Topics */}
      <div>
        {roadmap.topics.length === 0 ? (
          <div className="card p-8 text-center border-dashed">
            <Target size={28} className="mx-auto mb-3 text-violet-400 opacity-40" />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No topics yet. Add your first topic to start tracking!
            </p>
          </div>
        ) : (
          roadmap.topics.map(topic => (
            <TopicItem
              key={topic.id}
              roadmapId={roadmapId}
              topic={topic}
              isCustomRoadmap={isCustom}
              onEditTopic={() => setEditingTopicId(topic.id)}
              onDeleteTopic={() => handleDeleteTopic(topic.id)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showAddTopic && (
        <AddItemModal
          title="Add Topic"
          onClose={() => setShowAddTopic(false)}
          onSave={(name, description) => {
            dispatch({
              type: 'ADD_TOPIC',
              roadmapId,
              topic: {
                id: Math.random().toString(36).substring(2),
                name,
                description,
                status: 'not-started',
                notes: '',
                subtopics: [],
                expanded: false,
              }
            })
          }}
        />
      )}

      {editingTopicId && (
        <AddItemModal
          title="Edit Topic"
          initialName={roadmap.topics.find(t => t.id === editingTopicId)?.name || ''}
          initialDesc={roadmap.topics.find(t => t.id === editingTopicId)?.description || ''}
          onClose={() => setEditingTopicId(null)}
          onSave={(name, description) => {
            dispatch({ type: 'UPDATE_TOPIC', roadmapId, topicId: editingTopicId, name, description })
          }}
        />
      )}
    </div>
  )
}
