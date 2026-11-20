'use client';

import { useState, useEffect, useRef } from 'react';
import { DailyMetric, Mood } from './types';
import { formatMinutes, todayStr } from './helpers';

const MOODS: { key: Mood; emoji: string; label: string }[] = [
  { key: 'great', emoji: '🚀', label: 'Great' },
  { key: 'good', emoji: '😊', label: 'Good' },
  { key: 'okay', emoji: '😐', label: 'Okay' },
  { key: 'tired', emoji: '😴', label: 'Tired' },
  { key: 'stressed', emoji: '😤', label: 'Stressed' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  initial: DailyMetric;
  getLogForDate: (date: string) => DailyMetric;
  onSave: (log: DailyMetric) => void;
  activeSessionStart: string | null;
  onStartSession: () => void;
  onStopSession: (topic?: string) => DailyMetric | undefined;
}

export default function DailyLogModal({
  open, onClose, initial, getLogForDate, onSave, activeSessionStart, onStartSession, onStopSession
}: Props) {
  const [log, setLog] = useState<DailyMetric>(initial);
  const [elapsed, setElapsed] = useState(0); // seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // reset form when opened
  useEffect(() => { if (open) setLog(initial); }, [open, initial]);

  // timer tick
  useEffect(() => {
    if (activeSessionStart) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - new Date(activeSessionStart).getTime()) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeSessionStart]);

  const fmtElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleStopTimer = () => {
    const updated = onStopSession();
    if (updated) {
      setLog(prev => ({
        ...prev,
        totalStudyTime: updated.totalStudyTime,
        studyTimeManualAdjustment: updated.studyTimeManualAdjustment,
        sessions: updated.sessions,
      }));
    }
  };

  const handleSave = () => { onSave(log); onClose(); };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="glass-dialog w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.08))' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              📋 Daily Metrics
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
              Correct today's data or choose a past date to edit.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}>✕</button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Day to edit
            <input
              type="date"
              max={todayStr()}
              value={log.date}
              onChange={event => setLog(getLogForDate(event.target.value))}
              className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm"
              style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </label>

          {/* ── Timer ── */}
          <div className="rounded-xl p-4 text-center"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <div className="text-3xl font-bold mb-3"
              style={{ fontFamily: 'ui-monospace, monospace', color: activeSessionStart ? '#06b6d4' : 'var(--text-primary)' }}>
              {activeSessionStart ? fmtElapsed(elapsed) : formatMinutes(log.totalStudyTime)}
            </div>
            {log.date === todayStr() ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {!activeSessionStart ? (
                  <button onClick={onStartSession}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', fontFamily: 'ui-monospace, monospace' }}>
                    ▶ Start Timer
                  </button>
                ) : (
                  <button onClick={handleStopTimer}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontFamily: 'ui-monospace, monospace' }}>
                    ⏹ Stop
                  </button>
                )}
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
                  Correct total:
                </span>
                <input
                  type="number"
                  step={1}
                  value={log.totalStudyTime}
                  onChange={e => setLog(p => ({ ...p, totalStudyTime: Math.max(0, Math.round(Number(e.target.value))) }))}
                  min={0}
                  aria-label="Correct total study minutes"
                  className="w-16 px-2 py-1 rounded-lg border text-xs text-center"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace', outline: 'none' }}
                />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>min</span>
              </div>
            </div>
            ) : (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Focus time is recorded automatically from completed timers. You can correct the total here.
              </p>
            )}
          </div>

          {/* ── Confidence ── */}
          <div>
            <label className="block text-xs font-semibold mb-2"
              style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              ⭐ Confidence Score — <span style={{ color: '#06b6d4' }}>{log.confidenceScore}%</span>
            </label>
            <div className="relative">
              <input
                type="range" min={0} max={100} value={log.confidenceScore}
                onChange={e => setLog(p => ({
                  ...p,
                  confidenceScore: Number(e.target.value),
                  confidenceLogged: true,
                }))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #06b6d4 ${log.confidenceScore}%, rgba(255,255,255,0.1) ${log.confidenceScore}%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* ── Mood ── */}
          <div>
            <label className="block text-xs font-semibold mb-2"
              style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              😊 Mood
            </label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setLog(p => ({ ...p, mood: m.key, moodLogged: true }))}
                  className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-all text-xs"
                  style={{
                    borderColor: log.mood === m.key ? '#06b6d4' : 'var(--border)',
                    background: log.mood === m.key ? 'rgba(6,182,212,0.12)' : 'var(--bg-tertiary)',
                    color: log.mood === m.key ? '#06b6d4' : 'var(--text-secondary)',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Goals ── */}
          <div>
            <label className="block text-xs font-semibold mb-2"
              style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              🎯 Roadmap tasks completed
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <div>
                <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {Math.max(0, log.goalsCompleted + (log.tasksCompletedAdjustment ?? 0))} completed
                </div>
                <p className="mt-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                  Counted automatically when you complete problems.
                </p>
                <label className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Correct count
                  <input
                    type="number" min={0} max={1000} step={1}
                    value={Math.max(0, log.goalsCompleted + (log.tasksCompletedAdjustment ?? 0))}
                    aria-label="Correct completed problem count"
                    onChange={e => setLog(p => ({
                      ...p,
                      tasksCompletedAdjustment: Math.max(0, Math.round(Number(e.target.value))) - p.goalsCompleted,
                    }))}
                    className="w-16 rounded-lg border px-2 py-1 text-center"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                </label>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>Daily target:</span>
                <input
                  type="number" min={0} max={100} step={1} value={log.goalsTotal}
                  aria-label="Optional daily problem target"
                  onChange={e => setLog(p => ({
                    ...p,
                    goalsTotal: Math.min(100, Math.max(0, Math.round(Number(e.target.value)))),
                    goalTargetSet: true,
                  }))}
                  className="w-16 px-1 py-1 rounded-lg border text-xs text-center"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace', outline: 'none' }}
                />
              </div>
            </div>
            <p className="mt-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              Set the target to 0 if you do not want goal tracking.
            </p>
          </div>

          {/* ── Topics ── */}
          <div>
            <label className="block text-xs font-semibold mb-2"
              style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              📚 Topics Covered
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {log.topicsCovered.map(t => (
                <span key={t}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                  style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4', fontFamily: 'ui-monospace, monospace' }}>
                  {t}
                  <button onClick={() => setLog(p => ({ ...p, topicsCovered: p.topicsCovered.filter(x => x !== t) }))}
                    className="hover:opacity-70">×</button>
                </span>
              ))}
            </div>
            <input
              placeholder="Add topic (press Enter)..."
              className="w-full px-3 py-2 rounded-xl border text-xs"
              style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace', outline: 'none' }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !log.topicsCovered.includes(val)) {
                    setLog(p => ({ ...p, topicsCovered: [...p.topicsCovered, val] }));
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>

          {/* ── Distractions ── */}
          <div>
            <label className="block text-xs font-semibold mb-2"
              style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              📵 Distractions — <span style={{ color: '#f59e0b' }}>{log.distractions}</span>
            </label>
            <div className="flex gap-2">
              <button onClick={() => setLog(p => ({ ...p, distractions: Math.max(0, p.distractions - 1) }))}
                className="px-3 py-1.5 rounded-lg border text-sm transition-all hover:opacity-70"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>−</button>
              <div className="flex-1 flex items-center justify-center rounded-lg border text-sm font-bold"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace' }}>
                {log.distractions}
              </div>
              <button onClick={() => setLog(p => ({ ...p, distractions: p.distractions + 1 }))}
                className="px-3 py-1.5 rounded-lg border text-sm transition-all hover:opacity-70"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>+</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-70"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', fontFamily: 'ui-monospace, monospace', boxShadow: '0 4px 14px rgba(6,182,212,0.35)' }}>
            Save Updates ✓
          </button>
        </div>
      </div>
    </div>
  );
}
