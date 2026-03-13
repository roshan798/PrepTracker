'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useMetrics } from './metricsStore';
import { formatMinutes, getDateRange, computeSummary, todayStr } from './helpers';
import { Mood, DailyMetric } from './types';
import DailyLogModal from './DailyLogModal';
import "../../app/css/metrics.css";

// ─── Constants ────────────────────────────────────────────────────────────────

type Period = 'today' | 'week' | 'month';

const MOOD_COLORS: Record<Mood, string> = {
  great: '#06b6d4',
  good: '#10b981',
  okay: '#f59e0b',
  tired: '#8b5cf6',
  stressed: '#ef4444',
};

const MOOD_EMOJI: Record<Mood, string> = {
  great: '🚀', good: '😊', okay: '😐', tired: '😴', stressed: '😤'
};

const TOPIC_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent = '#06b6d4', delay = 0 }:
  { icon: string; label: string; value: string; sub?: string; accent?: string; delay?: number }) {
  return (
    <div className="metrics-stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="metrics-stat-icon" style={{ color: accent, background: `${accent}18`, borderColor: `${accent}30` }}>
        {icon}
      </div>
      <div className="metrics-stat-value" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="metrics-stat-label" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      {sub && <div className="metrics-stat-sub" style={{ color: accent }}>{sub}</div>}
    </div>
  );
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────

function StudyHeatmap({ logs }: { logs: DailyMetric[] }) {
  const today = new Date();
  const cells = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = logs.find(l => l.date === dateStr);
    const mins = log?.totalStudyTime ?? 0;
    const intensity = mins === 0 ? 0 : mins < 30 ? 1 : mins < 60 ? 2 : mins < 120 ? 3 : 4;
    cells.push({ dateStr, mins, intensity, day: d.getDay() });
  }

  const intensityColor = (n: number) => {
    if (n === 0) return 'rgba(255,255,255,0.05)';
    if (n === 1) return 'rgba(6,182,212,0.2)';
    if (n === 2) return 'rgba(6,182,212,0.45)';
    if (n === 3) return 'rgba(6,182,212,0.7)';
    return '#06b6d4';
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
        {cells.map((c, i) => (
          <div key={i} title={`${c.dateStr}: ${formatMinutes(c.mins)}`}
            style={{
              width: 12, height: 12, borderRadius: 3,
              background: intensityColor(c.intensity),
              border: c.dateStr === todayStr() ? '1px solid #06b6d4' : 'none',
              cursor: 'default',
            }}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-2 items-center">
        <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>Less</span>
        {[0, 1, 2, 3, 4].map(n => (
          <div key={n} style={{ width: 10, height: 10, borderRadius: 2, background: intensityColor(n) }} />
        ))}
        <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>More</span>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label, unit = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color }}>{p.value}{unit}</div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function MetricsDashboard() {
  const { hydrated, logs, getTodayLog, saveLog, activeSessionStart, startSession, stopSession, exportCSV } = useMetrics();
  const [period, setPeriod] = useState<Period>('week');
  const [showModal, setShowModal] = useState(false);

  const dates = useMemo(() => getDateRange(period), [period]);
  const summary = useMemo(() => computeSummary(logs, dates), [logs, dates]);

  // Build chart data for the selected period
  const chartData = useMemo(() => {
    return dates.map(date => {
      const log = logs.find(l => l.date === date);
      return {
        date: date.slice(5), // MM-DD
        studyTime: log?.totalStudyTime ?? 0,
        confidence: log?.confidenceScore ?? null,
        notes: log?.notesCreated ?? 0,
        goals: log ? Math.round((log.goalsCompleted / Math.max(log.goalsTotal, 1)) * 100) : null,
      };
    });
  }, [logs, dates]);

  // Pie data for topics
  const topicPieData = useMemo(() => {
    const total = summary.topTopics.reduce((s, t) => s + t.count, 0);
    return summary.topTopics.map(t => ({
      name: t.name,
      value: Math.round((t.count / total) * 100),
    }));
  }, [summary.topTopics]);

  // Mood bar data
  const moodBarData = useMemo(() =>
    Object.entries(summary.moodDistribution)
      .filter(([, v]) => v > 0)
      .map(([mood, count]) => ({ mood, count, fill: MOOD_COLORS[mood as Mood] })),
    [summary.moodDistribution]
  );

  const todayLog = getTodayLog();
  const isStudying = !!activeSessionStart;

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>
          Loading metrics...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="metrics-root p-5 md:p-8 max-w-7xl mx-auto"
      >
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              📊 Prep Metrics
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', marginTop: 4 }}>
              {logs.length} session{logs.length !== 1 ? 's' : ''} logged · {summary.streak} day streak 🔥
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Period selector */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              {(['today', 'week', 'month'] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`period-btn ${period === p ? 'active' : ''}`}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: isStudying
                  ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                border: isStudying ? '1px solid rgba(239,68,68,0.4)' : 'none',
                color: isStudying ? '#f87171' : '#fff',
                fontFamily: 'ui-monospace, monospace',
                boxShadow: isStudying ? 'none' : '0 4px 14px rgba(6,182,212,0.3)',
                letterSpacing: '0.04em',
              }}>
              {isStudying ? '⏱ Session Active' : '+ Log Today'}
            </button>
            <button onClick={exportCSV}
              className="px-3 py-2 rounded-xl border text-xs font-semibold transition-all hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
              ↓ CSV
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          /* ── Empty State ── */
          <div className="metrics-card">
            <div className="empty-state">
              <span className="empty-state-icon">📈</span>
              <p className="empty-state-title">No sessions logged yet</p>
              <p className="empty-state-sub">Click "Log Today" to start tracking your prep sessions. Your progress will appear here.</p>
              <button onClick={() => setShowModal(true)}
                className="px-6 py-3 rounded-xl text-sm font-bold mt-2 transition-all"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', fontFamily: 'ui-monospace, monospace', boxShadow: '0 4px 14px rgba(6,182,212,0.3)' }}>
                Log My First Session →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon="⏱" label="Study Time" value={formatMinutes(summary.totalStudyMinutes)}
                sub={period === 'today' ? 'today' : period === 'week' ? 'this week' : 'this month'}
                accent="#06b6d4" delay={0} />
              <StatCard icon="📝" label="Notes" value={String(summary.notesCreated)}
                accent="#8b5cf6" delay={60} />
              <StatCard icon="⭐" label="Avg Confidence" value={`${summary.avgConfidence}%`}
                accent="#f59e0b" delay={120} />
              <StatCard icon="🎯" label="Goals Done" value={`${summary.goalsCompletionRate}%`}
                accent="#10b981" delay={180} />
            </div>

            {/* ── Study Time Chart ── */}
            <div className="metrics-card" style={{ animationDelay: '200ms' }}>
              <div className="metrics-card-title">⏱ Study Time Trend</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip unit=" min" />} />
                  <Area type="monotone" dataKey="studyTime" stroke="#06b6d4" strokeWidth={2} fill="url(#studyGrad)" dot={{ fill: '#06b6d4', r: 3 }} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* ── Confidence + Goals row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="metrics-card" style={{ animationDelay: '260ms' }}>
                <div className="metrics-card-title">⭐ Confidence Trend</div>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip unit="%" />} />
                    <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="metrics-card" style={{ animationDelay: '300ms' }}>
                <div className="metrics-card-title">🎯 Goals Completion %</div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip unit="%" />} />
                    <Bar dataKey="goals" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Topics + Mood row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Topics pie */}
              <div className="metrics-card" style={{ animationDelay: '340ms' }}>
                <div className="metrics-card-title">📚 Topic Coverage</div>
                {topicPieData.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'ui-monospace, monospace', padding: '20px 0', textAlign: 'center' }}>
                    No topics logged yet
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie data={topicPieData} cx="50%" cy="50%" innerRadius={28} outerRadius={52}
                          dataKey="value" paddingAngle={3}>
                          {topicPieData.map((_, i) => (
                            <Cell key={i} fill={TOPIC_COLORS[i % TOPIC_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'ui-monospace, monospace', fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5 flex-1">
                      {topicPieData.map((t, i) => (
                        <div key={t.name} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: TOPIC_COLORS[i % TOPIC_COLORS.length], flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                          </div>
                          <span style={{ fontSize: 11, color: TOPIC_COLORS[i % TOPIC_COLORS.length], fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{t.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mood distribution */}
              <div className="metrics-card" style={{ animationDelay: '380ms' }}>
                <div className="metrics-card-title">😊 Mood Distribution</div>
                {moodBarData.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'ui-monospace, monospace', padding: '20px 0', textAlign: 'center' }}>
                    No mood data yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {moodBarData.sort((a, b) => b.count - a.count).map(m => {
                      const max = Math.max(...moodBarData.map(x => x.count));
                      return (
                        <div key={m.mood} className="flex items-center gap-2">
                          <span style={{ fontSize: 14, width: 20 }}>{MOOD_EMOJI[m.mood as Mood]}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', width: 52, textTransform: 'capitalize' }}>{m.mood}</span>
                          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: 'rgba(255,255,255,0.06)' }}>
                            <div style={{ width: `${(m.count / max) * 100}%`, height: '100%', background: m.fill, borderRadius: 4, transition: 'width 0.6s ease' }} />
                          </div>
                          <span style={{ fontSize: 10, color: m.fill, fontFamily: 'ui-monospace, monospace', fontWeight: 700, width: 16, textAlign: 'right' }}>{m.count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Activity Heatmap ── */}
            <div className="metrics-card" style={{ animationDelay: '420ms' }}>
              <div className="metrics-card-title">📅 90-Day Activity Heatmap</div>
              <StudyHeatmap logs={logs} />
            </div>

            {/* ── Recent Sessions ── */}
            <div className="metrics-card" style={{ animationDelay: '460ms' }}>
              <div className="metrics-card-title">🕐 Recent Sessions</div>
              {logs.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'ui-monospace, monospace', textAlign: 'center', padding: '20px 0' }}>No sessions yet</div>
              ) : (
                <div className="space-y-2">
                  {[...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7).map(log => (
                    <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 16 }}>{MOOD_EMOJI[log.mood]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{log.date}</span>
                          {log.topicsCovered.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: 9, fontFamily: 'ui-monospace, monospace', padding: '1px 6px', borderRadius: 4, background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.25)' }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>
                          {log.goalsCompleted}/{log.goalsTotal} goals · {log.distractions} distractions
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4', fontFamily: 'ui-monospace, monospace' }}>{formatMinutes(log.totalStudyTime)}</div>
                        <div style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'ui-monospace, monospace' }}>{log.confidenceScore}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <DailyLogModal
        open={showModal}
        onClose={() => setShowModal(false)}
        initial={todayLog}
        onSave={saveLog}
        activeSessionStart={activeSessionStart}
        onStartSession={startSession}
        onStopSession={stopSession}
      />
    </>
  );
}
