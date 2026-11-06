'use client';
import { useState, useEffect } from 'react';
import { useRoadmap, useAppDispatch } from '@/lib/store';
import { getRoadmapStats } from '@/lib/utils';
import { RoadmapStatusFilter, topicMatchesFilter } from '@/lib/roadmap-filter';
import TopicItem from './TopicItem';
import ProgressBar from '@/components/ui/ProgressBar';
import Confetti from '@/components/ui/Confetti';
import AddTopicModal from '@/components/modals/AddTopicModal';
import { Plus, Clock, BookOpen, Edit3, Check, X, Search } from 'lucide-react';

interface RoadmapViewProps {
  roadmapId: string;
}

const colorAccent: Record<string, string> = {
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

const colorBg: Record<string, string> = {
  cyan: 'bg-cyan-500/15 border-cyan-500/20',
  violet: 'bg-violet-500/15 border-violet-500/20',
  rose: 'bg-rose-500/15 border-rose-500/20',
  emerald: 'bg-emerald-500/15 border-emerald-500/20',
  amber: 'bg-amber-500/15 border-amber-500/20',
};

export default function RoadmapView({ roadmapId }: RoadmapViewProps) {
  const roadmap = useRoadmap(roadmapId);
  const dispatch = useAppDispatch();
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [prevPct, setPrevPct] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [filterStatus, setFilterStatus] = useState<RoadmapStatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = roadmap ? getRoadmapStats(roadmap) : null;

  useEffect(() => {
    if (stats && stats.percentage === 100 && prevPct < 100) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 6000);
    }
    if (stats) setPrevPct(stats.percentage);
  }, [stats?.percentage]);

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center fade-in">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-bold text-xl mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
            Roadmap not found
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>This roadmap may have been deleted.</p>
        </div>
      </div>
    );
  }

  const textCls = colorAccent[roadmap.color] || colorAccent.cyan;
  const bgCls = colorBg[roadmap.color] || colorBg.cyan;

  const startEditing = () => {
    setEditName(roadmap.name);
    setEditDesc(roadmap.description);
    setEditingName(true);
  };

  const saveEdit = () => {
    dispatch({ type: 'UPDATE_ROADMAP_META', payload: { id: roadmap.id, name: editName, description: editDesc } });
    setEditingName(false);
  };

  const filteredTopics = roadmap.topics.filter(topic =>
    topicMatchesFilter(topic, searchTerm, filterStatus)
  );

  return (
    <div className="roadmap-page mx-auto max-w-5xl p-4 sm:p-5 md:p-8">
      <Confetti active={confetti} />

      {/* Header */}
      <div className="roadmap-hero fade-in mb-6">
        <div className="page-kicker mb-3">{roadmap.type === 'predefined' ? 'Curated learning path' : 'Your custom learning path'}</div>
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border text-3xl ${bgCls}`}>
            {roadmap.emoji}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="space-y-2">
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-lg font-bold"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Syne, sans-serif' }} />
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm resize-none"
                  rows={2}
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs hover:bg-emerald-500/30">
                    <Check size={12} /> Save
                  </button>
                  <button onClick={() => setEditingName(false)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border hover:opacity-70"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className={`page-title ${roadmap.type === 'custom' ? 'cursor-pointer hover:opacity-80' : ''}`}
                    style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}
                    onClick={roadmap.type === 'custom' ? startEditing : undefined}>
                    {roadmap.name}
                  </h1>
                  {roadmap.type === 'custom' && (
                    <button onClick={startEditing} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text-secondary)' }}>
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{roadmap.description}</p>
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Progress', value: `${stats.percentage}%`, cls: textCls },
              { label: 'Completed', value: stats.completed, cls: 'text-emerald-400' },
              { label: 'In Progress', value: stats.inProgress, cls: 'text-amber-400' },
              { label: 'Tasks', value: stats.problemsTotal > 0 ? `${stats.problemsCompleted}/${stats.problemsTotal}` : '—', cls: 'text-violet-400' },
            ].map(s => (
              <div key={s.label} className="roadmap-stat surface-card px-4 py-3"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <div className={`text-xl font-bold mono ${s.cls}`}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {stats && (
          <ProgressBar percentage={stats.percentage} color={roadmap.color} height="h-3" showLabel />
        )}

        {roadmap.duration && (
          <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            <span>{roadmap.duration} · {roadmap.topics.length} modules</span>
          </div>
        )}
      </div>

      <section
        aria-label="Search and filter learning modules"
        className="roadmap-filters surface-card mb-6 space-y-4 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="roadmap-filter-buttons flex flex-wrap items-center gap-2" role="group" aria-label="Filter modules by status">
            {(['all', 'not-started', 'in-progress', 'completed'] as const).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                aria-pressed={filterStatus === status}
                className={`min-h-10 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                  filterStatus === status ? 'bg-cyan-500/15 text-cyan-400' : 'hover:bg-cyan-500/10'
                }`}
                style={{
                  borderColor: filterStatus === status
                    ? 'color-mix(in srgb, var(--accent-cyan) 36%, var(--border))'
                    : 'var(--border)',
                  color: filterStatus === status ? undefined : 'var(--text-secondary)',
                  backgroundColor: filterStatus === status ? undefined : 'var(--bg-tertiary)',
                }}>
                {status === 'all' ? 'All' : status === 'not-started' ? 'Not Started' : status === 'in-progress' ? 'In Progress' : 'Completed'}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="roadmap-search" className="sr-only">Search modules, lessons, and tasks</label>
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              id="roadmap-search"
              type="text"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search modules, lessons, tasks..."
              className="w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg hover:bg-cyan-500/10"
                style={{ color: 'var(--text-secondary)' }}>
                <X size={15} />
              </button>
            )}
          </div>
        </div>
        <p aria-live="polite" className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Showing {filteredTopics.length} of {roadmap.topics.length} modules
          {searchTerm.trim() ? ` matching “${searchTerm.trim()}” across lessons and tasks` : ''}
        </p>
      </section>

      <section aria-label="Learning modules">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="section-title">Your learning path</h2>
          <span className="mono text-xs" style={{ color: 'var(--text-secondary)' }}>
            {filteredTopics.length} {filteredTopics.length === 1 ? 'MODULE' : 'MODULES'}
          </span>
        </div>
        <div className="space-y-2">
        {filteredTopics.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-dashed"
            style={{ borderColor: 'var(--border)' }}>
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {searchTerm || filterStatus !== 'all' ? 'No topics match your filter.' : 'No topics yet. Add your first topic!'}
            </p>
          </div>
        )}

        {filteredTopics.map(topic => (
          <div key={topic.id} className="fade-in">
            <TopicItem
              roadmapId={roadmap.id}
              topic={topic}
              roadmapColor={roadmap.color}
              topicIndex={roadmap.topics.indexOf(topic)}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
            />
          </div>
        ))}
      </div>
      </section>

      <button onClick={() => setShowAddTopic(true)}
        className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed text-sm font-medium transition-all hover:opacity-80"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
        <Plus size={15} />
        Add New Topic
      </button>

      {showAddTopic && <AddTopicModal roadmapId={roadmap.id} onClose={() => setShowAddTopic(false)} />}
    </div>
  );
}
