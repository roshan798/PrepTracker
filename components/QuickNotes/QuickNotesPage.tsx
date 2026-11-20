'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { BookOpen, CalendarDays, FileText, Pencil, Search, Tag, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppState } from '@/lib/store';
import { QuickNote, StudyReference } from '@/lib/types';
import MarkdownPreview from '@/components/Notes/MarkdownPreview';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const QuickNoteEditor = dynamic(() => import('./QuickNoteEditor'));

function referenceKey(reference?: StudyReference): string {
  if (!reference) return '';
  return [reference.roadmapId, reference.topicId, reference.subtopicId, reference.problemId]
    .filter(Boolean)
    .join('|');
}

function getReferenceDetails(reference: StudyReference | undefined, roadmaps: ReturnType<typeof useAppState>['roadmaps']) {
  if (!reference) return null;
  const roadmap = roadmaps.find(item => item.id === reference.roadmapId);
  if (!roadmap) return { label: 'Study item unavailable', href: undefined };

  const topic = roadmap.topics.find(item => item.id === reference.topicId);
  const subtopic = topic?.subtopics.find(item => item.id === reference.subtopicId);
  const problem = subtopic?.problems.find(item => item.id === reference.problemId);
  const label = [roadmap.name, topic?.name, problem?.name ?? subtopic?.name].filter(Boolean).join(' / ');
  const anchor = problem
    ? `problem-${problem.id}`
    : subtopic
      ? `subtopic-content-${subtopic.id}`
      : topic
        ? `topic-content-${topic.id}`
        : undefined;
  return { label, href: `/roadmaps/${roadmap.id}${anchor ? `#${anchor}` : ''}` };
}

function getDisplayTitle(note: QuickNote): string {
  if (note.title.trim()) return note.title;
  const firstLine = note.content.split('\n').find(line => line.trim())?.replace(/^#+\s*/, '').trim();
  return firstLine || 'Untitled note';
}

export default function QuickNotesPage() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [referenceFilter, setReferenceFilter] = useState('');
  const [editingNote, setEditingNote] = useState<QuickNote | null>(null);
  const [deletingNote, setDeletingNote] = useState<QuickNote | null>(null);

  const allTags = useMemo(
    () => [...new Set(state.quickNotes.flatMap(note => note.tags))].sort((a, b) => a.localeCompare(b)),
    [state.quickNotes],
  );
  const allReferences = useMemo(() => {
    const references = new Map<string, string>();
    state.quickNotes.forEach(note => {
      if (!note.reference) return;
      const key = referenceKey(note.reference);
      const details = getReferenceDetails(note.reference, state.roadmaps);
      if (details) references.set(key, details.label);
    });
    return [...references.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [state.quickNotes, state.roadmaps]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return [...state.quickNotes]
      .filter(note => !tagFilter || note.tags.includes(tagFilter))
      .filter(note => !referenceFilter || referenceKey(note.reference) === referenceFilter)
      .filter(note => {
        if (!normalizedQuery) return true;
        const reference = getReferenceDetails(note.reference, state.roadmaps)?.label ?? '';
        return [note.title, note.content, ...note.tags, reference]
          .some(value => value.toLocaleLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [query, referenceFilter, state.quickNotes, state.roadmaps, tagFilter]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 pb-24 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent-cyan)' }}>
            <FileText size={14} /> Study workspace
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-syne), sans-serif', color: 'var(--text-primary)' }}>Quick notes</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {state.quickNotes.length} {state.quickNotes.length === 1 ? 'note' : 'notes'} saved on this device
          </p>
        </div>
        <Link href="/" className="text-sm font-semibold hover:opacity-75" style={{ color: 'var(--accent-cyan)' }}>
          Back to dashboard
        </Link>
      </header>

      <section className="space-y-3 rounded-2xl border p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <label className="relative block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search titles, content, tags, or linked items..."
            aria-label="Search quick notes"
            className="w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2">
            <Tag size={15} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={tagFilter}
              onChange={event => setTagFilter(event.target.value)}
              aria-label="Filter by tag"
              className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="">All tags</option>
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <BookOpen size={15} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={referenceFilter}
              onChange={event => setReferenceFilter(event.target.value)}
              aria-label="Filter by linked study item"
              className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="">All study items</option>
              {allReferences.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
        </div>
      </section>

      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-6 py-14 text-center" style={{ borderColor: 'var(--border)' }}>
          <FileText size={28} className="mx-auto mb-3 opacity-60" style={{ color: 'var(--text-secondary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {state.quickNotes.length ? 'No notes match these filters' : 'No quick notes yet'}
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {state.quickNotes.length ? 'Try another search or clear a filter.' : 'Use the floating Quick note button to capture an idea while you study.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map(note => {
            const reference = getReferenceDetails(note.reference, state.roadmaps);
            return (
              <article key={note.id} className="overflow-hidden rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <header className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{getDisplayTitle(note)}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="inline-flex items-center gap-1"><CalendarDays size={13} /> Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                      {reference && (
                        reference.href
                          ? <Link href={reference.href} className="inline-flex max-w-full items-center gap-1 truncate hover:underline" style={{ color: 'var(--accent-cyan)' }}><BookOpen size={13} />{reference.label}</Link>
                          : <span className="inline-flex items-center gap-1"><BookOpen size={13} />{reference.label}</span>
                      )}
                    </div>
                    {note.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {note.tags.map(tag => (
                          <span key={tag} className="rounded-full border px-2.5 py-1 text-[11px]" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => setEditingNote(note)} aria-label={`Edit ${getDisplayTitle(note)}`} className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}><Pencil size={15} /></button>
                    <button type="button" onClick={() => setDeletingNote(note)} aria-label={`Delete ${getDisplayTitle(note)}`} className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10"><Trash2 size={15} /></button>
                  </div>
                </header>
                <div className="px-5 py-4">
                  <MarkdownPreview content={note.content} />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {editingNote && (
        <QuickNoteEditor
          key={editingNote.id}
          note={editingNote}
          onSave={updated => {
            dispatch({ type: 'UPDATE_QUICK_NOTE', payload: updated });
            setEditingNote(null);
          }}
          onClose={() => setEditingNote(null)}
        />
      )}
      {deletingNote && (
        <ConfirmDialog
          title={`Delete ${getDisplayTitle(deletingNote)}?`}
          description="This quick note will be permanently removed."
          onCancel={() => setDeletingNote(null)}
          onConfirm={() => {
            dispatch({ type: 'DELETE_QUICK_NOTE', payload: deletingNote.id });
            setDeletingNote(null);
          }}
        />
      )}
    </div>
  );
}
