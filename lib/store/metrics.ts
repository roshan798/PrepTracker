import type { DailyMetric, MetricsState } from '@/components/Metrics/types';
import { emptyMetric, normalizeMetricsState, todayStr } from '@/components/Metrics/helpers';

export const METRICS_KEY = 'prepTrackerMetrics';
export const METRICS_UPDATED_EVENT = 'prepTracker:metrics-updated';

export function readMetricsState(): MetricsState {
  const raw = localStorage.getItem(METRICS_KEY);
  if (!raw) return { dailyLogs: [], activeSessionStart: null };
  return normalizeMetricsState(JSON.parse(raw) as unknown);
}

export function writeMetricsState(state: MetricsState): void {
  const normalized = normalizeMetricsState(state);
  localStorage.setItem(METRICS_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(METRICS_UPDATED_EVENT));
}

export function patchMetricForDate(
  date: string,
  patch: (log: DailyMetric) => DailyMetric,
): DailyMetric {
  const state = readMetricsState();
  const existing = state.dailyLogs.find(log => log.date === date);
  const base = existing ?? emptyMetric(date);
  const updated = patch(base);
  writeMetricsState({
    ...state,
    dailyLogs: existing
      ? state.dailyLogs.map(log => log.date === date ? updated : log)
      : [...state.dailyLogs, updated],
  });
  return updated;
}

export function patchTodayMetric(patch: (log: DailyMetric) => DailyMetric): DailyMetric {
  return patchMetricForDate(todayStr(), patch);
}

export function recordProblemCompletion(
  problemKey: string,
  topicName: string,
  date: string,
  completed: boolean,
): void {
  patchMetricForDate(date, log => {
    const completedProblemIds = new Set(log.completedProblemIds ?? []);
    const wasCompleted = completedProblemIds.has(problemKey);
    if (wasCompleted === completed) return log;

    if (completed) completedProblemIds.add(problemKey);
    else completedProblemIds.delete(problemKey);

    const activityTopics = new Set(log.activityTopics ?? []);
    if (completed && topicName) activityTopics.add(topicName);

    return {
      ...log,
      completedProblemIds: Array.from(completedProblemIds),
      goalsCompleted: Math.max(0, log.goalsCompleted + (completed ? 1 : -1)),
      activityTopics: Array.from(activityTopics),
    };
  });
}
