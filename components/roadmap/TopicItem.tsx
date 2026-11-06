'use client';
import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Topic, Subtopic } from '@/lib/types';
import { generateId } from '@/lib/utils';
import {
  RoadmapStatusFilter,
  problemMatchesFilter,
  subtopicMatchesFilter,
  subtopicMatchesSelf,
  topicMatchesSelf,
} from '@/lib/roadmap-filter';
import StatusSelect from '@/components/ui/StatusSelect';
import SubtopicItem from './SubtopicItem';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import Notes from '../Notes/Notes';
import { NotesToggleButton } from '../ui/NotesToggleButton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface TopicItemProps {
  roadmapId: string;
  topic: Topic;
  roadmapColor: string;
  topicIndex: number;
  searchTerm: string;
  filterStatus: RoadmapStatusFilter;
}

export default function TopicItem({
  roadmapId,
  topic,
  roadmapColor,
  topicIndex,
  searchTerm,
  filterStatus,
}: TopicItemProps) {
  const dispatch = useAppDispatch();
  const [expansionOverride, setExpansionOverride] = useState<{ key: string; expanded: boolean } | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addingSubtopic, setAddingSubtopic] = useState(false);
  const [subtopicName, setSubtopicName] = useState('');
  const panelId = `topic-content-${topic.id}`;
  const expansionKey = `${searchTerm.trim().toLocaleLowerCase()}::${filterStatus}`;
  const hasActiveFilter = Boolean(searchTerm.trim()) || filterStatus !== 'all';
  const topicMatches = topicMatchesSelf(topic, searchTerm, filterStatus);
  const matchingSubtopics = topic.subtopics.filter(subtopic =>
    subtopicMatchesFilter(subtopic, searchTerm, filterStatus)
  );
  const visibleSubtopics = !hasActiveFilter || topicMatches
    ? topic.subtopics
    : matchingSubtopics;
  const autoExpand = matchingSubtopics.some(subtopic =>
    !subtopicMatchesSelf(subtopic, searchTerm, filterStatus) &&
    subtopic.problems.some(problem => problemMatchesFilter(problem, searchTerm, filterStatus))
  ) || (matchingSubtopics.length > 0 && !topicMatches);
  const expanded = expansionOverride?.key === expansionKey
    ? expansionOverride.expanded
    : autoExpand;

  const updateTopic = useCallback((updates: Partial<Topic>) => {
    dispatch({ type: 'UPDATE_TOPIC', payload: { roadmapId, topicId: topic.id, updates } });
  }, [dispatch, roadmapId, topic.id]);

  const deleteTopic = () => {
    dispatch({ type: 'DELETE_TOPIC', payload: { roadmapId, topicId: topic.id } });
    setConfirmDelete(false);
  };

  const addSubtopic = () => {
    if (!subtopicName.trim()) return;
    const newSub: Subtopic = {
      id: generateId(),
      name: subtopicName.trim(),
      status: 'not-started',
      notes: '',
      problems: [],
    };
    dispatch({ type: 'ADD_SUBTOPIC', payload: { roadmapId, topicId: topic.id, subtopic: newSub } });
    setSubtopicName('');
    setAddingSubtopic(false);
  };

  const completed = topic.subtopics.filter(s => s.status === 'completed').length;
  const total = topic.subtopics.length;
  const pct = total === 0 ? (topic.status === 'completed' ? 100 : 0) : Math.round((completed / total) * 100);

  const statusColors: Record<string, string> = {
    'completed': 'text-emerald-400',
    'in-progress': 'text-amber-400',
    'not-started': '',
  };

  return (
    <article
      className="roadmap-topic-card mb-3 overflow-hidden rounded-2xl border transition-all"
      style={{
        borderColor: expanded
          ? 'color-mix(in srgb, var(--accent-cyan) 32%, var(--border))'
          : 'var(--border)',
        backgroundColor: 'var(--glass-surface)',
        boxShadow: expanded ? 'var(--surface-shadow), var(--glass-highlight)' : undefined,
      }}>
      <header className="roadmap-topic-header flex flex-wrap items-center gap-x-3 gap-y-3 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setExpansionOverride({ key: expansionKey, expanded: !expanded })}
          aria-expanded={expanded}
          aria-controls={expanded ? panelId : undefined}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${topic.name}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors hover:bg-cyan-500/10"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <ChevronDown
            size={17}
            className="transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
        </button>

        <div className="min-w-0 flex-1 basis-[calc(100%-3rem)] sm:basis-0">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="mono inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg border px-1.5 text-[11px] font-semibold"
              style={{
                color: 'var(--accent-cyan)',
                borderColor: 'color-mix(in srgb, var(--accent-cyan) 24%, var(--border))',
                backgroundColor: 'color-mix(in srgb, var(--accent-cyan) 9%, transparent)',
              }}>
              {topic.week ? `W${topic.week}` : String(topicIndex + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h3
                className={`text-sm font-bold leading-snug sm:text-base ${statusColors[topic.status] || ''}`}
                style={{
                  fontFamily: 'Syne, sans-serif',
                  color: topic.status !== 'not-started' ? undefined : 'var(--text-primary)',
                }}>
                {topic.name}
              </h3>
              {topic.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {topic.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="roadmap-topic-controls flex w-full flex-wrap items-center justify-between gap-2 pl-12 sm:w-auto sm:justify-end sm:pl-0">
          {total > 0 && (
            <div className="roadmap-topic-progress flex min-w-20 items-center gap-2 sm:block sm:w-24">
              <div className="flex-1 sm:flex-none">
                <ProgressBar percentage={pct} color={roadmapColor} height="h-1.5" />
              </div>
              <div
                className="mono text-[11px] sm:mt-1 sm:text-right sm:text-xs"
                aria-label={`${completed} of ${total} lessons completed`}
                style={{ color: 'var(--text-secondary)' }}>
                {completed}/{total}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <NotesToggleButton
              value={topic.notes}
              showNotes={showNotes}
              onToggle={() => setShowNotes(!showNotes)}
              label={topic.name}
            />
            {topic.subtopics.length === 0 && (
              <StatusSelect
                status={topic.status}
                onChange={status => updateTopic({ status })}
                ariaLabel={`Status for ${topic.name}`}
                compact
              />
            )}
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              aria-label={`Delete ${topic.name}`}
              title="Delete module"
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-rose-500/10 hover:text-rose-400"
              style={{ color: 'var(--text-secondary)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </header>

      {showNotes && (
        <div className="px-5 pb-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="pt-3">
            <Notes
              label="📝 Topic Notes"
              value={topic.notes}
              onChange={(e) => updateTopic({ notes: e.target.value })}
              placeholder="Add notes, key concepts, links, or personal tips..."
              rows={4}
            />
          </div>
        </div>
      )}
      {confirmDelete && (
        <ConfirmDialog
          title={`Delete ${topic.name}?`}
          description="This module and all of its subtopics, tasks, notes, and progress will be permanently removed."
          onCancel={() => setConfirmDelete(false)}
          onConfirm={deleteTopic}
        />
      )}

      {expanded && (
        <section
          id={panelId}
          aria-label={`${topic.name} lessons`}
          className="border-t px-4 pb-4 sm:px-5"
          style={{ borderColor: 'var(--border)' }}>
          <div className="ml-1 mt-4 space-y-2 border-l pl-3 sm:ml-2 sm:pl-4" style={{ borderColor: 'var(--border)' }}>
            {visibleSubtopics.map(subtopic => (
              <SubtopicItem
                key={subtopic.id}
                roadmapId={roadmapId}
                topicId={topic.id}
                subtopic={subtopic}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                revealAllProblems={topicMatches}
              />
            ))}
          </div>

          {addingSubtopic ? (
            <div className="flex gap-2 mt-2">
              <input value={subtopicName} onChange={e => setSubtopicName(e.target.value)}
                placeholder="Subtopic name..."
                className="flex-1 px-3 py-2 rounded-xl border text-sm"
                style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && addSubtopic()} />
              <button onClick={() => setAddingSubtopic(false)}
                className="px-3 py-2 text-xs rounded-xl border hover:opacity-70"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={addSubtopic}
                className="px-3 py-2 text-xs rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30">
                Add
              </button>
            </div>
          ) : (
            <button onClick={() => setAddingSubtopic(true)}
              className="mt-2 flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-dashed transition-all hover:opacity-80"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <Plus size={12} /> Add Subtopic
            </button>
          )}
        </section>
      )}
    </article>
  );
}
