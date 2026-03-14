'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, Action, Roadmap, Status } from './types';
import { debounce } from './utils';
import { PREDEFINED_ROADMAPS, DATA_VERSION } from '@/data/data';
import { todayStr } from '@/components/Metrics/helpers';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'prepTrackerData';
const VERSION_KEY = 'prepTrackerDataVersion';

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

// ─── Merge logic ──────────────────────────────────────────────────────────────
// Keeps user progress (status, notes) while picking up new/removed items from data.ts

function mergePredefinedWithSaved(saved: Roadmap[]): Roadmap[] {
  return PREDEFINED_ROADMAPS.map(fresh => {
    const savedRoadmap = saved.find(r => r.id === fresh.id);
    if (!savedRoadmap) return fresh; // brand new roadmap

    const mergedTopics = fresh.topics.map(freshTopic => {
      const savedTopic = savedRoadmap.topics.find(t => t.id === freshTopic.id);
      if (!savedTopic) return freshTopic; // new topic

      const mergedSubtopics = freshTopic.subtopics.map(freshSub => {
        const savedSub = savedTopic.subtopics.find(s => s.id === freshSub.id);
        if (!savedSub) return freshSub; // new subtopic

        const mergedProblems = freshSub.problems.map(freshProb => {
          const savedProb = savedSub.problems.find(p => p.id === freshProb.id);
          if (!savedProb) return freshProb; // new problem
          // deleted problems simply don't appear — fresh is the source of truth
          return {
            ...freshProb,           // fresh metadata (name, url, difficulty)
            status: savedProb.status,
            notes: savedProb.notes,
          };
        });

        return {
          ...freshSub,
          status: savedSub.status,
          notes: savedSub.notes,
          problems: mergedProblems,
        };
      });

      // keep user-added subtopics that aren't in fresh data
      const customSubtopics = savedTopic.subtopics.filter(
        s => !freshTopic.subtopics.find(fs => fs.id === s.id)
      );

      return {
        ...freshTopic,
        status: savedTopic.status,
        notes: savedTopic.notes,
        subtopics: [...mergedSubtopics, ...customSubtopics],
      };
    });

    // keep user-added topics that aren't in fresh data
    const customTopics = savedRoadmap.topics.filter(
      t => !fresh.topics.find(ft => ft.id === t.id)
    );

    return {
      ...fresh,
      topics: [...mergedTopics, ...customTopics],
    };
  });
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

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
                  const updatedProblems = s.problems.map(p =>
                    p.id === action.payload.problemId ? { ...p, ...action.payload.updates } : p
                  );
                  const total = updatedProblems.length;
                  const completed = updatedProblems.filter(p => p.status === 'completed').length;
                  const inProgress = updatedProblems.filter(p => p.status === 'in-progress').length;
                  const subtopicStatus: Status =
                    total > 0 && completed === total ? 'completed'
                      : completed > 0 || inProgress > 0 ? 'in-progress'
                        : 'not-started';
                  return { ...s, problems: updatedProblems, status: subtopicStatus };
                });
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

// ─── Context ──────────────────────────────────────────────────────────────────

interface ContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, getInitialState());
  const [hydrated, setHydrated] = React.useState(false);

  // ── 1. Load & merge on mount ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedVersion = Number(localStorage.getItem(VERSION_KEY) ?? 0);

      if (stored) {
        const parsed = JSON.parse(stored) as AppState;

        if (storedVersion < DATA_VERSION) {
          // Stale data — merge fresh structure with saved progress
          console.debug(`[PrepTracker] Merging data v${storedVersion} → v${DATA_VERSION}`);
          const mergedRoadmaps = mergePredefinedWithSaved(parsed.roadmaps);
          const mergedState = { ...parsed, roadmaps: mergedRoadmaps };

          // Write merged state immediately — don't rely on debounced save
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
          localStorage.setItem(VERSION_KEY, String(DATA_VERSION));

          dispatch({ type: 'LOAD_STATE', payload: mergedState });
        } else {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } else {
        // First-ever load — stamp version
        localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    setHydrated(true);
  }, []);

  // ── 2. Wrapped dispatch — auto-tracks metrics ───────────────────────────────
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
        patchTodayMetric(log => ({
          ...log,
          goalsCompleted: Math.max(0, log.goalsCompleted - 1),
        }));
      }
    }

    rawDispatch(action);
  }, [state, rawDispatch]);

  // ── 3. Study time — track elapsed time since first action today ─────────────
  useEffect(() => {
    if (!hydrated) return;
    patchTodayMetric(log => {
      if (!log.sessionStart) return { ...log, sessionStart: new Date().toISOString() };
      const mins = Math.round((Date.now() - new Date(log.sessionStart).getTime()) / 60000);
      return { ...log, totalStudyTime: mins };
    });
  }, [state.lastUpdated, hydrated]);

  // ── 4. Debounced save ───────────────────────────────────────────────────────
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
    if (hydrated) saveToStorage(state);
  }, [state, hydrated, saveToStorage]);

  // ── 5. Theme ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
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