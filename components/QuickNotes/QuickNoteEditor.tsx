'use client';

import { useCallback, useMemo, useState } from 'react';
import { useAppState } from '@/lib/store';
import { generateId } from '@/lib/utils';
import { QuickNote, StudyReference } from '@/lib/types';
import NoteEditor from '@/components/Notes/NoteEditor';
import { X } from 'lucide-react';
import StudyReferencePicker from './StudyReferencePicker';

interface QuickNoteEditorProps {
  note?: QuickNote;
  defaultReference?: StudyReference;
  onSave: (note: QuickNote) => void;
  onClose: () => void;
}

function referenceKey(reference?: StudyReference): string {
  if (!reference) return '';
  return [reference.roadmapId, reference.topicId, reference.subtopicId, reference.problemId]
    .filter(Boolean)
    .join('|');
}

export default function QuickNoteEditor({ note, defaultReference, onSave, onClose }: QuickNoteEditorProps) {
  const { roadmaps, quickNotes } = useAppState();
  const [title, setTitle] = useState(note?.title ?? '');
  const [tagsText, setTagsText] = useState(note?.tags.join(', ') ?? '');
  const [selectedReference, setSelectedReference] = useState(
    referenceKey(note?.reference ?? defaultReference),
  );
  const [content, setContent] = useState(note?.content ?? '');
  const [isDirty, setIsDirty] = useState(false);

  const getReferenceLabel = useCallback((reference?: StudyReference) => {
    if (!reference) return undefined;
    const roadmap = roadmaps.find(item => item.id === reference.roadmapId);
    if (!roadmap) return undefined;
    const topic = roadmap.topics.find(item => item.id === reference.topicId);
    const subtopic = topic?.subtopics.find(item => item.id === reference.subtopicId);
    const problem = subtopic?.problems.find(item => item.id === reference.problemId);
    return [roadmap.name, topic?.name, problem?.name ?? subtopic?.name].filter(Boolean).join(' / ');
  }, [roadmaps]);
  const recentOptions = useMemo(() => {
    const seen = new Set<string>();
    return [...quickNotes]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .flatMap(item => {
        if (!item.reference) return [];
        const key = referenceKey(item.reference);
        const label = getReferenceLabel(item.reference);
        if (!label || seen.has(key)) return [];
        seen.add(key);
        return [{ key, label }];
      })
      .slice(0, 5);
  }, [getReferenceLabel, quickNotes]);

  const selectedReferenceParts = selectedReference ? selectedReference.split('|') : [];
  const selectedReferenceLabel = getReferenceLabel({
    roadmapId: selectedReferenceParts[0] ?? '',
    topicId: selectedReferenceParts[1],
    subtopicId: selectedReferenceParts[2],
    problemId: selectedReferenceParts[3],
  });

  const close = () => {
    if (isDirty && !window.confirm('Discard your unsaved quick note?')) return;
    onClose();
  };

  const save = (savedContent: string) => {
    const tags = [...new Set(tagsText.split(',').map(tag => tag.trim()).filter(Boolean))];
    const referenceParts = selectedReference ? selectedReference.split('|') : [];
    const [roadmapId, topicId, subtopicId, problemId] = referenceParts;
    const roadmap = roadmaps.find(item => item.id === roadmapId);
    const topic = roadmap?.topics.find(item => item.id === topicId);
    const subtopic = topic?.subtopics.find(item => item.id === subtopicId);
    const reference = roadmap
      ? {
          roadmapId,
          ...(topic ? { topicId: topic.id } : {}),
          ...(subtopic ? { subtopicId: subtopic.id } : {}),
          ...(subtopic?.problems.some(problem => problem.id === problemId) ? { problemId } : {}),
        }
      : undefined;
    const updatedAt = new Date().toISOString();
    onSave({
      id: note?.id ?? generateId(),
      title: title.trim(),
      content: savedContent,
      tags,
      reference: reference ? { roadmapId, topicId, subtopicId, problemId } : undefined,
      createdAt: note?.createdAt ?? updatedAt,
      updatedAt,
    });
  };

  const fieldClassName = 'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-cyan-500/30';
  const fieldStyle = { backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={event => {
        if (event.target === event.currentTarget) close();
      }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-note-title"
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border shadow-2xl sm:rounded-2xl max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:rounded-none"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <header className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 id="quick-note-title" className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {note ? 'Edit quick note' : 'Capture a quick note'}
            </h2>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Markdown supported. Your notes stay on this device.
            </p>
          </div>
          <button type="button" onClick={close} aria-label="Close quick note editor" className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5">
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Title <span className="font-normal">(optional)</span></span>
            <input
              value={title}
              onChange={event => { setTitle(event.target.value); setIsDirty(true); }}
              placeholder="A short title for this note"
              maxLength={120}
              className={fieldClassName}
              style={fieldStyle}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Tags <span className="font-normal">(comma separated)</span></span>
              <input
                value={tagsText}
                onChange={event => { setTagsText(event.target.value); setIsDirty(true); }}
                placeholder="review, question"
                className={fieldClassName}
                style={fieldStyle}
              />
            </label>
            <div className="block space-y-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Link to study item</span>
              <StudyReferencePicker
                roadmaps={roadmaps}
                recentOptions={recentOptions}
                value={selectedReference}
                valueLabel={selectedReferenceLabel}
                onChange={value => {
                  setSelectedReference(value);
                  setIsDirty(true);
                }}
              />
            </div>
          </div>

          <NoteEditor
            key={note?.id ?? 'new-quick-note'}
            initialValue={content}
            placeholder="# Key idea\n\nWrite your note here..."
            onDraftChange={setContent}
            onSave={save}
            onCancel={close}
            isEdit={Boolean(note)}
          />
        </div>
      </section>
    </div>
  );
}
