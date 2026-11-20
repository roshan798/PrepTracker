'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, Action, Roadmap } from '../types';
import { debounce } from '../utils';
import { DATA_VERSION } from '@/data/data';
import { getInitialState, reducer } from './reducer';
import { STORAGE_KEY, VERSION_KEY, mergePredefinedWithSaved } from './helpers';
import { localDateStr } from '@/components/Metrics/helpers';
import { recordProblemCompletion } from './metrics';

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
    let nextAction = action;
    if (action.type === 'UPDATE_PROBLEM' && action.payload.updates.status !== undefined) {
      const roadmap = state.roadmaps.find(r => r.id === action.payload.roadmapId);
      const topic = roadmap?.topics.find(item => item.id === action.payload.topicId);
      const problem = topic?.subtopics
        .find(item => item.id === action.payload.subtopicId)?.problems
        .find(item => item.id === action.payload.problemId);
      const status = action.payload.updates.status;

      if (status === 'completed' && problem && problem.status !== 'completed') {
        const suppliedDate = action.payload.updates.completedAt;
        const parsedDate = suppliedDate ? new Date(suppliedDate) : new Date();
        const completedAt = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
        const completedAtIso = completedAt.toISOString();
        nextAction = {
          ...action,
          payload: {
            ...action.payload,
            updates: { ...action.payload.updates, completedAt: completedAtIso },
          },
        };
        try {
          recordProblemCompletion(
            `${action.payload.roadmapId}:${action.payload.problemId}`,
            topic?.name ?? '',
            localDateStr(completedAt),
            true,
          );
        } catch (error) {
          console.error('Failed to record completed problem metrics:', error);
        }
      } else if (status !== 'completed' && problem?.status === 'completed') {
        const completedAt = problem.completedAt ? new Date(problem.completedAt) : null;
        if (completedAt && !Number.isNaN(completedAt.getTime())) {
          try {
            recordProblemCompletion(
              `${action.payload.roadmapId}:${action.payload.problemId}`,
              topic?.name ?? '',
              localDateStr(completedAt),
              false,
            );
          } catch (error) {
            console.error('Failed to update completed problem metrics:', error);
          }
        }
        nextAction = {
          ...action,
          payload: {
            ...action.payload,
            updates: { ...action.payload.updates, completedAt: undefined },
          },
        };
      }
    }

    rawDispatch(nextAction);
  }, [state, rawDispatch]);

  // ── 3. Debounced save ───────────────────────────────────────────────────────
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

  // ── 4. Theme ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    document.documentElement.dataset.palette = state.accentPalette ?? 'electric';
  }, [state.theme, state.accentPalette, hydrated]);

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
