'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, Action, Roadmap, Status } from './types';
import { debounce } from './utils';
import { PREDEFINED_ROADMAPS } from '@/data/data';
import { todayStr } from '@/components/Metrics/helpers';

const STORAGE_KEY = 'prepTrackerData';

function getInitialState(): AppState {
  return {
    roadmaps: PREDEFINED_ROADMAPS,
    theme: 'dark',
    lastUpdated: new Date().toISOString(),
  };
}

function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'SET_THEME':
      return { ...state, theme: action.payload, lastUpdated: now };

    case 'ADD_ROADMAP':
      return { ...state, roadmaps: [...state.roadmaps, action.payload], lastUpdated: now };

    case 'DELETE_ROADMAP':
      return { ...state, roadmaps: state.roadmaps.filter(r => r.id !== action.payload), lastUpdated: now };

    case 'UPDATE_ROADMAP_META':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.id
            ? { ...r, name: action.payload.name, description: action.payload.description, updatedAt: now }
            : r
        ),
        lastUpdated: now,
      };

    case 'ADD_TOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? { ...r, topics: [...r.topics, action.payload.topic], updatedAt: now }
            : r
        ),
        lastUpdated: now,
      };

    case 'UPDATE_TOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId ? { ...t, ...action.payload.updates } : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'DELETE_TOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? { ...r, topics: r.topics.filter(t => t.id !== action.payload.topicId), updatedAt: now }
            : r
        ),
        lastUpdated: now,
      };

    case 'ADD_SUBTOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? { ...t, subtopics: [...t.subtopics, action.payload.subtopic] }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'UPDATE_SUBTOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t => {
                if (t.id !== action.payload.topicId) return t;

                const updatedSubtopics = t.subtopics.map(s =>
                  s.id === action.payload.subtopicId ? { ...s, ...action.payload.updates } : s
                );

                const totalS = updatedSubtopics.length;
                const completedS = updatedSubtopics.filter(s => s.status === 'completed').length;
                const inProgressS = updatedSubtopics.filter(s => s.status === 'in-progress').length;

                const topicStatus: Status =
                  totalS > 0 && completedS === totalS ? 'completed'
                    : completedS > 0 || inProgressS > 0 ? 'in-progress'
                      : 'not-started';

                return { ...t, subtopics: updatedSubtopics, status: topicStatus };
              }),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'DELETE_SUBTOPIC':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? { ...t, subtopics: t.subtopics.filter(s => s.id !== action.payload.subtopicId) }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'UPDATE_PROBLEM':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t => {
                if (t.id !== action.payload.topicId) return t;

                const updatedSubtopics = t.subtopics.map(s => {
                  if (s.id !== action.payload.subtopicId) return s;

                  // Update the problem
                  const updatedProblems = s.problems.map(p =>
                    p.id === action.payload.problemId ? { ...p, ...action.payload.updates } : p
                  );

                  // Auto-derive subtopic status
                  const total = updatedProblems.length;
                  const completed = updatedProblems.filter(p => p.status === 'completed').length;
                  const inProgress = updatedProblems.filter(p => p.status === 'in-progress').length;

                  const subtopicStatus: Status =
                    total > 0 && completed === total ? 'completed'
                      : completed > 0 || inProgress > 0 ? 'in-progress'
                        : 'not-started';

                  return { ...s, problems: updatedProblems, status: subtopicStatus };
                });

                // Auto-derive topic status from updated subtopics
                const totalS = updatedSubtopics.length;
                const completedS = updatedSubtopics.filter(s => s.status === 'completed').length;
                const inProgressS = updatedSubtopics.filter(s => s.status === 'in-progress').length;

                const topicStatus: Status =
                  totalS > 0 && completedS === totalS ? 'completed'
                    : completedS > 0 || inProgressS > 0 ? 'in-progress'
                      : 'not-started';

                return { ...t, subtopics: updatedSubtopics, status: topicStatus };
              }),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'ADD_PROBLEM':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? {
                    ...t,
                    subtopics: t.subtopics.map(s =>
                      s.id === action.payload.subtopicId
                        ? { ...s, problems: [...s.problems, action.payload.problem] }
                        : s
                    ),
                  }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    case 'DELETE_PROBLEM':
      return {
        ...state,
        roadmaps: state.roadmaps.map(r =>
          r.id === action.payload.roadmapId
            ? {
              ...r,
              topics: r.topics.map(t =>
                t.id === action.payload.topicId
                  ? {
                    ...t,
                    subtopics: t.subtopics.map(s =>
                      s.id === action.payload.subtopicId
                        ? { ...s, problems: s.problems.filter(p => p.id !== action.payload.problemId) }
                        : s
                    ),
                  }
                  : t
              ),
              updatedAt: now,
            }
            : r
        ),
        lastUpdated: now,
      };

    default:
      return state;
  }
}

interface ContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, getInitialState());
  const [hydrated, setHydrated] = React.useState(false);
  // 1. Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: 'LOAD_STATE', payload: JSON.parse(stored) });
    } catch (e) { console.error('Failed to load state:', e); }
    setHydrated(true);
  }, []);
  
  const dispatch = useCallback((action: Action) => {
    if (action.type === 'UPDATE_PROBLEM' && action.payload.updates.status === 'completed') {
      const roadmap = state.roadmaps.find(r => r.id === action.payload.roadmapId);
      const prev = roadmap?.topics
        .find(t => t.id === action.payload.topicId)?.subtopics
        .find(s => s.id === action.payload.subtopicId)?.problems
        .find(p => p.id === action.payload.problemId);
      if (prev?.status !== 'completed') {
        patchTodayMetric(log => ({
          ...log,
          goalsCompleted: log.goalsCompleted + 1,
          goalsTotal: Math.max(log.goalsTotal, log.goalsCompleted + 1),
        }));
      }
    }
    if (action.type === 'UPDATE_PROBLEM' && action.payload.updates.status !== 'completed') {
      const roadmap = state.roadmaps.find(r => r.id === action.payload.roadmapId);
      const prev = roadmap?.topics
        .find(t => t.id === action.payload.topicId)?.subtopics
        .find(s => s.id === action.payload.subtopicId)?.problems
        .find(p => p.id === action.payload.problemId);
      if (prev?.status === 'completed') {
        patchTodayMetric(log => ({ ...log, goalsCompleted: Math.max(0, log.goalsCompleted - 1) }));
      }
    }
    rawDispatch(action);
  }, [state, rawDispatch]);

  useEffect(() => {
    if (!hydrated) return;
    // Record that user was active right now
    patchTodayMetric(log => {
      if (!log.sessionStart) return { ...log, sessionStart: new Date().toISOString() };
      const start = new Date(log.sessionStart).getTime();
      const mins = Math.round((Date.now() - start) / 60000);
      return { ...log, totalStudyTime: mins }; // always reflects elapsed time since first action today
    });
  }, [state.lastUpdated]);
  // Wrap dispatch to auto-track metrics

  // Debounced save to localStorage
  const saveToStorage = useCallback(
    debounce((s: AppState) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (hydrated) {
      saveToStorage(state);
    }
  }, [state, hydrated, saveToStorage]);

  // Apply theme class
  useEffect(() => {
    if (hydrated) {
      const root = document.documentElement;
      if (state.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.theme, hydrated]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx.state;
}

export function useAppDispatch() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx.dispatch;
}

export function useRoadmap(id: string): Roadmap | undefined {
  const { roadmaps } = useAppState();
  return roadmaps.find(r => r.id === id);
}


// ------------------


const METRICS_KEY = 'prepTrackerMetrics';

// Helper to read/write today's metric from localStorage directly
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