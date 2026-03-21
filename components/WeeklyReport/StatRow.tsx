export default function StatRow({ icon, label, value, accent, prev }: {
    icon: string; label: string; value: string; accent: string; prev?: number; current?: number;
}) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 12,
            background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
        }}>
            <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${accent}18`, border: `1px solid ${accent}30`,
                fontSize: 15,
            }}>{icon}</div>
            <div className="flex-1">
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: accent, lineHeight: 1.2 }}>{value}</div>
            </div>
        </div>
    );
}