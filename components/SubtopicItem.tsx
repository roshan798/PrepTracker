'use client'

import React, { useState, useRef } from 'react'
import {
  ChevronDown, ChevronRight, ExternalLink, CheckCircle2,
  Clock, Circle, StickyNote, Code, Trash2, Edit2, X, Check
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Subtopic, Status } from '@/lib/types'
import { getStatusBg, getDifficultyBg } from '@/lib/utils'

interface Props {
  roadmapId: string
  topicId: string
  subtopic: Subtopic
  onDelete?: () => void
  onEdit?: () => void
  isCustomRoadmap?: boolean
}

const STATUS_ICONS: Record<Status, React.ReactNode> = {
  'completed': <CheckCircle2 size={14} className="text-emerald-400" />,
  'in-progress': <Clock size={14} className="text-amber-400" />,
  'not-started': <Circle size={14} className="text-slate-500" />,
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'not-started', label: '○ Not Started' },
  { value: 'in-progress', label: '◑ In Progress' },
  { value: 'completed', label: '● Completed' },
]

export default function SubtopicItem({
  roadmapId, topicId, subtopic, onDelete, onEdit, isCustomRoadmap
}: Props) {
  const { dispatch } = useStore()
  const [showNotes, setShowNotes] = useState(false)
  const [localNotes, setLocalNotes] = useState(subtopic.notes)
  const notesTimer = useRef<ReturnType<typeof setTimeout>>()

  const updateStatus = (status: Status) => {
    dispatch({ type: 'UPDATE_SUBTOPIC_STATUS', roadmapId, topicId, subtopicId: subtopic.id, status })
  }

  const updateNotes = (val: string) => {
    setLocalNotes(val)
    clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      dispatch({ type: 'UPDATE_SUBTOPIC_NOTES', roadmapId, topicId, subtopicId: subtopic.id, notes: val })
    }, 600)
  }

  const toggle = () => {
    dispatch({ type: 'TOGGLE_SUBTOPIC', roadmapId, topicId, subtopicId: subtopic.id })
  }

  const easy = subtopic.problems.filter(p => p.difficulty === 'easy').length
  const medium = subtopic.problems.filter(p => p.difficulty === 'medium').length
  const hard = subtopic.problems.filter(p => p.difficulty === 'hard').length

  return (
    <div className={`ml-4 border-l-2 transition-colors ${subtopic.status === 'completed' ? 'border-emerald-500/40' : subtopic.status === 'in-progress' ? 'border-amber-400/40' : 'border-slate-700/50'}`}>
      <div className="ml-3">
        {/* Subtopic header */}
        <div className="flex items-center gap-2 py-2 group">
          {/* Status icon */}
          <div className="flex-shrink-0">
            {STATUS_ICONS[subtopic.status]}
          </div>

          {/* Toggle + name */}
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
          >
            {subtopic.problems.length > 0 ? (
              subtopic.expanded
                ? <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
                : <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
            ) : <span className="w-3" />}
            <span
              className={`text-sm font-medium truncate transition-all ${subtopic.status === 'completed' ? 'line-through opacity-60' : ''}`}
              style={{ color: 'var(--text-primary)' }}
            >
              {subtopic.name}
            </span>
          </button>

          {/* Problem count chips */}
          {subtopic.problems.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
              {easy > 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-green-400/10 text-green-400 font-mono">{easy}E</span>}
              {medium > 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-mono">{medium}M</span>}
              {hard > 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-red-400/10 text-red-400 font-mono">{hard}H</span>}
            </div>
          )}

          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex-shrink-0 p-1 rounded transition-colors ${localNotes ? 'text-amber-400' : ''}`}
            style={{ color: localNotes ? undefined : 'var(--text-muted)' }}
            title="Toggle notes"
          >
            <StickyNote size={12} />
          </button>

          {/* Status selector */}
          <select
            value={subtopic.status}
            onChange={e => updateStatus(e.target.value as Status)}
            className="flex-shrink-0 text-xs py-0.5 px-1.5 rounded border outline-none cursor-pointer transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Edit/Delete for custom */}
          {isCustomRoadmap && (
            <div className="hidden group-hover:flex items-center gap-1">
              {onEdit && (
                <button onClick={onEdit} className="p-1 rounded hover:bg-white/10 transition-colors">
                  <Edit2 size={11} style={{ color: 'var(--text-muted)' }} />
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete} className="p-1 rounded hover:bg-red-400/10 transition-colors">
                  <Trash2 size={11} className="text-red-400" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notes editor */}
        {showNotes && (
          <div className="mb-2 animate-slide-up">
            <textarea
              value={localNotes}
              onChange={e => updateNotes(e.target.value)}
              placeholder="Add notes, links, key insights..."
              rows={3}
              className="textarea-base text-xs"
            />
          </div>
        )}

        {/* Problems list */}
        {subtopic.expanded && subtopic.problems.length > 0 && (
          <div className="mb-3 space-y-1 animate-slide-up">
            {subtopic.problems.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 group"
              >
                {p.number && (
                  <span className="text-xs font-mono w-8 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    #{p.number}
                  </span>
                )}
                <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {p.title}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${getDifficultyBg(p.difficulty)}`}>
                  {p.difficulty}
                </span>
                {p.number && (
                  <a
                    href={`https://leetcode.com/problems/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink size={11} className="text-blue-400" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
