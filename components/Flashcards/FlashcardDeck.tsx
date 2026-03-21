'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppState } from '@/lib/store';
import { Flashcard, SessionResult } from './types';
import { shuffle } from '@/lib/utils';
import { extractCards, loadResults, saveResult } from './util';
import Summary from './Summary';
import FilterBar from './FilterBar';
import Card from './Card';


export default function FlashcardDeck() {
    const { roadmaps } = useAppState();

    // Filters
    const [selectedRoadmap, setSelectedRoadmap] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [onlyWithNotes, setOnlyWithNotes] = useState(true);

    // Session state
    const [deck, setDeck] = useState<Flashcard[]>([]);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState<Set<string>>(new Set());
    const [review, setReview] = useState<Set<string>>(new Set());
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [results, setResults] = useState<SessionResult[]>([]);

    useEffect(() => { setResults(loadResults()); }, []);

    const allCards = extractCards(roadmaps);

    const filteredCards = allCards.filter(c => {
        if (selectedRoadmap && !roadmaps.find(r => r.id === selectedRoadmap)?.topics.some(t => t.subtopics.some(s => s.problems.some(p => p.id === c.problemId)))) return false;
        if (difficulty && c.difficulty !== difficulty) return false;
        return true;
    });

    const handleFilterChange = (k: string, v: any) => {
        if (k === 'roadmap') setSelectedRoadmap(v);
        if (k === 'difficulty') setDifficulty(v);
        if (k === 'onlyWithNotes') setOnlyWithNotes(v);
    };

    const startSession = () => {
        const shuffled = shuffle(filteredCards) as Flashcard[];
        setDeck(shuffled);
        setIndex(0);
        setFlipped(false);
        setKnown(new Set());
        setReview(new Set());
        setStarted(true);
        setFinished(false);
        setStartTime(Date.now());
    };

    const markCard = useCallback((gotIt: boolean) => {
        const card = deck[index];
        if (gotIt) {
            setKnown(p => new Set([...p, card.problemId]));
            setReview(p => { const n = new Set(p); n.delete(card.problemId); return n; });
        } else {
            setReview(p => new Set([...p, card.problemId]));
            setKnown(p => { const n = new Set(p); n.delete(card.problemId); return n; });
        }

        if (index + 1 >= deck.length) {
            // Session done
            const dur = Math.round((Date.now() - startTime) / 1000);
            const result: SessionResult = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                total: deck.length,
                known: known.size + (gotIt ? 1 : 0),
                review: review.size + (gotIt ? 0 : 1),
                durationSeconds: dur,
            };
            saveResult(result);
            setResults(loadResults());
            setFinished(true);
        } else {
            setIndex(p => p + 1);
            setFlipped(false);
        }
    }, [deck, index, known, review, startTime]);

    // Keyboard controls
    useEffect(() => {
        if (!started || finished) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(p => !p); }
            if (e.key === 'ArrowRight' && flipped) markCard(true);
            if (e.key === 'ArrowLeft' && flipped) markCard(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [started, finished, flipped, markCard]);

    const card = deck[index];
    const progress = deck.length > 0 ? ((index) / deck.length) * 100 : 0;

    // ── Not started ──
    if (!started || finished) {
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
                        🃏 Flashcards
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, marginTop: 4 }}>
                        {allCards.length} cards available from your notes
                    </p>
                </div>

                {finished && (
                    <div className="mb-8">
                        <Summary
                            known={known.size} review={review.size}
                            total={deck.length}
                            duration={Math.round((Date.now() - startTime) / 1000)}
                            onRestart={startSession}
                            onExit={() => {
                                setFinished(false)
                                setStarted(false);
                            }}
                        />
                    </div>
                )}

                {!finished && (
                    <>
                        <FilterBar
                            roadmaps={roadmaps}
                            selectedRoadmap={selectedRoadmap}
                            difficulty={difficulty}
                            onlyWithNotes={onlyWithNotes}
                            onChange={handleFilterChange}
                        />

                        <div style={{
                            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                            borderRadius: 16, padding: 24, marginBottom: 24,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div>
                                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--accent-cyan)' }}>
                                    {filteredCards.length}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    cards ready
                                </div>
                            </div>
                            <button
                                onClick={startSession}
                                disabled={filteredCards.length === 0}
                                style={{
                                    padding: '12px 28px', borderRadius: 12, border: 'none',
                                    background: filteredCards.length === 0 ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, var(--accent-cyan), #0891b2)',
                                    color: filteredCards.length === 0 ? 'var(--text-secondary)' : '#fff',
                                    fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
                                    cursor: filteredCards.length === 0 ? 'not-allowed' : 'pointer',
                                    boxShadow: filteredCards.length > 0 ? '0 4px 14px rgba(0,229,255,0.25)' : 'none',
                                }}
                            >
                                Start Session →
                            </button>
                        </div>

                        {/* Keyboard hint */}
                        <div style={{
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                            borderRadius: 12, padding: '12px 16px', marginBottom: 24,
                            display: 'flex', gap: 20, flexWrap: 'wrap',
                        }}>
                            {[['Space', 'Flip card'], ['→', 'Got it ✓'], ['←', 'Review again']].map(([k, v]) => (
                                <div key={k} className="flex items-center gap-2">
                                    <kbd style={{
                                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                                        borderRadius: 6, padding: '2px 8px', fontSize: 11,
                                        fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)',
                                    }}>{k}</kbd>
                                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Past sessions */}
                {results.length > 0 && (
                    <div>
                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                            Past Sessions
                        </h3>
                        <div className="space-y-2">
                            {results.slice(0, 5).map(r => (
                                <div key={r.id} style={{
                                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                                    borderRadius: 12, padding: '12px 16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <div>
                                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                                            {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                                            {r.total} cards · {Math.floor(r.durationSeconds / 60)}m {r.durationSeconds % 60}s
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span style={{ fontSize: 12, color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>✓ {r.known}</span>
                                        <span style={{ fontSize: 12, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>↺ {r.review}</span>
                                        <span style={{ fontSize: 12, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                                            {Math.round((r.known / r.total) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Active session ──
    return (
        <div className="flex flex-col items-center p-6" style={{ minHeight: '80vh' }}>
            {/* Progress bar */}
            <div style={{ width: '100%', maxWidth: 680, marginBottom: 20 }}>
                <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {index + 1} / {deck.length}
                    </span>
                    <div className="flex gap-3 items-center">
                        <span style={{ fontSize: 11, color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>✓ {known.size}</span>
                        <span style={{ fontSize: 11, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>↺ {review.size}</span>

                        {/* ── Stop button ── */}
                        <button
                            onClick={() => {
                                const dur = Math.round((Date.now() - startTime) / 1000);
                                const result: SessionResult = {
                                    id: Date.now().toString(),
                                    date: new Date().toISOString(),
                                    total: index, // only cards reviewed so far
                                    known: known.size,
                                    review: review.size,
                                    durationSeconds: dur,
                                };
                                if (index > 0) saveResult(result); // only save if at least 1 card reviewed
                                setResults(loadResults());
                                setStarted(false);
                                setFinished(false);
                            }}
                            style={{
                                padding: '3px 10px', borderRadius: 8, cursor: 'pointer',
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                color: '#f87171',
                                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                            }}
                        >
                            ✕ Stop
                        </button>
                    </div>
                </div>
                {/* progress bar stays the same */}
                <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                    <div style={{
                        height: '100%', borderRadius: 2,
                        background: 'linear-gradient(90deg, var(--accent-cyan), #0891b2)',
                        width: `${progress}%`, transition: 'width 0.3s ease',
                    }} />
                </div>
            </div>

            {/* Card */}
            {card && <Card card={card} flipped={flipped} onFlip={() => setFlipped(p => !p)} />}

            {/* Action buttons — only show after flip */}
            <div style={{
                display: 'flex', gap: 16, marginTop: 28,
                opacity: flipped ? 1 : 0, transition: 'opacity 0.3s',
                pointerEvents: flipped ? 'auto' : 'none',
            }}>
                <button
                    onClick={() => markCard(false)}
                    style={{
                        padding: '12px 28px', borderRadius: 12, cursor: 'pointer',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#f87171', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
                    }}
                >
                    ← Review Again
                </button>
                <button
                    onClick={() => markCard(true)}
                    style={{
                        padding: '12px 28px', borderRadius: 12, cursor: 'pointer',
                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                        color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
                    }}
                >
                    Got it ✓ →
                </button>
            </div>

            {/* Flip hint */}
            {!flipped && (
                <p style={{ marginTop: 20, fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', opacity: 0.5 }}>
                    Click card or press Space to reveal your notes
                </p>
            )}
        </div>
    );
}
