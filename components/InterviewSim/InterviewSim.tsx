'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAppState } from '@/lib/store';
import { Problem, Topic, Roadmap } from '@/lib/types';
import "../../app/css/metrics.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SimProblem {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  url?: string;
  topicName: string;
  roadmapName: string;
  solved: boolean | null; // null = not answered yet
}

interface SimResult {
  id: string;
  date: string;
  roadmapId: string;
  roadmapName: string;
  topicName: string;
  totalProblems: number;
  solved: number;
  durationSeconds: number;
  timeLimit: number;
  problems: { name: string; difficulty: string; solved: boolean }[];
}

const RESULTS_KEY = 'prepTrackerSimResults';
const DIFFICULTY_COLOR = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function saveResult(r: SimResult) {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    const all: SimResult[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(RESULTS_KEY, JSON.stringify([r, ...all].slice(0, 30)));
  } catch {}
}

function loadResults(): SimResult[] {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const cardStyle = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: 20,
};

const monoSm = { fontFamily: 'JetBrains Mono, monospace', fontSize: 11 };
const monoXs = { fontFamily: 'JetBrains Mono, monospace', fontSize: 10 };

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({ roadmaps, onStart }: {
  roadmaps: Roadmap[];
  onStart: (config: { roadmapId: string; topicId: string; count: number; timeLimit: number }) => void;
}) {
  const [roadmapId, setRoadmapId] = useState(roadmaps[0]?.id ?? '');
  const [topicId, setTopicId] = useState('');
  const [count, setCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(45);

  const roadmap = roadmaps.find(r => r.id === roadmapId);
  const topics = roadmap?.topics ?? [];

  useEffect(() => {
    setTopicId(topics[0]?.id ?? '');
  }, [roadmapId]);

  const selectedTopic = topics.find(t => t.id === topicId);
  const availableProblems = selectedTopic?.subtopics.flatMap(s => s.problems) ?? [];

  const selectStyle = {
    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', borderRadius: 10, padding: '8px 12px',
    fontSize: 12, fontFamily: 'JetBrains Mono, monospace', outline: 'none',
    width: '100%', cursor: 'pointer',
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎯</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          Interview Simulation
        </h2>
        <p style={{ ...monoSm, color: 'var(--text-secondary)' }}>
          Real interview pressure. No notes. No hints. Just you and the problems.
        </p>
      </div>

      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div className="space-y-4">
          {/* Roadmap */}
          <div>
            <label style={{ ...monoXs, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Roadmap
            </label>
            <select value={roadmapId} onChange={e => setRoadmapId(e.target.value)} style={selectStyle}>
              {roadmaps.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>)}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label style={{ ...monoXs, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Topic
            </label>
            <select value={topicId} onChange={e => setTopicId(e.target.value)} style={selectStyle}>
              <option value="">— All Topics —</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          {/* Count + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ ...monoXs, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Problems
              </label>
              <select value={count} onChange={e => setCount(Number(e.target.value))} style={selectStyle}>
                {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} problems</option>)}
              </select>
            </div>
            <div>
              <label style={{ ...monoXs, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Time Limit
              </label>
              <select value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} style={selectStyle}>
                {[15, 30, 45, 60, 90].map(n => <option key={n} value={n}>{n} minutes</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Available count */}
      <div style={{ ...cardStyle, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ ...monoXs, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Available problems</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {availableProblems.length}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...monoXs, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Time per problem</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            ~{Math.round(timeLimit / count)}min
          </div>
        </div>
      </div>

      {/* Rules */}
      <div style={{ ...cardStyle, marginBottom: 20, background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.2)' }}>
        <div style={{ ...monoXs, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>
          ⚠ Simulation Rules
        </div>
        {[
          'No notes or hints during the session',
          'Timer starts immediately — no pausing',
          'Mark each problem honestly after attempting',
          'Session auto-submits when time runs out',
        ].map(rule => (
          <div key={rule} style={{ ...monoXs, color: 'var(--text-secondary)', marginBottom: 6, paddingLeft: 8, borderLeft: '2px solid rgba(239,68,68,0.3)' }}>
            {rule}
          </div>
        ))}
      </div>

      <button
        onClick={() => onStart({ roadmapId, topicId, count, timeLimit })}
        disabled={availableProblems.length === 0}
        style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: availableProblems.length === 0 ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: availableProblems.length === 0 ? 'var(--text-secondary)' : '#fff',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700,
          cursor: availableProblems.length === 0 ? 'not-allowed' : 'pointer',
          boxShadow: availableProblems.length > 0 ? '0 4px 20px rgba(239,68,68,0.3)' : 'none',
          letterSpacing: '0.04em',
        }}
      >
        🚀 Start Simulation
      </button>
    </div>
  );
}

// ─── Active Session ───────────────────────────────────────────────────────────

function ActiveSession({ problems, timeLimit, onFinish }: {
  problems: SimProblem[];
  timeLimit: number;
  onFinish: (problems: SimProblem[], elapsed: number) => void;
}) {
  const [remaining, setRemaining] = useState(timeLimit * 60);
  const [current, setCurrent] = useState(0);
  const [solved, setSolved] = useState<Record<string, boolean | null>>({});
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(p => {
        if (p <= 1) {
          clearInterval(timerRef.current!);
          const elapsed = Math.round((Date.now() - startTime.current) / 1000);
          const final = problems.map(p => ({ ...p, solved: solved[p.id] ?? false }));
          onFinish(final, elapsed);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current!); };
  }, []);

  const problem = problems[current];
  const isLast = current === problems.length - 1;
  const answeredCount = Object.values(solved).filter(v => v !== null).length;
  const urgent = remaining < 300; // < 5 min

  const markAndNext = (didSolve: boolean) => {
    const next = { ...solved, [problem.id]: didSolve };
    setSolved(next);
    if (isLast) {
      clearInterval(timerRef.current!);
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      const final = problems.map(p => ({ ...p, solved: next[p.id] ?? false }));
      onFinish(final, elapsed);
    } else {
      setCurrent(p => p + 1);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Timer bar */}
      <div style={{
        ...cardStyle,
        marginBottom: 20,
        background: urgent ? 'rgba(239,68,68,0.06)' : 'var(--bg-secondary)',
        borderColor: urgent ? 'rgba(239,68,68,0.3)' : 'var(--border)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontSize: 32, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace',
          color: urgent ? '#ef4444' : 'var(--accent-cyan)',
          minWidth: 90,
          animation: urgent && remaining % 2 === 0 ? 'none' : undefined,
        }}>
          {formatTime(remaining)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: urgent ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, var(--accent-cyan), #0891b2)',
              width: `${(remaining / (timeLimit * 60)) * 100}%`,
              transition: 'width 1s linear',
            }} />
          </div>
          <div style={{ ...monoXs, color: 'var(--text-secondary)', marginTop: 4 }}>
            Problem {current + 1} of {problems.length} · {answeredCount} answered
          </div>
        </div>
        <button
          onClick={() => {
            clearInterval(timerRef.current!);
            const elapsed = Math.round((Date.now() - startTime.current) / 1000);
            const final = problems.map(p => ({ ...p, solved: solved[p.id] ?? false }));
            onFinish(final, elapsed);
          }}
          style={{
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', ...monoSm, fontWeight: 700,
          }}
        >
          End Early
        </button>
      </div>

      {/* Problem card */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{
            ...monoXs, padding: '3px 10px', borderRadius: 6,
            background: `${DIFFICULTY_COLOR[problem.difficulty]}18`,
            border: `1px solid ${DIFFICULTY_COLOR[problem.difficulty]}40`,
            color: DIFFICULTY_COLOR[problem.difficulty], textTransform: 'capitalize',
          }}>
            {problem.difficulty}
          </span>
          <span style={{ ...monoXs, color: 'var(--text-secondary)' }}>
            {problem.topicName}
          </span>
          {problem.url && (
            <a href={problem.url} target="_blank" rel="noopener noreferrer"
              style={{ ...monoXs, color: 'var(--accent-cyan)', marginLeft: 'auto', textDecoration: 'none' }}>
              Open Problem ↗
            </a>
          )}
        </div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 8 }}>
          {problem.name}
        </h2>
        <div style={{ ...monoXs, color: 'rgba(239,68,68,0.7)', marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
          🚫 No notes or hints — attempt this problem independently
        </div>
      </div>

      {/* Problem list mini */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {problems.map((p, i) => (
          <div key={p.id} onClick={() => setCurrent(i)} style={{
            width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
            background: i === current ? 'rgba(0,229,255,0.15)'
              : solved[p.id] === true ? 'rgba(16,185,129,0.15)'
              : solved[p.id] === false ? 'rgba(239,68,68,0.1)'
              : 'var(--bg-tertiary)',
            border: `1px solid ${i === current ? 'rgba(0,229,255,0.4)'
              : solved[p.id] === true ? 'rgba(16,185,129,0.3)'
              : solved[p.id] === false ? 'rgba(239,68,68,0.25)'
              : 'var(--border)'}`,
            color: i === current ? 'var(--accent-cyan)'
              : solved[p.id] === true ? '#10b981'
              : solved[p.id] === false ? '#f87171'
              : 'var(--text-secondary)',
          }}>
            {solved[p.id] === true ? '✓' : solved[p.id] === false ? '✗' : i + 1}
          </div>
        ))}
      </div>

      {/* Mark buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => markAndNext(false)} style={{
          padding: '16px', borderRadius: 12, cursor: 'pointer',
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          color: '#f87171', fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700,
        }}>
          ✗ Couldn't Solve
        </button>
        <button onClick={() => markAndNext(true)} style={{
          padding: '16px', borderRadius: 12, cursor: 'pointer',
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
          color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700,
        }}>
          ✓ Solved It
        </button>
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ result, history, onRetry, onExit }: {
  result: SimResult;
  history: SimResult[];
  onRetry: () => void;
  onExit: () => void;
}) {
  const score = Math.round((result.solved / result.totalProblems) * 100);
  const prevSame = history.find(h => h.id !== result.id && h.roadmapName === result.roadmapName && h.topicName === result.topicName);
  const prevScore = prevSame ? Math.round((prevSame.solved / prevSame.totalProblems) * 100) : null;

  const grade = score >= 80 ? { letter: 'A', color: '#10b981', label: 'Excellent' }
    : score >= 60 ? { letter: 'B', color: '#06b6d4', label: 'Good' }
    : score >= 40 ? { letter: 'C', color: '#f59e0b', label: 'Fair' }
    : { letter: 'D', color: '#ef4444', label: 'Needs Work' };

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      {/* Grade hero */}
      <div style={{
        ...cardStyle, textAlign: 'center', marginBottom: 16,
        background: `linear-gradient(135deg, ${grade.color}10, ${grade.color}06)`,
        borderColor: `${grade.color}30`,
      }}>
        <div style={{ fontSize: 64, fontWeight: 900, fontFamily: 'Syne, sans-serif', color: grade.color, lineHeight: 1 }}>
          {grade.letter}
        </div>
        <div style={{ ...monoSm, color: grade.color, fontWeight: 700, marginTop: 4 }}>{grade.label}</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>
          {result.solved}/{result.totalProblems} solved · {score}%
        </div>
        <div style={{ ...monoXs, color: 'var(--text-secondary)', marginTop: 6 }}>
          {formatTime(result.durationSeconds)} · {result.topicName}
        </div>
        {prevScore !== null && (
          <div style={{ marginTop: 10, ...monoXs, color: score >= prevScore ? '#10b981' : '#f87171' }}>
            {score >= prevScore ? '↑' : '↓'} {Math.abs(score - prevScore)}% vs last attempt ({prevScore}%)
          </div>
        )}
      </div>

      {/* Problem breakdown */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ ...monoXs, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Problem Breakdown
        </div>
        <div className="space-y-2">
          {result.problems.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: p.solved ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.05)',
              border: `1px solid ${p.solved ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`,
            }}>
              <span style={{ fontSize: 16 }}>{p.solved ? '✅' : '❌'}</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{p.name}</span>
              <span style={{
                ...monoXs, padding: '2px 8px', borderRadius: 5,
                background: `${DIFFICULTY_COLOR[p.difficulty as keyof typeof DIFFICULTY_COLOR]}15`,
                color: DIFFICULTY_COLOR[p.difficulty as keyof typeof DIFFICULTY_COLOR],
                textTransform: 'capitalize',
              }}>{p.difficulty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onRetry} style={{
          padding: '13px', borderRadius: 12, cursor: 'pointer',
          background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
        }}>🔁 Try Again</button>
        <button onClick={onExit} style={{
          padding: '13px', borderRadius: 12, cursor: 'pointer', border: 'none',
          background: 'linear-gradient(135deg, var(--accent-cyan), #0891b2)',
          color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
          boxShadow: '0 4px 14px rgba(0,229,255,0.2)',
        }}>✓ Done</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterviewSim() {
  const { roadmaps } = useAppState();
  const [phase, setPhase] = useState<'setup' | 'active' | 'results'>('setup');
  const [problems, setProblems] = useState<SimProblem[]>([]);
  const [config, setConfig] = useState<{ roadmapId: string; topicId: string; count: number; timeLimit: number } | null>(null);
  const [lastResult, setLastResult] = useState<SimResult | null>(null);
  const [history, setHistory] = useState<SimResult[]>(() => loadResults());

  const handleStart = (cfg: typeof config) => {
    if (!cfg) return;
    setConfig(cfg);
    const roadmap = roadmaps.find(r => r.id === cfg.roadmapId);
    if (!roadmap) return;

    const allProblems: SimProblem[] = [];
    const topics = cfg.topicId
      ? roadmap.topics.filter(t => t.id === cfg.topicId)
      : roadmap.topics;

    topics.forEach(t => {
      t.subtopics.forEach(s => {
        s.problems.forEach(p => {
          allProblems.push({
            id: p.id, name: p.name, difficulty: p.difficulty,
            url: p.url, topicName: t.name, roadmapName: roadmap.name, solved: null,
          });
        });
      });
    });

    const selected = shuffle(allProblems).slice(0, cfg.count);
    setProblems(selected);
    setPhase('active');
  };

  const handleFinish = (finalProblems: SimProblem[], elapsed: number) => {
    if (!config) return;
    const roadmap = roadmaps.find(r => r.id === config.roadmapId);
    const topic = roadmap?.topics.find(t => t.id === config.topicId);

    const result: SimResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      roadmapId: config.roadmapId,
      roadmapName: roadmap?.name ?? '',
      topicName: topic?.name ?? 'All Topics',
      totalProblems: finalProblems.length,
      solved: finalProblems.filter(p => p.solved).length,
      durationSeconds: elapsed,
      timeLimit: config.timeLimit,
      problems: finalProblems.map(p => ({ name: p.name, difficulty: p.difficulty, solved: p.solved ?? false })),
    };

    saveResult(result);
    setLastResult(result);
    setHistory(loadResults());
    setPhase('results');
  };

  return (
    <div className="metrics-root p-5 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
          🎯 Interview Simulation
        </h1>
        <p style={{ ...monoSm, color: 'var(--text-secondary)', marginTop: 4 }}>
          {history.length} simulation{history.length !== 1 ? 's' : ''} completed
        </p>
      </div>

      {phase === 'setup' && (
        <>
          <SetupScreen roadmaps={roadmaps} onStart={handleStart} />

          {/* Past simulations */}
          {history.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ ...monoXs, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Past Simulations
              </div>
              <div className="space-y-2">
                {history.slice(0, 6).map(r => {
                  const score = Math.round((r.solved / r.totalProblems) * 100);
                  const color = score >= 80 ? '#10b981' : score >= 60 ? '#06b6d4' : score >= 40 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={r.id} style={{
                      ...cardStyle, padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 900, color, minWidth: 28 }}>
                        {score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.topicName}
                        </div>
                        <div style={{ ...monoXs, color: 'var(--text-secondary)', marginTop: 2 }}>
                          {r.roadmapName} · {formatTime(r.durationSeconds)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>
                          {r.solved}/{r.totalProblems}
                        </div>
                        <div style={{ ...monoXs, color: 'var(--text-secondary)' }}>
                          {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {phase === 'active' && config && (
        <ActiveSession
          problems={problems}
          timeLimit={config.timeLimit}
          onFinish={handleFinish}
        />
      )}

      {phase === 'results' && lastResult && (
        <ResultsScreen
          result={lastResult}
          history={history}
          onRetry={() => { if (config) handleStart(config); }}
          onExit={() => setPhase('setup')}
        />
      )}
    </div>
  );
}
