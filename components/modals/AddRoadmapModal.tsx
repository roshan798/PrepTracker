'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { X } from 'lucide-react';

const EMOJIS = ['📚', '🎯', '🔥', '💡', '🧩', '⚡', '🛠️', '🎓', '🚀', '💻', '📊', '🏆'];
const COLORS = ['cyan', 'violet', 'rose', 'emerald', 'amber'];

interface AddRoadmapModalProps {
  onClose: () => void;
}

export default function AddRoadmapModal({ onClose }: AddRoadmapModalProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const [color, setColor] = useState('cyan');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch({
      type: 'ADD_ROADMAP',
      payload: {
        id: generateId(),
        name: name.trim(),
        description: desc.trim(),
        emoji,
        color,
        type: 'custom',
        duration: duration.trim() || undefined,
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl border w-full max-w-md fade-in"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            New Roadmap
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Emoji</label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg text-lg transition-all ${emoji === e ? 'ring-2 ring-cyan-400 bg-cyan-500/10' : 'border hover:opacity-80'}`}
                  style={{ borderColor: 'var(--border)' }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g., Behavioral Interview Prep"
              className="w-full px-3 py-2.5 rounded-xl border text-sm transition-colors"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-cyan)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="What will you track in this roadmap?"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Duration</label>
              <input value={duration} onChange={e => setDuration(e.target.value)}
                placeholder="e.g., 4 weeks"
                className="w-full px-3 py-2.5 rounded-xl border text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Color</label>
              <div className="flex gap-2">
                {COLORS.map(c => {
                  const colorDots: Record<string, string> = { cyan: 'bg-cyan-400', violet: 'bg-violet-400', rose: 'bg-rose-400', emerald: 'bg-emerald-400', amber: 'bg-amber-400' };
                  return (
                    <button key={c} onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full ${colorDots[c]} transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-transparent scale-110' : ''}`}
                      style={{ '--tw-ring-color': 'white' } as React.CSSProperties} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!name.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-cyan-500 text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-40">
            Create Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
