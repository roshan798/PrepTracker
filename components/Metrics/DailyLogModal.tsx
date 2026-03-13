'use client';

import { useState, useEffect, useRef } from 'react';
import { DailyMetric, Mood } from './types';
import { formatMinutes } from './helpers';

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
  onSave: (log: DailyMetric) => void;
  activeSessionStart: string | null;
  onStartSession: () => void;
  onStopSession: (topic?: string) => number | undefined;
}

export default function DailyLogModal({
  open, onClose, initial, onSave, activeSessionStart, onStartSession, onStopSession
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
    const dur = onStopSession();
    if (dur) setLog(prev => ({ ...prev, totalStudyTime: prev.totalStudyTime + dur }));
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
        className="w-full max-w-lg rounded-2xl overflow-hidden"
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
              📋 Today's Session Log
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}>✕</button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* ── Timer ── */}
          <div className="rounded-xl p-4 text-center"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <div className="text-3xl font-bold mb-3"
              style={{ fontFamily: 'ui-monospace, monospace', color: activeSessionStart ? '#06b6d4' : 'var(--text-primary)' }}>
              {activeSessionStart ? fmtElapsed(elapsed) : formatMinutes(log.totalStudyTime)}
            </div>
            <div className="flex gap-2 justify-center">
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
                  Manual:
                </span>
                <input
                  type="number"
                  value={log.totalStudyTime}
                  onChange={e => setLog(p => ({ ...p, totalStudyTime: Number(e.target.value) }))}
                  min={0}
                  className="w-16 px-2 py-1 rounded-lg border text-xs text-center"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace', outline: 'none' }}
                />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>min</span>
              </div>
            </div>
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
                onChange={e => setLog(p => ({ ...p, confidenceScore: Number(e.target.value) }))}
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
                  onClick={() => setLog(p => ({ ...p, mood: m.key }))}
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
              🎯 Goals Completed
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1.5">
                {Array.from({ length: log.goalsTotal }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLog(p => ({ ...p, goalsCompleted: i < p.goalsCompleted ? i : i + 1 }))}
                    className="w-7 h-7 rounded-lg border text-xs transition-all"
                    style={{
                      borderColor: i < log.goalsCompleted ? '#10b981' : 'var(--border)',
                      background: i < log.goalsCompleted ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)',
                      color: i < log.goalsCompleted ? '#10b981' : 'var(--text-secondary)',
                    }}
                  >
                    {i < log.goalsCompleted ? '✓' : '○'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>Total:</span>
                <input
                  type="number" min={1} max={20} value={log.goalsTotal}
                  onChange={e => setLog(p => ({ ...p, goalsTotal: Number(e.target.value), goalsCompleted: Math.min(p.goalsCompleted, Number(e.target.value)) }))}
                  className="w-12 px-1 py-1 rounded-lg border text-xs text-center"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace', outline: 'none' }}
                />
              </div>
            </div>
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
            Save Session ✓
          </button>
        </div>
      </div>
    </div>
  );
}
