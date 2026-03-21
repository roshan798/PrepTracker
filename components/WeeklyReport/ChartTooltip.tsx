export default function ChartTooltip({ active, payload, label, unit = '' }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
            {payload.map((p: any, i: number) => (
                <div key={i} style={{ color: p.color }}>{p.value}{unit}</div>
            ))}
        </div>
    );
}