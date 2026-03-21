import { Roadmap } from "@/lib/types";
import { Flashcard, NoteItem, SessionResult } from "./types";

const RESULTS_KEY = 'prepTrackerFlashcardResults';

export function parseNotes(raw: string): string[] {
    if (!raw || !raw.trim()) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed
                .map((n: NoteItem) => n.content?.trim())
                .filter(Boolean) as string[];
        }
        return [raw];
    } catch {
        return [raw];
    }
}

export function extractCards(roadmaps: Roadmap[]): Flashcard[] {
    const cards: Flashcard[] = [];
    roadmaps.forEach(r => {
        r.topics.forEach(t => {
            t.subtopics.forEach(s => {
                s.problems.forEach(p => {
                    const parsedNote = parseNotes(p.notes);
                    if (p.notes && p.notes.trim().length > 10) {
                        cards.push({
                            problemId: p.id,
                            problemName: p.name,
                            difficulty: p.difficulty,
                            notes: parsedNote,
                            roadmapName: r.name,
                            topicName: t.name,
                        });
                    }
                });
            });
        });
    });
    return cards;
}


export function saveResult(result: SessionResult) {
    try {
        const raw = localStorage.getItem(RESULTS_KEY);
        const existing: SessionResult[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(RESULTS_KEY, JSON.stringify([result, ...existing].slice(0, 20)));
    } catch { }
}

export function loadResults(): SessionResult[] {
    try {
        const raw = localStorage.getItem(RESULTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}