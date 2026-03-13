import { useLayoutEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { renderMarkdown } from './utils';

hljs.configure({ ignoreUnescapedHTML: true });

export default function MarkdownPreview({ content, empty }: { content: string; empty?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const rendered = renderMarkdown(content);

    useLayoutEffect(() => {
        ref.current?.querySelectorAll('code.md-code-block').forEach((block) => {
            delete (block as HTMLElement).dataset.highlighted;
            hljs.highlightElement(block as HTMLElement);
        });
    });

    if (!rendered)
        return <div className="notes-preview-empty">{empty ?? 'Nothing to preview…'}</div>;

    return (
        <div
            ref={ref}
            className="notes-markdown-body"
            dangerouslySetInnerHTML={{ __html: rendered }}
        />
    );
} 