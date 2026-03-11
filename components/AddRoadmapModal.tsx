'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Check } from 'lucide-react'
import { useStore } from '@/lib/store'

const COLORS = [
  { id: 'violet', label: 'Violet', cls: 'bg-violet-500' },
  { id: 'amber', label: 'Amber', cls: 'bg-amber-500' },
  { id: 'emerald', label: 'Emerald', cls: 'bg-emerald-500' },
  { id: 'cyan', label: 'Cyan', cls: 'bg-cyan-500' },
  { id: 'rose', label: 'Rose', cls: 'bg-rose-500' },
  { id: 'blue', label: 'Blue', cls: 'bg-blue-500' },
]

const ICONS = [
  { id: 'Code2', label: '{ }' },
  { id: 'Target', label: '◎' },
  { id: 'BookOpen', label: '📖' },
  { id: 'Zap', label: '⚡' },
  { id: 'Layers', label: '▦' },
]

interface Props {
  onClose: () => void
}

export default function AddRoadmapModal({ onClose }: Props) {
  const { dispatch } = useStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('violet')
  const [icon, setIcon] = useState('Target')
  const [weeks, setWeeks] = useState(8)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  const handleSave = () => {
    if (!name.trim()) return
    const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2)}`
    dispatch({
      type: 'ADD_ROADMAP',
      payload: {
        id,
        name: name.trim(),
        description: description.trim(),
        type: 'custom',
        color,
        icon,
        totalWeeks: weeks,
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })
    onClose()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={handleKey}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl p-6 animate-slide-up"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Create Custom Roadmap
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-base">Roadmap Name *</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. React Interview Prep"
              className="input-base"
            />
          </div>

          <div>
            <label className="label-base">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this roadmap cover?"
              rows={2}
              className="textarea-base"
            />
          </div>

          <div>
            <label className="label-base">Duration (weeks)</label>
            <input
              type="number"
              value={weeks}
              onChange={e => setWeeks(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={52}
              className="input-base w-24"
            />
          </div>

          <div>
            <label className="label-base">Color Theme</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.cls} transition-all ${color === c.id ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="label-base">Icon</label>
            <div className="flex gap-2">
              {ICONS.map(ic => (
                <button
                  key={ic.id}
                  onClick={() => setIcon(ic.id)}
                  className={`w-9 h-9 rounded-lg border font-mono text-xs transition-all ${
                    icon === ic.id
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-400'
                      : 'border-current/20 hover:bg-white/5'
                  }`}
                  style={{ color: icon === ic.id ? undefined : 'var(--text-muted)' }}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="btn-primary flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Create Roadmap
          </button>
        </div>
      </div>
    </div>
  )
}
