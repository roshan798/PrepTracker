import { NoteItem } from "./types";

export function renderMarkdown(raw: string): string {
    if (!raw.trim()) return '';

    let html = raw;

    // Escape HTML entities first (security)
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Fenced code blocks  ```lang\n...\n```
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_m, lang, code) => {
        const langAttr = lang ? ` data-lang="${lang}"` : '';
        return `<pre class="md-pre"${langAttr}><code class="md-code-block">${code.trim()}</code></pre>`;
    });

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');

    // Headings
    html = html.replace(/^###### (.+)$/gm, '<h6 class="md-h6">$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5 class="md-h5">$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

    // Horizontal rules
    html = html.replace(/^[-*_]{3,}$/gm, '<hr class="md-hr" />');

    // Unordered lists (support -, *, +)
    html = html.replace(/^([ \t]*)([-*+]) (.+)$/gm, (_, indent, _marker, text) => {
        const depth = Math.floor(indent.length / 2);
        return `<li class="md-li" data-depth="${depth}">• ${text}</li>`;
    });
    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (block) => `<ul class="md-ul">${block}</ul>`);

    // Ordered lists
    html = html.replace(/^(\d+)\. (.+)$/gm, (_m, num, text) => `<li class="md-li md-li-ordered" value="${num}">${text}</li>`);
    html = html.replace(/(<li class="md-li md-li-ordered"[^>]*>.*<\/li>\n?)+/g, (block) => `<ol class="md-ol">${block}</ol>`);

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');

    // Bold + italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="md-bold">$1</strong>');

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em class="md-italic">$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em class="md-italic">$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del class="md-del">$1</del>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="md-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs — wrap consecutive non-block lines
    const lines = html.split('\n');
    const result: string[] = [];
    let paraLines: string[] = [];

    const BLOCK_TAGS = /^<(h[1-6]|ul|ol|li|pre|blockquote|hr)/;
    const isBlock = (line: string) => BLOCK_TAGS.test(line.trim());

    const flushPara = () => {
        if (paraLines.length) {
            const inner = paraLines.join('<br />');
            if (inner.trim()) result.push(`<p class="md-p">${inner}</p>`);
            paraLines = [];
        }
    };

    for (const line of lines) {
        if (isBlock(line)) {
            flushPara();
            result.push(line);
        } else if (line.trim() === '') {
            flushPara();
        } else {
            paraLines.push(line);
        }
    }
    flushPara();

    return result.join('\n');
}


export function genId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}


export function parseValue(value: string): NoteItem[] {
    if (!value?.trim()) return [];
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed as NoteItem[];
    } catch {
        // Not JSON — ignore (blank slate)
    }
    return [];
}

/** Serialize NoteItems to a JSON string for onChange */
export function serializeNotes(notes: NoteItem[]): string {
    return JSON.stringify(notes);
}

/** Build a synthetic textarea ChangeEvent */
export function syntheticEvent(value: string): React.ChangeEvent<HTMLTextAreaElement> {
    const el = document.createElement('textarea');
    el.value = value;
    return { target: el, currentTarget: el } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
}