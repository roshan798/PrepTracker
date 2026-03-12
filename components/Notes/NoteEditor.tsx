import { useEffect, useRef, useState } from "react";
import MarkdownPreview from "./MarkdownPreview";
interface NoteEditorProps {
    initialValue?: string;
    placeholder?: string;
    onSave: (content: string) => void;
    onCancel: () => void;
    isEdit?: boolean;
}

export default function NoteEditor({ initialValue = '', placeholder, onSave, onCancel, isEdit }: NoteEditorProps) {
    const [text, setText] = useState(initialValue);
    const [tab, setTab] = useState<'write' | 'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSave = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSave(trimmed);
    };

    const insertSyntax = (before: string, after = '', placeholder = 'text') => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = text.slice(start, end) || placeholder;
        const newText = text.slice(0, start) + before + selected + after + text.slice(end);
        setText(newText);
        setTimeout(() => {
            const cursor = start + before.length + selected.length;
            el.setSelectionRange(cursor, cursor);
            el.focus();
        }, 0);
    };

    const toolbarButtons = [
        { label: 'B', title: 'Bold', action: () => insertSyntax('**', '**', 'bold text') },
        { label: 'I', title: 'Italic', action: () => insertSyntax('*', '*', 'italic text') },
        { label: 'S', title: 'Strikethrough', action: () => insertSyntax('~~', '~~', 'strikethrough') },
        { label: 'H1', title: 'Heading 1', action: () => insertSyntax('# ', '', 'Heading') },
        { label: 'H2', title: 'Heading 2', action: () => insertSyntax('## ', '', 'Heading') },
        { label: '`', title: 'Inline code', action: () => insertSyntax('`', '`', 'code') },
        { label: '```', title: 'Code block', action: () => insertSyntax('```\n', '\n```', 'code here') },
        { label: '>', title: 'Blockquote', action: () => insertSyntax('> ', '', 'quote') },
        { label: '—', title: 'Horizontal rule', action: () => insertSyntax('\n---\n', '') },
        { label: '•', title: 'Bullet list', action: () => insertSyntax('- ', '', 'list item') },
        { label: '1.', title: 'Numbered list', action: () => insertSyntax('1. ', '', 'list item') },
        { label: '🔗', title: 'Link', action: () => insertSyntax('[', '](url)', 'link text') },
    ];

    return (
        <div className="note-editor">
            {/* Toolbar */}
            <div className="note-editor-toolbar">
                {toolbarButtons.map((btn) => (
                    <button
                        key={btn.label}
                        onClick={btn.action}
                        title={btn.title}
                        className="note-toolbar-btn"
                        type="button"
                    >
                        {btn.label}
                    </button>
                ))}
                <div className="note-toolbar-spacer" />
                <button
                    className={`note-tab-btn ${tab === 'write' ? 'active' : ''}`}
                    onClick={() => setTab('write')}
                    type="button"
                >Write</button>
                <button
                    className={`note-tab-btn ${tab === 'preview' ? 'active' : ''}`}
                    onClick={() => setTab('preview')}
                    type="button"
                >Preview</button>
            </div>

            {/* Write / Preview area */}
            {tab === 'write' ? (
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder ?? '# Your note\n\nSupports **Markdown** — headings, lists, `code`, and more…'}
                    className="note-editor-textarea"
                    rows={8}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            handleSave();
                        }
                        if (e.key === 'Escape') onCancel();
                    }}
                />
            ) : (
                <div className="note-editor-preview">
                    <MarkdownPreview content={text} empty="Nothing to preview yet — switch to Write and type something." />
                </div>
            )}

            {/* Actions */}
            <div className="note-editor-footer">
                <span className="note-editor-hint">
                    {tab === 'write' ? <><kbd>Ctrl+Enter</kbd> to save · <kbd>Esc</kbd> to cancel</> : 'Preview mode'}
                </span>
                <div className="note-editor-btns">
                    <button onClick={onCancel} className="note-btn-secondary" type="button">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={!text.trim()}
                        className="note-btn-primary"
                        type="button"
                    >
                        {isEdit ? 'Save Changes' : 'Add Note'}
                    </button>
                </div>
            </div>
        </div>
    );
}