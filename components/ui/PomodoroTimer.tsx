'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward, Timer, X } from 'lucide-react';
import { useMetrics } from '@/components/Metrics/metricsStore';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/lib/store';
import { readSavedLocation } from '@/lib/location-persistence';

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

type TimerPhase = 'focus' | 'break';

interface TimerState {
  phase: TimerPhase;
  running: boolean;
  remainingSeconds: number;
  endsAt: number | null;
  focusStartedAt: string | null;
}

const initialState: TimerState = {
  phase: 'focus',
  running: false,
  remainingSeconds: FOCUS_SECONDS,
  endsAt: null,
  focusStartedAt: null,
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}

export default function PomodoroTimer() {
  const { recordStudySession } = useMetrics();
  const { roadmaps } = useAppState();
  const pathname = usePathname();
  const [timer, setTimer] = useState<TimerState>(initialState);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [pendingLog, setPendingLog] = useState(false);
  const completionHandled = useRef(false);

  const recordFocusSession = useCallback((startTime: string) => {
    const activeLocation = readSavedLocation()?.activeProblem;
    const currentRoadmapId = pathname.match(/^\/roadmaps\/([^/]+)/)?.[1];
    const topic = activeLocation && currentRoadmapId === activeLocation.roadmapId
      ? roadmaps.find(roadmap => roadmap.id === activeLocation.roadmapId)?.topics
        .find(item => item.id === activeLocation.topicId)
      : undefined;
    recordStudySession(
      25,
      startTime,
      topic?.name,
      topic && activeLocation
        ? { roadmapId: activeLocation.roadmapId, topicId: activeLocation.topicId }
        : undefined,
    );
  }, [pathname, recordStudySession, roadmaps]);

  const enterBreak = useCallback(() => {
    setPendingLog(false);
    setTimer({
      phase: 'break',
      running: false,
      remainingSeconds: BREAK_SECONDS,
      endsAt: null,
      focusStartedAt: null,
    });
    setNotice('Focus session logged. Time for a 5-minute break.');
  }, []);

  const finishPhase = useCallback(() => {
    if (completionHandled.current) return;
    completionHandled.current = true;
    setTimer(current => ({ ...current, running: false, endsAt: null, remainingSeconds: 0 }));

    if (timer.phase === 'focus') {
      try {
        const startTime = timer.focusStartedAt ?? new Date(Date.now() - FOCUS_SECONDS * 1000).toISOString();
        recordFocusSession(startTime);
        enterBreak();
      } catch (error) {
        setPendingLog(true);
        setNotice(error instanceof Error ? error.message : 'Could not save this focus session.');
      }
      return;
    }

    setTimer({
      phase: 'focus',
      running: false,
      remainingSeconds: FOCUS_SECONDS,
      endsAt: null,
      focusStartedAt: null,
    });
    setNotice('Break complete. Start another focus session when you’re ready.');
  }, [enterBreak, recordFocusSession, timer.focusStartedAt, timer.phase]);

  useEffect(() => {
    if (!timer.running || !timer.endsAt) return;
    const endsAt = timer.endsAt;

    const intervalId = window.setInterval(() => {
      const remainingSeconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setTimer(current => current.running && current.remainingSeconds !== remainingSeconds
        ? { ...current, remainingSeconds }
        : current);
      if (remainingSeconds === 0) finishPhase();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [finishPhase, timer.endsAt, timer.running]);

  const start = () => {
    if (timer.remainingSeconds <= 0) return;
    completionHandled.current = false;
    setNotice('');
    setTimer(current => ({
      ...current,
      running: true,
      endsAt: Date.now() + current.remainingSeconds * 1000,
      focusStartedAt: current.phase === 'focus'
        ? current.focusStartedAt ?? new Date().toISOString()
        : null,
    }));
  };

  const pause = () => {
    const remainingSeconds = timer.endsAt
      ? Math.max(0, Math.ceil((timer.endsAt - Date.now()) / 1000))
      : timer.remainingSeconds;
    setTimer(current => ({ ...current, running: false, endsAt: null, remainingSeconds }));
  };

  const reset = () => {
    completionHandled.current = false;
    setPendingLog(false);
    setNotice('');
    setTimer(initialState);
  };

  const skipBreak = () => {
    completionHandled.current = false;
    setPendingLog(false);
    setNotice('');
    setTimer(initialState);
  };

  const retryLog = () => {
    try {
      const startTime = timer.focusStartedAt ?? new Date(Date.now() - FOCUS_SECONDS * 1000).toISOString();
      recordFocusSession(startTime);
      enterBreak();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save this focus session.');
    }
  };

  const cycleProgress = timer.phase === 'focus'
    ? 1 - timer.remainingSeconds / FOCUS_SECONDS
    : 1 - timer.remainingSeconds / BREAK_SECONDS;

  return (
    <div className={`pomodoro-widget ${open ? 'open' : ''}`}>
      {open && (
        <section className="pomodoro-panel" aria-label="Pomodoro timer">
          <div className="pomodoro-panel-heading">
            <div>
              <div className="page-kicker">Focus timer</div>
              <h2>{timer.phase === 'focus' ? 'Pomodoro' : 'Short break'}</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close focus timer" className="pomodoro-close">
              <X size={17} />
            </button>
          </div>
          <div className="pomodoro-clock" aria-live="off">{formatTime(timer.remainingSeconds)}</div>
          <div className="pomodoro-phase">{timer.phase === 'focus' ? '25 min focus · 5 min break' : 'Take a short reset'}</div>
          <div className="pomodoro-progress" role="progressbar"
            aria-label={`${timer.phase === 'focus' ? 'Focus' : 'Break'} timer progress`}
            aria-valuenow={Math.round(cycleProgress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${Math.min(100, Math.max(0, cycleProgress * 100))}%` }} />
          </div>
          <div className="pomodoro-controls">
            {pendingLog ? (
              <button type="button" className="pomodoro-primary" onClick={retryLog}>Retry logging</button>
            ) : timer.running ? (
              <button type="button" className="pomodoro-primary" onClick={pause}><Pause size={15} /> Pause</button>
            ) : (
              <button type="button" className="pomodoro-primary" onClick={start} disabled={timer.remainingSeconds <= 0}>
                <Play size={15} /> Start
              </button>
            )}
            {timer.phase === 'break' ? (
              <button type="button" className="pomodoro-secondary" onClick={skipBreak} aria-label="Skip break">
                <SkipForward size={15} /> Skip
              </button>
            ) : (
              <button type="button" className="pomodoro-secondary" onClick={reset} aria-label="Reset timer">
                <RotateCcw size={15} /> Reset
              </button>
            )}
          </div>
          {notice && <p className={`pomodoro-notice ${pendingLog ? 'error' : ''}`} role={pendingLog ? 'alert' : 'status'}>{notice}</p>}
        </section>
      )}
      <button type="button" className="pomodoro-launcher" onClick={() => setOpen(value => !value)}
        aria-expanded={open} aria-label={`Pomodoro timer${timer.running ? `, ${formatTime(timer.remainingSeconds)} remaining` : ''}`}
        title="Pomodoro focus timer">
        <Timer size={18} />
        <span>{timer.running ? formatTime(timer.remainingSeconds) : 'Focus'}</span>
      </button>
    </div>
  );
}
