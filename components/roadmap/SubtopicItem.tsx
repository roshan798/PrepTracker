'use client';
import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Subtopic, Difficulty } from '@/lib/types';
import { generateId } from '@/lib/utils';
import {
  RoadmapStatusFilter,
  problemMatchesFilter,
  subtopicMatchesSelf,
} from '@/lib/roadmap-filter';
import StatusSelect from '@/components/ui/StatusSelect';
import { ChevronDown, Plus } from 'lucide-react';

import ProblemItem from './ProblemItem';

import Notes from '../Notes/Notes';
import { NotesToggleButton } from '../ui/NotesToggleButton';

interface SubtopicItemProps {
  roadmapId: string;
  topicId: string;
  subtopic: Subtopic;
  searchTerm: string;
  filterStatus: RoadmapStatusFilter;
  revealAllProblems: boolean;
}

export default function SubtopicItem({
  roadmapId,
  topicId,
  subtopic,
  searchTerm,
  filterStatus,
  revealAllProblems,
}: SubtopicItemProps) {
  const dispatch = useAppDispatch();
  const [expansionOverride, setExpansionOverride] = useState<{ key: string; expanded: boolean } | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [addingProblem, setAddingProblem] = useState(false);
  const [newProbName, setNewProbName] = useState('');
  const [newProbDiff, setNewProbDiff] = useState<Difficulty>('medium');
  const [newProbUrl, setNewProbUrl] = useState('');
  const panelId = `subtopic-content-${subtopic.id}`;
  const expansionKey = `${searchTerm.trim().toLocaleLowerCase()}::${filterStatus}`;
  const hasActiveFilter = Boolean(searchTerm.trim()) || filterStatus !== 'all';
  const subtopicMatches = subtopicMatchesSelf(subtopic, searchTerm, filterStatus);
  const revealAll = revealAllProblems || subtopicMatches || !hasActiveFilter;
  const matchingProblems = subtopic.problems.filter(problem =>
    problemMatchesFilter(problem, searchTerm, filterStatus)
  );
  const visibleProblems = revealAll ? subtopic.problems : matchingProblems;
  const autoExpand = hasActiveFilter && !revealAll && matchingProblems.length > 0;
  const expanded = expansionOverride?.key === expansionKey
    ? expansionOverride.expanded
    : autoExpand;

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

  const statusColor = {
    'not-started': 'var(--text-secondary)',
    'in-progress': 'var(--accent-amber)',
    'completed': 'var(--accent-emerald)',
  }[subtopic.status];

  return (
    <article
      className="overflow-hidden rounded-xl border transition-colors"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
      <header className="roadmap-subtopic-header flex flex-wrap items-center gap-x-2.5 gap-y-2.5 p-3 sm:px-4">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          aria-hidden="true"
          title={subtopic.status.replace('-', ' ')}
          style={{ backgroundColor: statusColor }}
        />
        <button
          type="button"
          onClick={() => setExpansionOverride({ key: expansionKey, expanded: !expanded })}
          aria-expanded={expanded}
          aria-controls={expanded ? panelId : undefined}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${subtopic.name}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-cyan-500/10"
          style={{ color: 'var(--text-secondary)' }}>
          <ChevronDown
            size={15}
            className="transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
        </button>
        <h4 className="min-w-0 flex-1 text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
          {subtopic.name}
        </h4>

        <div className="roadmap-subtopic-controls flex w-full flex-wrap items-center justify-between gap-2 pl-11 sm:w-auto sm:justify-end sm:pl-0">
          {subtopic.problems.length > 0 && (
            <span
              className="mono rounded-full border px-2 py-1 text-[11px]"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
              {completedCount}/{subtopic.problems.length} tasks
            </span>
          )}
          <div className="flex items-center gap-1">
            <NotesToggleButton
              value={subtopic.notes}
              showNotes={showNotes}
              onToggle={() => setShowNotes(!showNotes)}
              label={subtopic.name}
            />
            {subtopic.problems.length === 0 && (
              <StatusSelect
                status={subtopic.status}
                onChange={status => updateSubtopic({ status })}
                compact
                ariaLabel={`Status for ${subtopic.name}`}
              />
            )}
          </div>
        </div>
      </header>

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
        <section
          id={panelId}
          aria-label={`${subtopic.name} tasks`}
          className="border-t px-3 py-3 sm:px-4"
          style={{ borderColor: 'var(--border)' }}>
          <ul className="mb-3 space-y-1.5">
            {visibleProblems.map(problem => (
              <ProblemItem
                key={problem.id}
                roadmapId={roadmapId}
                topicId={topicId}
                subtopicId={subtopic.id}
                problem={problem}
              />
            ))}
          </ul>

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
                <button type="button" onClick={() => setAddingProblem(false)}
                  className="flex-1 py-1.5 text-xs rounded-lg border hover:opacity-70"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button type="button" onClick={addProblem}
                  className="flex-1 py-1.5 text-xs rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30">
                  Add Problem
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setAddingProblem(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed transition-all hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <Plus size={11} /> Add Problem
            </button>
          )}
        </section>
      )}
    </article>
  );
}
