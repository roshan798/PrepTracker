'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { X } from 'lucide-react';

interface AddTopicModalProps {
  roadmapId: string;
  onClose: () => void;
}

export default function AddTopicModal({ roadmapId, onClose }: AddTopicModalProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [week, setWeek] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch({
      type: 'ADD_TOPIC',
      payload: {
        roadmapId,
        topic: {
          id: generateId(),
          name: name.trim(),
          description: desc.trim(),
          status: 'not-started',
          notes: '',
          subtopics: [],
          week: week ? parseInt(week) : undefined,
        },
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-2xl border w-full max-w-sm fade-in"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            Add Topic
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Topic Name *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g., Week 1: Introduction"
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Brief description of this topic..."
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Week (optional)</label>
            <input value={week} onChange={e => setWeek(e.target.value)} type="number" min="1"
              placeholder="e.g., 1"
              className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border hover:opacity-70"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!name.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-cyan-500 text-gray-900 hover:opacity-90 disabled:opacity-40">
            Add Topic
          </button>
        </div>
      </div>
    </div>
  );
}
