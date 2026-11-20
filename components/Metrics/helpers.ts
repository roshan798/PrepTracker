// ─── Helpers ──────────────────────────────────────────────────────────────────

import { DailyMetric, MetricsState, Mood, PeriodSummary, ReviewEvent, StudySession } from "./types";
import type { Roadmap } from "@/lib/types";

const MOODS: Mood[] = ['great', 'good', 'okay', 'tired', 'stressed'];
const REVIEW_RATINGS = ['again', 'hard', 'good', 'easy'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function nonNegativeNumber(value: unknown, fallback = 0): number {
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function stringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function normalizeSession(value: unknown): StudySession | null {
    if (!isRecord(value) ||
        typeof value.id !== 'string' ||
        typeof value.startTime !== 'string' ||
        typeof value.endTime !== 'string' ||
        typeof value.durationMinutes !== 'number' ||
        !Number.isFinite(value.durationMinutes) ||
        value.durationMinutes < 0
    ) return null;

    return {
        id: value.id,
        startTime: value.startTime,
        endTime: value.endTime,
        durationMinutes: value.durationMinutes,
        topic: typeof value.topic === 'string' ? value.topic : undefined,
        roadmapId: typeof value.roadmapId === 'string' ? value.roadmapId : undefined,
        topicId: typeof value.topicId === 'string' ? value.topicId : undefined,
    };
}

function normalizeReview(value: unknown): ReviewEvent | null {
    if (!isRecord(value) ||
        typeof value.id !== 'string' ||
        typeof value.problemId !== 'string' ||
        typeof value.roadmapId !== 'string' ||
        typeof value.topicId !== 'string' ||
        typeof value.topicName !== 'string' ||
        typeof value.reviewedAt !== 'string' ||
        !REVIEW_RATINGS.includes(value.rating as typeof REVIEW_RATINGS[number])
    ) return null;

    return {
        id: value.id,
        problemId: value.problemId,
        roadmapId: value.roadmapId,
        topicId: value.topicId,
        topicName: value.topicName,
        rating: value.rating as ReviewEvent['rating'],
        reviewedAt: value.reviewedAt,
    };
}

export function todayStr(): string {
    return localDateStr(new Date());
}

export function localDateStr(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

export function getDateRange(period: 'today' | 'week' | 'month' | 'quarter'): string[] {
    const dates: string[] = [];
    const now = new Date();
    const days = period === 'today' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 90;
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dates.push(localDateStr(d));
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
        confidenceLogged: false,
        mood: 'good',
        moodLogged: false,
        goalsTotal: 0,
        goalTargetSet: false,
        goalsCompleted: 0,
        tasksCompletedAdjustment: 0,
        completedProblemIds: [],
        activityTopics: [],
        reviewEvents: [],
        studyTimeManualAdjustment: 0,
        distractions: 0,
        sessions: [],
    };
}

export function normalizeMetricsState(value: unknown): MetricsState {
    if (!isRecord(value) || !Array.isArray(value.dailyLogs)) {
        throw new Error('Stored study metrics are not in a supported format.');
    }

    const dailyLogs = value.dailyLogs.map((entry): DailyMetric => {
        if (!isRecord(entry) || typeof entry.date !== 'string') {
            throw new Error('A stored daily metric has an invalid date or format.');
        }

        const sessions = Array.isArray(entry.sessions)
            ? entry.sessions.map(normalizeSession).filter((session): session is StudySession => Boolean(session))
            : [];
        const sessionMinutes = sessions.reduce((total, session) => total + session.durationMinutes, 0);
        const totalStudyTime = nonNegativeNumber(entry.totalStudyTime);
        const previousAdjustment = entry.studyTimeManualAdjustment;
        const adjustment = typeof previousAdjustment === 'number' && Number.isFinite(previousAdjustment)
            ? previousAdjustment
            : totalStudyTime - sessionMinutes;
        const goalsTotal = nonNegativeNumber(entry.goalsTotal);
        const reviews = Array.isArray(entry.reviewEvents)
            ? entry.reviewEvents.map(normalizeReview).filter((review): review is ReviewEvent => Boolean(review))
            : [];

        return {
            id: typeof entry.id === 'string' ? entry.id : genId(),
            date: entry.date,
            totalStudyTime: Math.max(0, sessionMinutes + adjustment),
            studyTimeManualAdjustment: adjustment,
            notesCreated: nonNegativeNumber(entry.notesCreated),
            topicsCovered: stringArray(entry.topicsCovered),
            activityTopics: stringArray(entry.activityTopics),
            confidenceScore: Math.min(100, nonNegativeNumber(entry.confidenceScore, 70)),
            confidenceLogged: typeof entry.confidenceLogged === 'boolean' ? entry.confidenceLogged : false,
            mood: MOODS.includes(entry.mood as Mood) ? entry.mood as Mood : 'good',
            moodLogged: typeof entry.moodLogged === 'boolean' ? entry.moodLogged : false,
            goalsTotal: goalsTotal === 5 && entry.goalTargetSet !== true ? 0 : goalsTotal,
            goalTargetSet: entry.goalTargetSet === true,
            goalsCompleted: nonNegativeNumber(entry.goalsCompleted),
            tasksCompletedAdjustment: typeof entry.tasksCompletedAdjustment === 'number' &&
                Number.isFinite(entry.tasksCompletedAdjustment)
                ? entry.tasksCompletedAdjustment
                : 0,
            completedProblemIds: stringArray(entry.completedProblemIds),
            reviewEvents: reviews,
            distractions: nonNegativeNumber(entry.distractions),
            sessions,
        };
    });

    return {
        dailyLogs,
        activeSessionStart: typeof value.activeSessionStart === 'string' ? value.activeSessionStart : null,
    };
}

export function getStudyStreak(logs: DailyMetric[]): number {
    const studyDates = new Set(logs
        .filter(log =>
            log.totalStudyTime > 0 ||
            getTasksCompleted(log) > 0 ||
            log.notesCreated > 0 ||
            (log.reviewEvents?.length ?? 0) > 0
        )
        .map(log => log.date));
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    if (!studyDates.has(localDateStr(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    while (studyDates.has(localDateStr(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

export function getTasksCompleted(log: DailyMetric): number {
    return Math.max(0, log.goalsCompleted + (log.tasksCompletedAdjustment ?? 0));
}

export function getGamificationStats(roadmaps: Roadmap[], logs: DailyMetric[]) {
    let completedTopics = 0;
    let completedProblems = 0;
    for (const roadmap of roadmaps) {
        for (const topic of roadmap.topics) {
            if (topic.status === 'completed') completedTopics++;
            for (const subtopic of topic.subtopics) {
                completedProblems += subtopic.problems.filter(problem => problem.status === 'completed').length;
            }
        }
    }

    const studyMinutes = logs.reduce((total, log) => total + Math.max(log.totalStudyTime, 0), 0);
    const totalXp = completedProblems * 10 + completedTopics * 25 + Math.floor(studyMinutes / 10);
    const level = Math.floor(totalXp / 100) + 1;
    const levelProgress = totalXp % 100;

    return {
        level,
        levelProgress,
        totalXp,
        xpToNextLevel: 100 - levelProgress,
        streak: getStudyStreak(logs),
    };
}

// ─── Compute period summary ────────────────────────────────────────────────────

export function computeSummary(logs: DailyMetric[], dates: string[]): PeriodSummary {
    const relevant = logs.filter(l => dates.includes(l.date));

    const totalStudyMinutes = relevant.reduce((s, l) => s + l.totalStudyTime, 0);
    const sessionMinutes = relevant.reduce(
        (total, log) => total + log.sessions.reduce((sum, session) => sum + session.durationMinutes, 0),
        0,
    );
    const notesCreated = relevant.reduce((s, l) => s + l.notesCreated, 0);
    const confidenceLogs = relevant.filter(log => log.confidenceLogged);
    const avgConfidence = confidenceLogs.length
        ? Math.round(confidenceLogs.reduce((s, l) => s + l.confidenceScore, 0) / confidenceLogs.length)
        : 0;
    const goalsTotal = relevant.reduce((s, l) => s + Math.max(0, l.goalsTotal), 0);
    const goalsCompleted = relevant.reduce((s, l) => s + getTasksCompleted(l), 0);
    const goalsCompletionRate = goalsTotal > 0
        ? Math.min(100, Math.round((goalsCompleted / goalsTotal) * 100))
        : null;

    const topicMap = new Map<string, { count: number; minutes: number }>();
    relevant.forEach(log => {
        const activeTopics = new Set([
            ...log.topicsCovered,
            ...(log.activityTopics ?? []),
        ]);
        activeTopics.forEach(name => {
            const topic = topicMap.get(name) ?? { count: 0, minutes: 0 };
            topic.count++;
            topicMap.set(name, topic);
        });
        log.sessions.forEach(session => {
            if (!session.topic) return;
            const topic = topicMap.get(session.topic) ?? { count: 0, minutes: 0 };
            topic.minutes += session.durationMinutes;
            topicMap.set(session.topic, topic);
        });
    });
    const topTopics = Array.from(topicMap, ([name, values]) => ({ name, ...values }))
        .sort((a, b) => b.minutes - a.minutes || b.count - a.count)
        .slice(0, 6);

    const reviewEvents = relevant.flatMap(log => log.reviewEvents ?? []);
    const successfulReviews = reviewEvents.filter(event =>
        event.rating === 'good' || event.rating === 'easy'
    ).length;
    const studySessions = relevant.reduce((total, log) => total + log.sessions.length, 0);

    // mood distribution
    const moodDistribution: Record<Mood, number> = { great: 0, good: 0, okay: 0, tired: 0, stressed: 0 };
    relevant.filter(log => log.moodLogged).forEach(l => { moodDistribution[l.mood]++; });

    const streak = getStudyStreak(logs);

    return {
        totalStudyMinutes,
        notesCreated,
        avgConfidence,
        confidenceSampleCount: confidenceLogs.length,
        goalsCompletionRate,
        tasksCompleted: goalsCompleted,
        studySessions,
        averageSessionMinutes: studySessions ? Math.round(sessionMinutes / studySessions) : 0,
        reviewCount: reviewEvents.length,
        recallRate: reviewEvents.length
            ? Math.round((successfulReviews / reviewEvents.length) * 100)
            : null,
        topTopics,
        moodDistribution,
        streak,
    };
}
