'use client';
import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Topic, Subtopic } from '@/lib/types';
import { generateId } from '@/lib/utils';
import StatusSelect from '@/components/ui/StatusSelect';
import SubtopicItem from './SubtopicItem';
import { ChevronDown, ChevronRight, Plus, Trash2, StickyNote } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import Notes from '../Notes/Notes';
import { NotesToggleButton } from '../ui/NotesToggleButton';

interface TopicItemProps {
  roadmapId: string;
  topic: Topic;
  roadmapColor: string;
}

export default function TopicItem({ roadmapId, topic, roadmapColor }: TopicItemProps) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [addingSubtopic, setAddingSubtopic] = useState(false);
  const [subtopicName, setSubtopicName] = useState('');

  const updateTopic = useCallback((updates: Partial<Topic>) => {
    dispatch({ type: 'UPDATE_TOPIC', payload: { roadmapId, topicId: topic.id, updates } });
  }, [dispatch, roadmapId, topic.id]);

  const deleteTopic = () => {
    dispatch({ type: 'DELETE_TOPIC', payload: { roadmapId, topicId: topic.id } });
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
    <div className="rounded-2xl border mb-3 overflow-hidden transition-all"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>

      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity">
          <span className="transition-transform duration-200" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {topic.week && (
                <span className="text-xs px-2 py-0.5 rounded-full border mono shrink-0"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  W{topic.week}
                </span>
              )}
              <h3 className={`font-bold text-sm ${statusColors[topic.status] || ''}`}
                style={{ fontFamily: 'Syne, sans-serif', color: topic.status !== 'not-started' ? undefined : 'var(--text-primary)' }}>
                {topic.name}
              </h3>
            </div>
            {topic.description && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{topic.description}</p>
            )}
          </div>
        </button>

        {total > 0 && (
          <div className="hidden sm:block w-24">
            <ProgressBar percentage={pct} color={roadmapColor} height="h-1.5" />
            <div className="text-xs mono mt-0.5 text-right" style={{ color: 'var(--text-secondary)' }}>{completed}/{total}</div>
          </div>
        )}

        <NotesToggleButton
          value={topic.notes}
          showNotes={showNotes}
          onToggle={() => setShowNotes(!showNotes)}
        />

        <StatusSelect status={topic.status} onChange={(s) => updateTopic({ status: s })} />

        <button onClick={deleteTopic}
          className="p-2 rounded-lg hover:text-rose-400 transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <Trash2 size={14} />
        </button>
      </div>

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

      {expanded && (
        <div className="px-5 pb-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="pt-3 space-y-1">
            {topic.subtopics.map(sub => (
              <SubtopicItem key={sub.id} roadmapId={roadmapId} topicId={topic.id} subtopic={sub} />
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
        </div>
      )}
    </div>
  );
}
