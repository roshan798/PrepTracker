import { Roadmap } from "@/lib/types";

export default function FilterBar({
    roadmaps, selectedRoadmap, difficulty, onlyWithNotes,
    onChange
}: {
    roadmaps: Roadmap[];
    selectedRoadmap: string;
    difficulty: string;
    onlyWithNotes: boolean;
    onChange: (k: string, v: any) => void;
}) {
    const selectStyle = {
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        borderRadius: 10,
        padding: '6px 12px',
        fontSize: 12,
        fontFamily: 'JetBrains Mono, monospace',
        outline: 'none',
        cursor: 'pointer',
    };

    return (
        <div className="flex flex-wrap gap-3 items-center mb-6">
            <select value={selectedRoadmap} onChange={e => onChange('roadmap', e.target.value)} style={selectStyle}>
                <option value="">All Roadmaps</option>
                {roadmaps.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>)}
            </select>

            <select value={difficulty} onChange={e => onChange('difficulty', e.target.value)} style={selectStyle}>
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                <input
                    type="checkbox"
                    checked={onlyWithNotes}
                    onChange={e => onChange('onlyWithNotes', e.target.checked)}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                />
                Notes only
            </label>
        </div>
    );
}