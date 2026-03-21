export interface NoteItem {
    id: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export interface Flashcard {
    problemId: string;
    problemName: string;
    difficulty: 'easy' | 'medium' | 'hard';
    notes: string[];
    roadmapName: string;
    topicName: string;
}

export interface SessionResult {
    id: string;
    date: string;
    total: number;
    known: number;
    review: number;
    durationSeconds: number;
}