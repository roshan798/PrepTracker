'use client'

import React, { useState, useRef } from 'react'
import {
  ChevronDown, ChevronRight, CheckCircle2, Clock, Circle,
  StickyNote, Plus, Trash2, Edit2
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { Topic, Status } from '@/lib/types'
import { calculateRoadmapProgress, getStatusBg } from '@/lib/utils'
import SubtopicItem from './SubtopicItem'
import AddItemModal from './AddItemModal'

interface Props {
  roadmapId: string
  topic: Topic
  isCustomRoadmap?: boolean
  onEditTopic?: () => void
  onDeleteTopic?: () => void
}

const STATUS_ICONS: Record<Status, React.ReactNode> = {
  'completed': <CheckCircle2 size={16} className="text-emerald-400" />,
  'in-progress': <Clock size={16} className="text-amber-400" />,
  'not-started': <Circle size={16} className="text-slate-500" />,
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'not-started', label: '○ Not Started' },
  { value: 'in-progress', label: '◑ In Progress' },
  { value: 'completed', label: '● Completed' },
]

export default function TopicItem({
  roadmapId, topic, isCustomRoadmap, onEditTopic, onDeleteTopic
}: Props) {
  const { dispatch } = useStore()
  const [showNotes, setShowNotes] = useState(false)
  const [localNotes, setLocalNotes] = useState(topic.notes)
  const [showAddSubtopic, setShowAddSubtopic] = useState(false)
  const [editingSubtopic, setEditingSubtopic] = useState<string | null>(null)
  const notesTimer = useRef<ReturnType<typeof setTimeout>>()

  // Subtopic completion stats
  const total = topic.subtopics.length
  const completed = topic.subtopics.filter(s => s.status === 'completed').length
  const inProgress = topic.subtopics.filter(s => s.status === 'in-progress').length

  const updateStatus = (status: Status) => {
    dispatch({ type: 'UPDATE_TOPIC_STATUS', roadmapId, topicId: topic.id, status })
  }

  const updateNotes = (val: string) => {
    setLocalNotes(val)
    clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      dispatch({ type: 'UPDATE_TOPIC_NOTES', roadmapId, topicId: topic.id, notes: val })
    }, 600)
  }

  const toggle = () => {
    dispatch({ type: 'TOGGLE_TOPIC', roadmapId, topicId: topic.id })
  }

  const deleteSubtopic = (subtopicId: string) => {
    if (confirm('Delete this subtopic?')) {
      dispatch({ type: 'DELETE_SUBTOPIC', roadmapId, topicId: topic.id, subtopicId })
    }
  }

  const statusColor = topic.status === 'completed'
    ? 'border-emerald-500/30'
    : topic.status === 'in-progress'
    ? 'border-amber-400/30'
    : 'border-transparent'

  return (
    <>
      <div className={`card border-l-[3px] mb-3 overflow-hidden transition-all duration-200 ${statusColor}`}>
        {/* Topic header */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Expand toggle */}
            <button
              onClick={toggle}
              className="mt-0.5 flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors"
            >
              {topic.expanded
                ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
            </button>

            {/* Status icon */}
            <div className="mt-0.5 flex-shrink-0">
              {STATUS_ICONS[topic.status]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3
                  className={`font-display font-semibold text-sm leading-tight ${topic.status === 'completed' ? 'line-through opacity-60' : ''}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {topic.week && (
                    <span className="font-mono text-xs opacity-50 mr-1.5">W{topic.week}</span>
                  )}
                  {topic.name}
                </h3>
              </div>
              {topic.description && (
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                  {topic.description}
                </p>
              )}

              {/* Subtopic progress pills */}
              {total > 0 && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 rounded-full overflow-hidden max-w-[120px]" style={{ backgroundColor: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.round((completed / total) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {completed}/{total}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-1.5 rounded transition-colors ${localNotes ? 'text-amber-400' : ''} hover:bg-white/10`}
                style={{ color: localNotes ? undefined : 'var(--text-muted)' }}
                title="Notes"
              >
                <StickyNote size={14} />
              </button>

              <select
                value={topic.status}
                onChange={e => updateStatus(e.target.value as Status)}
                className="text-xs py-1 px-2 rounded border outline-none cursor-pointer"
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

              {isCustomRoadmap && (
                <>
                  {onEditTopic && (
                    <button
                      onClick={onEditTopic}
                      className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    >
                      <Edit2 size={13} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  )}
                  {onDeleteTopic && (
                    <button
                      onClick={onDeleteTopic}
                      className="p-1.5 rounded hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Notes area */}
          {showNotes && (
            <div className="mt-3 animate-slide-up">
              <textarea
                value={localNotes}
                onChange={e => updateNotes(e.target.value)}
                placeholder="Write your notes, key concepts, links, code snippets..."
                rows={4}
                className="textarea-base text-sm"
              />
            </div>
          )}
        </div>

        {/* Subtopics */}
        {topic.expanded && (
          <div
            className="border-t px-4 pt-3 pb-4 animate-slide-up"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
          >
            {topic.subtopics.map(sub => (
              <SubtopicItem
                key={sub.id}
                roadmapId={roadmapId}
                topicId={topic.id}
                subtopic={sub}
                isCustomRoadmap={isCustomRoadmap}
                onDelete={() => deleteSubtopic(sub.id)}
                onEdit={() => setEditingSubtopic(sub.id)}
              />
            ))}

            {isCustomRoadmap && (
              <button
                onClick={() => setShowAddSubtopic(true)}
                className="flex items-center gap-1.5 mt-2 ml-4 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Plus size={12} /> Add Subtopic
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddSubtopic && (
        <AddItemModal
          title="Add Subtopic"
          onClose={() => setShowAddSubtopic(false)}
          onSave={(name, description) => {
            dispatch({
              type: 'ADD_SUBTOPIC',
              roadmapId,
              topicId: topic.id,
              subtopic: {
                id: Math.random().toString(36).substring(2),
                name,
                description,
                status: 'not-started',
                notes: '',
                problems: [],
                expanded: false,
              }
            })
          }}
        />
      )}

      {editingSubtopic && (
        <AddItemModal
          title="Edit Subtopic"
          initialName={topic.subtopics.find(s => s.id === editingSubtopic)?.name || ''}
          initialDesc={topic.subtopics.find(s => s.id === editingSubtopic)?.description || ''}
          onClose={() => setEditingSubtopic(null)}
          onSave={(name, description) => {
            dispatch({
              type: 'UPDATE_SUBTOPIC',
              roadmapId,
              topicId: topic.id,
              subtopicId: editingSubtopic,
              name,
              description,
            })
          }}
        />
      )}
    </>
  )
}
