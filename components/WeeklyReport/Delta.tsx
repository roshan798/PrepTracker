export default function Delta({ current, prev, unit = '' }: { current: number; prev: number; unit?: string }) {
    if (prev === 0 && current === 0) return null;
    const diff = current - prev;
    const pct = prev > 0 ? Math.round((diff / prev) * 100) : 100;
    if (diff === 0) return <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>same</span>;
    return (
        <span style={{
            fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
            color: diff > 0 ? '#10b981' : '#ef4444',
        }}>
            {diff > 0 ? '↑' : '↓'} {Math.abs(pct)}%{unit}
        </span>
    );
}