'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, Action, Roadmap } from '../types';
import { debounce } from '../utils';
import { DATA_VERSION } from '@/data/data';
import { getInitialState, reducer } from './reducer';
import { STORAGE_KEY, VERSION_KEY, mergePredefinedWithSaved } from './helpers';
import { patchTodayMetric } from './metrics';

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
