import { NoteItem } from "./types";
import katex from 'katex';

export function renderMarkdown(raw: string): string {
    if (!raw.trim()) return '';

    // 1. Extract code blocks FIRST before any other processing
    const codeBlocks: string[] = [];
    let html = raw.replace(/```(\w*)\n?([\s\S]*?)```/g, (_m, lang, code) => {
        const escaped = code.trim()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const langAttr = lang ? ` data-language="${lang}"` : '';
        codeBlocks.push(`<pre class="md-pre"${langAttr}><code class="md-code-block">${escaped}</code></pre>`);
        return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });

    // 2. Extract math SECOND — before HTML escaping so $ signs aren't corrupted
    const mathBlocks: string[] = [];

    // Block math: $$...$$  (must come before inline $...$)
    // Change placeholder format — no underscore
html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_m, expr) => {
    try {
        mathBlocks.push(katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false }));
    } catch {
        mathBlocks.push(`<code class="md-code">${expr}</code>`);
    }
    return `%%MATH${mathBlocks.length - 1}%%`;  // ← no underscore
});

html = html.replace(/\$([^$\n]+?)\$/g, (_m, expr) => {
    try {
        mathBlocks.push(katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false }));
    } catch {
        mathBlocks.push(`<code class="md-code">${expr}</code>`);
    }
    return `%%MATH${mathBlocks.length - 1}%%`;  // ← no underscore
});

    // 3. NOW escape the rest
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 4. All other markdown rules (placeholders are safe from these)
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');
    html = html.replace(/^###### (.+)$/gm, '<h6 class="md-h6">$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5 class="md-h5">$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');
    html = html.replace(/^[-*_]{3,}$/gm, '<hr class="md-hr" />');
    html = html.replace(/^([ \t]*)([-*+]) (.+)$/gm, (_, indent, _marker, text) => {
        const depth = Math.floor(indent.length / 2);
        return `<li class="md-li" data-depth="${depth}">• ${text}</li>`;
    });
    html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (block) => `<ul class="md-ul">${block}</ul>`);
    html = html.replace(/^(\d+)\. (.+)$/gm, (_m, num, text) => `<li class="md-li md-li-ordered" value="${num}">${text}</li>`);
    html = html.replace(/(<li class="md-li md-li-ordered"[^>]*>.*<\/li>\n?)+/g, (block) => `<ol class="md-ol">${block}</ol>`);
    html = html.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="md-bold">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="md-italic">$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em class="md-italic">$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del class="md-del">$1</del>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="md-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 5. Paragraphs — %% lines (code + math placeholders) are block-level, don't wrap in <p>
    const BLOCK_TAGS = /^(<(h[1-6]|ul|ol|li|pre|blockquote|hr)|%%)/;
    const lines = html.split('\n');
    const result: string[] = [];
    let paraLines: string[] = [];

    const flushPara = () => {
        if (paraLines.length) {
            const inner = paraLines.join('<br />');
            if (inner.trim()) result.push(`<p class="md-p">${inner}</p>`);
            paraLines = [];
        }
    };

    for (const line of lines) {
        if (BLOCK_TAGS.test(line.trim()) || line.trim() === '') {
            flushPara();
            if (line.trim()) result.push(line);
        } else {
            paraLines.push(line);
        }
    }
    flushPara();

    // 6. Restore code blocks
    let output = result.join('\n').replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[+i]);

    // 7. Restore math blocks LAST
    // output = output.replace(/%%MATHBLOCK_(\d+)%%/g, (_, i) => mathBlocks[+i]);
    output = output.replace(/%%MATH(\d+)%%/g, (_, i) => mathBlocks[+i]);

    return output;
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