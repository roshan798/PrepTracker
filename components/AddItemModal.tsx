'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Check } from 'lucide-react'

interface Props {
  title: string
  initialName?: string
  initialDesc?: string
  onClose: () => void
  onSave: (name: string, description: string) => void
}

export default function AddItemModal({ title, initialName = '', initialDesc = '', onClose, onSave }: Props) {
  const [name, setName] = useState(initialName)
  const [desc, setDesc] = useState(initialDesc)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), desc.trim())
    onClose()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
    if (e.key === 'Escape') onClose()
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
            {title}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-base">Name *</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Two Pointers Pattern"
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Description</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Brief description of what this covers..."
              rows={3}
              className="textarea-base"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="btn-primary flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Save
          </button>
        </div>

        <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
          Tip: Press Ctrl+Enter to save
        </p>
      </div>
    </div>
  )
}
