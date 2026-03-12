'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
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

  return (
    <>
      <div className="notes-root">
        {/* Header */}
        <div className="notes-header">
          {label ? (
            <span className="notes-header-icon">📋</span>
          ) : (
            <span className="notes-header-icon">📝</span>
          )}
          <span className="notes-header-title">{label ?? 'Notes'}</span>
          {notes.length > 0 && (
            <span className="notes-header-count">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
          )}
        </div>

        {/* Notes list */}
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
                    onSave={(c) => updateNote(note.id, c)}
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

        {/* Add note editor / button */}
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
              type="button"
            >
              <span className="notes-add-btn-icon">+</span>
              Add New Note
            </button>
          )
        )}
      </div>
    </>
  );
}
