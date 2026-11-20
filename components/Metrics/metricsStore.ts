'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyMetric, MetricsState, Mood, PeriodSummary, StudySession } from './types';
import { emptyMetric, genId, todayStr } from './helpers';

const METRICS_KEY = 'prepTrackerMetrics';


// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMetrics() {
  const [state, setState] = useState<MetricsState>({ dailyLogs: [], activeSessionStart: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(METRICS_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const persist = useCallback((next: MetricsState) => {
    setState(next);
    try { localStorage.setItem(METRICS_KEY, JSON.stringify(next)); } catch {}
  }, []);

  // ── Get or create today's log ────────────────────────────────────────────
  const getTodayLog = useCallback((): DailyMetric => {
    const today = todayStr();
    return state.dailyLogs.find(l => l.date === today) ?? emptyMetric(today);
  }, [state.dailyLogs]);

  // ── Save / upsert a daily log ─────────────────────────────────────────────
  const saveLog = useCallback((log: DailyMetric) => {
    const next = {
      ...state,
      dailyLogs: state.dailyLogs.find(l => l.id === log.id)
        ? state.dailyLogs.map(l => l.id === log.id ? log : l)
        : [...state.dailyLogs, log],
    };
    persist(next);
  }, [state, persist]);

  // ── Timer controls ────────────────────────────────────────────────────────
  const startSession = useCallback(() => {
    persist({ ...state, activeSessionStart: new Date().toISOString() });
  }, [state, persist]);

  const stopSession = useCallback((topic?: string) => {
    if (!state.activeSessionStart) return;
    const start = new Date(state.activeSessionStart);
    const end = new Date();
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);
    const session: StudySession = {
      id: genId(),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      durationMinutes: duration,
      topic,
    };
    const todayLog = getTodayLog();
    const updated: DailyMetric = {
      ...todayLog,
      totalStudyTime: todayLog.totalStudyTime + duration,
      sessions: [...todayLog.sessions, session],
    };
    const next: MetricsState = {
      dailyLogs: state.dailyLogs.find(l => l.id === updated.id)
        ? state.dailyLogs.map(l => l.id === updated.id ? updated : l)
        : [...state.dailyLogs, updated],
      activeSessionStart: null,
    };
    persist(next);
    return duration;
  }, [state, getTodayLog, persist]);

  // ── Auto-increment notes count ────────────────────────────────────────────
  const recordNoteCreated = useCallback((topic?: string) => {
    const log = getTodayLog();
    const updated: DailyMetric = {
      ...log,
      notesCreated: log.notesCreated + 1,
      topicsCovered: topic && !log.topicsCovered.includes(topic)
        ? [...log.topicsCovered, topic]
        : log.topicsCovered,
    };
    saveLog(updated);
  }, [getTodayLog, saveLog]);

  const recordStudySession = useCallback((durationMinutes: number, startTime: string, topic: string) => {
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      throw new RangeError('Study session duration must be a positive whole number of minutes.');
    }

    let latestState: MetricsState;
    try {
      const raw = localStorage.getItem(METRICS_KEY);
      latestState = raw ? JSON.parse(raw) as MetricsState : state;
    } catch (error) {
      throw new Error('Unable to read study metrics before recording the focus session.', { cause: error });
    }
    if (!Array.isArray(latestState.dailyLogs)) {
      throw new Error('Study metrics are in an invalid format; the focus session was not recorded.');
    }

    const today = todayStr();
    const existing = latestState.dailyLogs.find(log => log.date === today);
    const todayLog = existing ?? emptyMetric(today);
    const endedAt = new Date().toISOString();
    const session: StudySession = {
      id: genId(),
      startTime,
      endTime: endedAt,
      durationMinutes,
      topic,
    };
    const updated: DailyMetric = {
      ...todayLog,
      totalStudyTime: todayLog.totalStudyTime + durationMinutes,
      sessions: [...(todayLog.sessions ?? []), session],
    };
    const next: MetricsState = {
      ...latestState,
      dailyLogs: existing
        ? latestState.dailyLogs.map(log => log.id === existing.id ? updated : log)
        : [...latestState.dailyLogs, updated],
    };

    try {
      localStorage.setItem(METRICS_KEY, JSON.stringify(next));
    } catch (error) {
      throw new Error('Unable to save the completed focus session to study metrics.', { cause: error });
    }
    setState(next);
  }, [state]);

  // ── Export ────────────────────────────────────────────────────────────────
  const exportCSV = useCallback(() => {
    const headers = ['date', 'studyMinutes', 'notes', 'confidence', 'mood', 'goalsCompleted', 'goalsTotal'];
    const rows = state.dailyLogs.map(l =>
      [l.date, l.totalStudyTime, l.notesCreated, l.confidenceScore, l.mood, l.goalsCompleted, l.goalsTotal].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'preptracker-metrics.csv'; a.click();
  }, [state.dailyLogs]);

  return {
    hydrated,
    logs: state.dailyLogs,
    activeSessionStart: state.activeSessionStart,
    getTodayLog,
    saveLog,
    startSession,
    stopSession,
    recordNoteCreated,
    recordStudySession,
    exportCSV,
  };
}
