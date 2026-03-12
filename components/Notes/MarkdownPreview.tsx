import { renderMarkdown } from "./utils";

export default function MarkdownPreview({ content, empty }: { content: string; empty?: string }) {
    const rendered = renderMarkdown(content);
    if (!rendered)
        return (
            <div className="notes-preview-empty">{empty ?? 'Nothing to preview…'}</div>
        );
    return (
        <div
            className="notes-markdown-body"
            dangerouslySetInnerHTML={{ __html: rendered }}
        />
    );
}