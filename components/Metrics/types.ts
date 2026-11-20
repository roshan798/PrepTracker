// ─── Metrics Types ────────────────────────────────────────────────────────────

export type Mood = 'great' | 'good' | 'okay' | 'tired' | 'stressed';
export type RecallRating = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewEvent {
  id: string;
  problemId: string;
  roadmapId: string;
  topicId: string;
  topicName: string;
  rating: RecallRating;
  reviewedAt: string;
}

export interface DailyMetric {
  id: string;
  date: string;
  totalStudyTime: number;
  studyTimeManualAdjustment?: number;
  notesCreated: number;
  topicsCovered: string[];
  activityTopics?: string[];
  confidenceScore: number; // 0-100
  confidenceLogged?: boolean;
  mood: Mood;
  moodLogged?: boolean;
  goalsTotal: number; // optional daily target; zero means unset
  goalTargetSet?: boolean;
  goalsCompleted: number; // automatically tracked completed problems
  tasksCompletedAdjustment?: number;
  completedProblemIds?: string[];
  reviewEvents?: ReviewEvent[];
  distractions: number;
  sessions: StudySession[];
}

export interface StudySession {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  topic?: string;
  roadmapId?: string;
  topicId?: string;
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
  confidenceSampleCount: number;
  goalsCompletionRate: number | null;
  tasksCompleted: number;
  studySessions: number;
  averageSessionMinutes: number;
  reviewCount: number;
  recallRate: number | null;
  topTopics: { name: string; count: number; minutes: number }[];
  moodDistribution: Record<Mood, number>;
  streak: number;
}
