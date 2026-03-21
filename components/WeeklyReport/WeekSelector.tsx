import { getWeekLabel } from "@/lib/utils";

export default function WeekSelector({ weeksAgo, onChange }: { weeksAgo: number; onChange: (n: number) => void }) {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => onChange(weeksAgo + 1)}
                style={{
                    padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                }}
            >←</button>
            <span style={{
                minWidth: 120, textAlign: 'center',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                color: 'var(--text-primary)', fontWeight: 700,
            }}>
                {getWeekLabel(weeksAgo)}
            </span>
            <button
                onClick={() => onChange(Math.max(0, weeksAgo - 1))}
                disabled={weeksAgo === 0}
                style={{
                    padding: '4px 10px', borderRadius: 8,
                    cursor: weeksAgo === 0 ? 'not-allowed' : 'pointer',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    color: weeksAgo === 0 ? 'var(--border)' : 'var(--text-secondary)',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                    opacity: weeksAgo === 0 ? 0.4 : 1,
                }}
            >→</button>
        </div>
    );
}
