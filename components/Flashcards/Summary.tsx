export default function Summary({ known, review, total, duration, onRestart, onExit }: {
    known: number; review: number; total: number; duration: number;
    onRestart: () => void; onExit: () => void;
}) {
    const pct = Math.round((known / total) * 100);
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;

    return (
        <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 40, textAlign: 'center', maxWidth: 480, margin: '0 auto',
        }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
                {pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                Session Complete!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, marginBottom: 32 }}>
                {mins}m {secs}s · {total} cards
            </p>

            <div className="flex gap-4 justify-center mb-8">
                {[
                    { label: 'Got it', value: known, color: '#10b981' },
                    { label: 'Review', value: review, color: '#f59e0b' },
                    { label: 'Score', value: `${pct}%`, color: 'var(--accent-cyan)' },
                ].map(s => (
                    <div key={s.label} style={{
                        flex: 1, padding: '16px 8px', borderRadius: 12,
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    }}>
                        <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <button onClick={onRestart} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12, cursor: 'pointer',
                }}>
                    🔁 Restart
                </button>
                <button onClick={onExit} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-cyan), #0891b2)',
                    color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,229,255,0.25)',
                }}>
                    ✓ Done
                </button>
            </div>
        </div>
    );
}