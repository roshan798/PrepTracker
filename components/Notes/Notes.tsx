'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2 } from 'lucide-react';
import { NoteItem } from './types';
import { genId, parseValue, serializeNotes, syntheticEvent } from './utils';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';
import "../../app/css/notes.css";

export interface NotesProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

export default function Notes({ value, onChange, placeholder, rows = 3, label }: NotesProps) {
  const initializedRef = useRef(false);
  const [notes, setNotes] = useState<NoteItem[]>(() => parseValue(value));
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    setNotes(parseValue(value));
  }, [value]);

  const propagate = useCallback(
    (updated: NoteItem[]) => {
      onChange(syntheticEvent(serializeNotes(updated)));
    },
    [onChange],
  );

  const addNote = (content: string) => {
    const newNote: NoteItem = { id: genId(), content, createdAt: Date.now(), updatedAt: Date.now() };
    const updated = [...notes, newNote];
    setNotes(updated);
    propagate(updated);
    setIsAdding(false);
  };

  const updateNote = (id: string, content: string) => {
    const updated = notes.map((n) => n.id === id ? { ...n, content, updatedAt: Date.now() } : n);
    setNotes(updated);
    propagate(updated);
    setEditingId(null);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    propagate(updated);
  };

  const editingNote = notes.find((n) => n.id === editingId);

  const notesHeader = (
    <div className="notes-header">
      <span className="notes-header-icon">{label ? '📋' : '📝'}</span>
      <span className="notes-header-title">{label ?? 'Notes'}</span>
      {notes.length > 0 && (
        <span className="notes-header-count">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
      )}
      {!isAdding && !editingId && (
        <button
          type="button"
          onClick={() => setIsFullscreen(value => !value)}
          autoFocus={isFullscreen}
          className="notes-expand-btn"
          aria-label={isFullscreen ? 'Exit expanded notes view' : 'Expand notes'}
          title={isFullscreen ? 'Exit expanded view' : 'Expand notes'}>
          {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          <span>{isFullscreen ? 'Collapse' : 'Expand'}</span>
        </button>
      )}
    </div>
  );

  const notesBody = (
    <div className={isFullscreen ? 'notes-fullscreen-scroll' : undefined}>
      {notes.length === 0 && !isAdding ? (
        <div className="notes-empty">
          <span className="notes-empty-icon">🗒️</span>
          <span>No notes yet.</span>
          <span style={{ opacity: 0.5 }}>Click below to add your first note.</span>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map((note, i) =>
            editingId === note.id ? (
              <div key={note.id} className="note-edit-wrapper">
                <NoteEditor
                  initialValue={note.content}
                  onSave={(content) => updateNote(note.id, content)}
                  onCancel={() => setEditingId(null)}
                  isEdit
                />
              </div>
            ) : (
              <NoteCard
                key={note.id}
                note={note}
                index={i}
                onEdit={(id) => { setEditingId(id); setIsAdding(false); }}
                onDelete={deleteNote}
              />
            )
          )}
        </div>
      )}

      {isAdding ? (
        <NoteEditor
          placeholder={placeholder}
          onSave={addNote}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        !editingId && (
          <button
            className="notes-add-btn"
            onClick={() => { setIsAdding(true); setEditingId(null); }}
            type="button">
            <span className="notes-add-btn-icon">+</span>
            Add New Note
          </button>
        )
      )}
    </div>
  );

  const notesRoot = (
    <div className={`notes-root${isFullscreen ? ' notes-root-fullscreen' : ''}`}>
      {notesHeader}
      {notesBody}
    </div>
  );

  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(
      <div
        className="notes-fullscreen-overlay"
        onMouseDown={event => {
          if (event.target === event.currentTarget) setIsFullscreen(false);
        }}>
        <section className="notes-fullscreen-panel" role="dialog" aria-modal="true" aria-label={`${label ?? 'Notes'} expanded view`}>
          {notesRoot}
        </section>
      </div>,
      document.body,
    );
  }

  return notesRoot;
}
