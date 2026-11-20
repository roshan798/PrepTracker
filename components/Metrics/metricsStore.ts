'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DailyMetric, MetricsState, ReviewEvent, StudySession } from './types';
import {
  emptyMetric,
  genId,
  getTasksCompleted,
  localDateStr,
  normalizeMetricsState,
  todayStr,
} from './helpers';
import {
  METRICS_UPDATED_EVENT,
  patchMetricForDate,
  readMetricsState,
  writeMetricsState,
} from '@/lib/store/metrics';

function sumSessionMinutes(sessions: StudySession[]): number {
  return sessions.reduce((total, session) => total + session.durationMinutes, 0);
}

function mergeActivityTopics(...topicLists: (string[] | undefined)[]): string[] {
  return Array.from(new Set(topicLists.flatMap(topics => topics ?? []).filter(Boolean)));
}

function upsertDailyLog(state: MetricsState, log: DailyMetric): MetricsState {
  const existing = state.dailyLogs.find(item => item.date === log.date);
  return {
    ...state,
    dailyLogs: existing
      ? state.dailyLogs.map(item => item.date === log.date ? log : item)
      : [...state.dailyLogs, log],
  };
}

function addSession(log: DailyMetric, session: StudySession): DailyMetric {
  const previousSessionMinutes = sumSessionMinutes(log.sessions);
  const adjustment = log.studyTimeManualAdjustment ?? log.totalStudyTime - previousSessionMinutes;
  const sessions = [...log.sessions, session];
  const totalStudyTime = Math.max(0, sumSessionMinutes(sessions) + adjustment);

  return {
    ...log,
    sessions,
    totalStudyTime,
    studyTimeManualAdjustment: adjustment,
    activityTopics: session.topic
      ? mergeActivityTopics(log.activityTopics, [session.topic])
      : log.activityTopics,
  };
}

export function useMetrics() {
  const [state, setState] = useState<MetricsState>({ dailyLogs: [], activeSessionStart: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => {
      try {
        setState(readMetricsState());
      } catch (error) {
        console.error('Failed to load study metrics:', error);
      }
    };

    refresh();
    setHydrated(true);
    window.addEventListener(METRICS_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(METRICS_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const persist = useCallback((next: MetricsState) => {
    const normalized = normalizeMetricsState(next);
    setState(normalized);
    try {
      writeMetricsState(normalized);
    } catch (error) {
      console.error('Failed to save study metrics:', error);
    }
  }, []);

  const getLogForDate = useCallback((date: string): DailyMetric => (
    state.dailyLogs.find(log => log.date === date) ?? emptyMetric(date)
  ), [state.dailyLogs]);

  const todayLog = useMemo(() => getLogForDate(todayStr()), [getLogForDate]);
  const getTodayLog = useCallback(() => todayLog, [todayLog]);

  const saveLog = useCallback((log: DailyMetric) => {
    try {
      const latestState = readMetricsState();
      const existing = latestState.dailyLogs.find(item => item.date === log.date);
      const sessions = existing?.sessions ?? log.sessions;
      const sessionMinutes = sumSessionMinutes(sessions);
      const merged: DailyMetric = {
        ...(existing ?? log),
        ...log,
        id: existing?.id ?? log.id,
        notesCreated: existing?.notesCreated ?? log.notesCreated,
        goalsCompleted: existing?.goalsCompleted ?? log.goalsCompleted,
        completedProblemIds: existing?.completedProblemIds ?? log.completedProblemIds ?? [],
        reviewEvents: existing?.reviewEvents ?? log.reviewEvents ?? [],
        activityTopics: mergeActivityTopics(existing?.activityTopics, log.activityTopics),
        sessions,
        studyTimeManualAdjustment: log.totalStudyTime - sessionMinutes,
      };
      persist(upsertDailyLog(latestState, merged));
    } catch (error) {
      console.error('Failed to save the corrected daily metric:', error);
    }
  }, [persist]);

  const startSession = useCallback(() => {
    try {
      const latestState = readMetricsState();
      if (latestState.activeSessionStart) return;
      persist({ ...latestState, activeSessionStart: new Date().toISOString() });
    } catch (error) {
      console.error('Failed to start the study timer:', error);
    }
  }, [persist]);

  const stopSession = useCallback((topic?: string): DailyMetric | undefined => {
    try {
      const latestState = readMetricsState();
      const sessionStart = latestState.activeSessionStart ?? state.activeSessionStart;
      if (!sessionStart) return undefined;

      const start = new Date(sessionStart);
      const end = new Date();
      const durationMinutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
      const session: StudySession = {
        id: genId(),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        durationMinutes,
        topic,
      };
      const date = localDateStr(start);
      const existing = latestState.dailyLogs.find(log => log.date === date);
      const base = existing ?? emptyMetric(date);
      const updatedLog = addSession(base, session);

      persist({
        ...upsertDailyLog(latestState, updatedLog),
        activeSessionStart: null,
      });
      return updatedLog;
    } catch (error) {
      console.error('Failed to stop and record the study timer:', error);
      return undefined;
    }
  }, [persist, state.activeSessionStart]);

  const recordNoteCreated = useCallback((topic?: string) => {
    try {
      patchMetricForDate(todayStr(), log => ({
        ...log,
        notesCreated: log.notesCreated + 1,
        activityTopics: topic
          ? mergeActivityTopics(log.activityTopics, [topic])
          : log.activityTopics,
      }));
    } catch (error) {
      console.error('Failed to record the created note in study metrics:', error);
    }
  }, []);

  const recordStudySession = useCallback((
    durationMinutes: number,
    startTime: string,
    topic?: string,
    topicReference?: { roadmapId: string; topicId: string },
  ) => {
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      throw new RangeError('Study session duration must be a positive whole number of minutes.');
    }
    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) {
      throw new RangeError('Study session start time must be a valid date.');
    }

    try {
      const latestState = readMetricsState();
      const date = localDateStr(start);
      const existing = latestState.dailyLogs.find(log => log.date === date);
      const base = existing ?? emptyMetric(date);
      const session: StudySession = {
        id: genId(),
        startTime: start.toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes,
        topic,
        roadmapId: topicReference?.roadmapId,
        topicId: topicReference?.topicId,
      };
      const updatedLog = addSession(base, session);
      persist(upsertDailyLog(latestState, updatedLog));
    } catch (error) {
      throw new Error('Unable to record the completed study session.', { cause: error });
    }
  }, [persist]);

  const recordReview = useCallback((review: Omit<ReviewEvent, 'id' | 'reviewedAt'>) => {
    try {
      const reviewedAt = new Date().toISOString();
      patchMetricForDate(todayStr(), log => ({
        ...log,
        reviewEvents: [
          ...(log.reviewEvents ?? []),
          { ...review, id: genId(), reviewedAt },
        ],
        activityTopics: mergeActivityTopics(log.activityTopics, [review.topicName]),
      }));
    } catch (error) {
      console.error('Failed to record the review result in study metrics:', error);
    }
  }, []);

  const exportCSV = useCallback(() => {
    const headers = [
      'date',
      'studyMinutes',
      'studySessions',
      'tasksCompleted',
      'dailyTarget',
      'notes',
      'confidence',
      'mood',
      'reviews',
      'reviewRecallRate',
      'topics',
      'distractions',
    ];
    const rows = state.dailyLogs.map(log => {
      const reviews = log.reviewEvents ?? [];
      const successfulReviews = reviews.filter(review =>
        review.rating === 'good' || review.rating === 'easy'
      ).length;
      const recallRate = reviews.length
        ? Math.round((successfulReviews / reviews.length) * 100)
        : '';
      const topics = mergeActivityTopics(log.topicsCovered, log.activityTopics).join('; ');
      const values = [
        log.date,
        log.totalStudyTime,
        log.sessions.length,
        getTasksCompleted(log),
        log.goalsTotal || '',
        log.notesCreated,
        log.confidenceLogged ? log.confidenceScore : '',
        log.moodLogged ? log.mood : '',
        reviews.length,
        recallRate,
        topics,
        log.distractions,
      ];
      return values.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'preptracker-metrics.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }, [state.dailyLogs]);

  return {
    hydrated,
    logs: state.dailyLogs,
    activeSessionStart: state.activeSessionStart,
    getTodayLog,
    getLogForDate,
    saveLog,
    startSession,
    stopSession,
    recordNoteCreated,
    recordStudySession,
    recordReview,
    exportCSV,
  };
}
