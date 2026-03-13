// ─── Metrics Types ────────────────────────────────────────────────────────────

export type Mood = 'great' | 'good' | 'okay' | 'tired' | 'stressed';

export interface DailyMetric {
  id: string;
  date: string; // YYYY-MM-DD
  totalStudyTime: number; // minutes
  notesCreated: number;
  topicsCovered: string[];
  confidenceScore: number; // 0-100
  mood: Mood;
  goalsTotal: number;
  goalsCompleted: number;
  distractions: number;
  sessions: StudySession[];
}

export interface StudySession {
  id: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  durationMinutes: number;
  topic?: string;
}

export interface MetricsState {
  dailyLogs: DailyMetric[];
  activeSessionStart: string | null; // ISO timestamp or null
}

// Derived/computed types used by dashboard
export interface PeriodSummary {
  totalStudyMinutes: number;
  notesCreated: number;
  avgConfidence: number;
  goalsCompletionRate: number;
  topTopics: { name: string; count: number }[];
  moodDistribution: Record<Mood, number>;
  streak: number;
}
