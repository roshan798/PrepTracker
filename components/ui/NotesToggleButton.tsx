import { StickyNote } from "lucide-react";

interface NotesToggleButtonProps {
    value: string;
    showNotes: boolean;
    onToggle: () => void;
    size?: number;
}

export function NotesToggleButton({ value, showNotes, onToggle, size = 14 }: NotesToggleButtonProps) {
    const hasNotes = (() => {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) && parsed.length > 0;
        } catch {
            return false;
        }
    })();

    return (
        <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors relative ${showNotes
                    ? 'text-amber-400'
                    : hasNotes
                        ? 'text-amber-400/60 hover:text-amber-400'
                        : 'hover:opacity-70'
                }`}
            style={{ color: showNotes || hasNotes ? undefined : 'var(--text-secondary)' }}
            title={hasNotes ? 'View notes' : 'Add notes'}
        >
            <StickyNote size={size} />
            {hasNotes && !showNotes && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
        </button>
    );
}