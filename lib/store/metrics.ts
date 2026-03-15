import { todayStr } from '@/components/Metrics/helpers';

// ─── Metrics helpers (must be at top — no hoisting for const) ─────────────────

const METRICS_KEY = 'prepTrackerMetrics';

function getTodayMetric() {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    const state = raw ? JSON.parse(raw) : { dailyLogs: [], activeSessionStart: null };
    const today = todayStr();
    const existing = state.dailyLogs.find((l: any) => l.date === today);
    return { state, today, existing };
  } catch { return null; }
}

export function patchTodayMetric(patch: (log: any) => any) {
  const data = getTodayMetric();
  if (!data) return;
  const { state, today, existing } = data;
  const base = existing ?? {
    id: Math.random().toString(36).slice(2),
    date: today,
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
  const updated = patch(base);
  const nextLogs = existing
    ? state.dailyLogs.map((l: any) => l.date === today ? updated : l)
    : [...state.dailyLogs, updated];
  localStorage.setItem(METRICS_KEY, JSON.stringify({ ...state, dailyLogs: nextLogs }));
}
