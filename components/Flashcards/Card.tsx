import MarkdownPreview from "../Notes/MarkdownPreview";
import { Flashcard } from "./types";
const DIFFICULTY_COLOR = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
};
export default function Card({ card, flipped, onFlip }: { card: Flashcard; flipped: boolean; onFlip: () => void }) {
    return (
        <div
            onClick={onFlip}
            style={{
                perspective: 1200,
                cursor: 'pointer',
                width: '100%',
                maxWidth: 680,
                minHeight: 340,
            }}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                minHeight: 340,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s cubic-bezier(0.4,0.2,0.2,1)',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
                {/* Front */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: 40, textAlign: 'center',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                }}>
                    <div style={{
                        fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 16,
                    }}>
                        {card.roadmapName} · {card.topicName}
                    </div>
                    <div style={{
                        fontSize: 24, fontWeight: 800, fontFamily: 'Syne, sans-serif',
                        color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 20,
                    }}>
                        {card.problemName}
                    </div>
                    <span style={{
                        fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                        padding: '3px 10px', borderRadius: 6,
                        background: `${DIFFICULTY_COLOR[card.difficulty]}18`,
                        border: `1px solid ${DIFFICULTY_COLOR[card.difficulty]}40`,
                        color: DIFFICULTY_COLOR[card.difficulty],
                    }}>
                        {card.difficulty}
                    </span>
                    <div style={{ marginTop: 32, fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', opacity: 0.5 }}>
                        click or press Space to flip
                    </div>
                </div>

                {/* Back */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    display: 'flex', flexDirection: 'column',
                    padding: 32, overflowY: 'auto',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                }}>
                    <div style={{
                        fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: 12,
                    }}>
                        📝 Your Notes
                    </div>
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {card.notes.map((note, i) => (
                            <div key={i}>
                                {i > 0 && (
                                    <div style={{
                                        height: 1,
                                        background: 'var(--border)',
                                        margin: '16px 0',
                                    }} />
                                )}
                                <MarkdownPreview content={note} empty="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}