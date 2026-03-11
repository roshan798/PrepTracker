'use client'

import React, { useState, useRef } from 'react'
import { X, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { AppState } from '@/lib/types'

interface Props {
  onClose: () => void
}

export default function ImportModal({ onClose }: Props) {
  const { dispatch } = useStore()
  const [status, setStatus] = useState<'idle' | 'parsed' | 'error'>('idle')
  const [parsed, setParsed] = useState<AppState | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AppState
        if (!data.roadmaps || !Array.isArray(data.roadmaps)) {
          throw new Error('Invalid format: missing roadmaps array')
        }
        setParsed(data)
        setStatus('parsed')
        setErrorMsg('')
      } catch (err: unknown) {
        setStatus('error')
        setErrorMsg(err instanceof Error ? err.message : 'Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    if (!parsed) return
    dispatch({ type: 'IMPORT', payload: parsed })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl p-6 animate-slide-up"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Import Data
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-violet-500/50 transition-colors mb-4"
          style={{ borderColor: 'var(--border)' }}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={28} className="mx-auto mb-2 text-violet-400 opacity-60" />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Click to select JSON file
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Export a backup first before importing
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {status === 'parsed' && parsed && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20 animate-slide-up">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">File parsed successfully</span>
            </div>
            <p className="text-xs text-emerald-400/80">
              {parsed.roadmaps.length} roadmap{parsed.roadmaps.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-sm font-medium text-red-400">Parse error</span>
            </div>
            <p className="text-xs text-red-400/80">{errorMsg}</p>
          </div>
        )}

        {status === 'parsed' && (
          <div className="mb-4 p-3 rounded-lg bg-amber-400/10 border border-amber-400/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-sm font-medium text-amber-400">This will overwrite ALL current data</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="w-3.5 h-3.5 accent-violet-500"
              />
              <span className="text-xs text-amber-400/80">
                I understand this will replace my current progress
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          {status === 'parsed' && (
            <button
              onClick={handleImport}
              disabled={!confirmed}
              className="btn-primary flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Upload size={14} /> Import & Overwrite
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
