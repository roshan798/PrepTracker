// ─── Helpers ──────────────────────────────────────────────────────────────────

import { DailyMetric, Mood, PeriodSummary } from "./types";

export function todayStr(): string {
    return new Date().toISOString().split('T')[0];
}

export function genId(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatMinutes(mins: number): string {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getDateRange(period: 'today' | 'week' | 'month'): string[] {
    const dates: string[] = [];
    const now = new Date();
    let days = period === 'today' ? 1 : period === 'week' ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
}

export function emptyMetric(date: string): DailyMetric {
    return {
        id: genId(),
        date,
        totalStudyTime: 0,
        notesCreated: 0,
        topicsCovered: [],
        confidenceScore: 70,
        mood: 'good',
        goalsTotal: 5,
        goalsCompleted: 0,
        distractions: 0,
        sessions: [],
    };
}

// ─── Compute period summary ────────────────────────────────────────────────────

export function computeSummary(logs: DailyMetric[], dates: string[]): PeriodSummary {
    const relevant = logs.filter(l => dates.includes(l.date));

    const totalStudyMinutes = relevant.reduce((s, l) => s + l.totalStudyTime, 0);
    const notesCreated = relevant.reduce((s, l) => s + l.notesCreated, 0);
    const avgConfidence = relevant.length
        ? Math.round(relevant.reduce((s, l) => s + l.confidenceScore, 0) / relevant.length)
        : 0;
    const goalsTotal = relevant.reduce((s, l) => s + l.goalsTotal, 0);
    const goalsCompleted = relevant.reduce((s, l) => s + l.goalsCompleted, 0);
    const goalsCompletionRate = goalsTotal > 0 ? Math.round((goalsCompleted / goalsTotal) * 100) : 0;

    // topic frequency
    const topicMap: Record<string, number> = {};
    relevant.forEach(l => l.topicsCovered.forEach(t => { topicMap[t] = (topicMap[t] ?? 0) + 1; }));
    const topTopics = Object.entries(topicMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }));

    // mood distribution
    const moodDistribution: Record<Mood, number> = { great: 0, good: 0, okay: 0, tired: 0, stressed: 0 };
    relevant.forEach(l => { moodDistribution[l.mood]++; });

    // streak — consecutive days with study time > 0
    const sortedAll = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    const today = todayStr();
    for (let i = 0; i < sortedAll.length; i++) {
        const expected = new Date();
        expected.setDate(expected.getDate() - i);
        const exp = expected.toISOString().split('T')[0];
        const log = sortedAll.find(l => l.date === exp);
        if (log && log.totalStudyTime > 0) streak++;
        else if (exp !== today) break;
    }

    return { totalStudyMinutes, notesCreated, avgConfidence, goalsCompletionRate, topTopics, moodDistribution, streak };
}
