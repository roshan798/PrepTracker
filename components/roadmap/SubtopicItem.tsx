'use client';
import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Subtopic, Status, Difficulty } from '@/lib/types';
import { getDifficultyColor, generateId } from '@/lib/utils';
import StatusSelect from '@/components/ui/StatusSelect';
import { ChevronDown, ChevronRight, ExternalLink, Plus, Trash2, StickyNote } from 'lucide-react';

import ProblemItem from './ProblemItem';

import Notes from '../Notes/Notes';
import { NotesToggleButton } from '../ui/NotesToggleButton';

interface SubtopicItemProps {
  roadmapId: string;
  topicId: string;
  subtopic: Subtopic;
}

export default function SubtopicItem({ roadmapId, topicId, subtopic }: SubtopicItemProps) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [addingProblem, setAddingProblem] = useState(false);
  const [newProbName, setNewProbName] = useState('');
  const [newProbDiff, setNewProbDiff] = useState<Difficulty>('medium');
  const [newProbUrl, setNewProbUrl] = useState('');

  const updateSubtopic = useCallback((updates: Partial<Subtopic>) => {
    dispatch({ type: 'UPDATE_SUBTOPIC', payload: { roadmapId, topicId, subtopicId: subtopic.id, updates } });
  }, [dispatch, roadmapId, topicId, subtopic.id]);

  const addProblem = () => {
    if (!newProbName.trim()) return;
    dispatch({
      type: 'ADD_PROBLEM',
      payload: {
        roadmapId, topicId, subtopicId: subtopic.id,
        problem: { id: generateId(), name: newProbName.trim(), difficulty: newProbDiff, status: 'not-started', notes: '', url: newProbUrl.trim() || undefined },
      },
    });
    setNewProbName(''); setNewProbDiff('medium'); setNewProbUrl(''); setAddingProblem(false);
  };

  const completedCount = subtopic.problems.filter(p => p.status === 'completed').length;

  const statusDot = {
    'not-started': 'bg-slate-500',
    'in-progress': 'bg-amber-400',
    'completed': 'bg-emerald-400',
  }[subtopic.status];

  return (
    <div className="rounded-xl border mb-2 overflow-hidden transition-all"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} />
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity">
          {expanded ? <ChevronDown size={13} style={{ color: 'var(--text-secondary)' }} /> : <ChevronRight size={13} style={{ color: 'var(--text-secondary)' }} />}
          <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{subtopic.name}</span>
        </button>

        {subtopic.problems.length > 0 && (
          <span className="text-xs mono px-2 py-0.5 rounded-full border"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
            {completedCount}/{subtopic.problems.length}
          </span>
        )}

        <NotesToggleButton
          value={subtopic.notes}
          showNotes={showNotes}
          onToggle={() => setShowNotes(!showNotes)}
        />

        <StatusSelect status={subtopic.status} onChange={(s) => updateSubtopic({ status: s })} compact />
      </div>

      {showNotes && (
        <div className="px-4 pb-3">
          <Notes
            value={subtopic.notes}
            onChange={(e) => updateSubtopic({ notes: e.target.value })}
            placeholder="Add notes, key insights, or links..."
            rows={3}
          />
        </div>
      )}

      {expanded && (
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border)' }}>
          <div className="space-y-1.5 mb-3">
            {subtopic.problems.map(problem => (
              <ProblemItem
                key={problem.id}
                roadmapId={roadmapId}
                topicId={topicId}
                subtopicId={subtopic.id}
                problem={problem}
              />
            ))}
          </div>

          {addingProblem ? (
            <div className="flex flex-col gap-2 p-3 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
              <input value={newProbName} onChange={e => setNewProbName(e.target.value)}
                placeholder="Problem name..."
                className="w-full px-3 py-2 rounded-lg border text-xs"
                style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
              <div className="flex gap-2">
                <select value={newProbDiff} onChange={e => setNewProbDiff(e.target.value as Difficulty)}
                  className="flex-1 px-2 py-1.5 rounded-lg border text-xs"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input value={newProbUrl} onChange={e => setNewProbUrl(e.target.value)}
                  placeholder="URL (optional)"
                  className="flex-1 px-2 py-1.5 rounded-lg border text-xs"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAddingProblem(false)}
                  className="flex-1 py-1.5 text-xs rounded-lg border hover:opacity-70"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button onClick={addProblem}
                  className="flex-1 py-1.5 text-xs rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30">
                  Add Problem
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingProblem(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed transition-all hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <Plus size={11} /> Add Problem
            </button>
          )}
        </div>
      )}
    </div>
  );
}
