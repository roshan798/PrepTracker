import { useState } from "react";
import MarkdownPreview from "./MarkdownPreview";
import { NoteItem } from "./types";

interface NoteCardProps {
    note: NoteItem;
    index: number;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function NoteCard({ note, index, onEdit, onDelete }: NoteCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div className="note-card" style={{ animationDelay: `${index * 60}ms` }}>
            <div className="note-card-header">
                <span className="note-card-index">#{index + 1}</span>
                <div className="note-card-actions">
                    <button
                        onClick={() => onEdit(note.id)}
                        className="note-action-btn note-action-edit"
                        title="Edit note"
                        aria-label="Edit note"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                    </button>
                    {confirmDelete ? (
                        <div className="note-confirm-delete">
                            <span>Delete?</span>
                            <button onClick={() => onDelete(note.id)} className="note-action-btn note-action-confirm">Yes</button>
                            <button onClick={() => setConfirmDelete(false)} className="note-action-btn note-action-cancel">No</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="note-action-btn note-action-delete"
                            title="Delete note"
                            aria-label="Delete note"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                            Delete
                        </button>
                    )}
                </div>
            </div>
            <div className="note-card-body">
                <MarkdownPreview content={note.content} empty="(empty note)" />
            </div>
        </div>
    );
}