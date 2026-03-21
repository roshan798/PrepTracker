'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { useMetrics } from '@/components/Metrics/metricsStore';
import { formatMinutes } from '@/components/Metrics/helpers';
import { DailyMetric, Mood } from '@/components/Metrics/types';
import "../../app/css/metrics.css";
import { getWeekDates, getWeekLabel } from '@/lib/utils';
import WeekSelector from './WeekSelector';
import StatRow from './StatRow';
import Delta from './Delta';
import ChartTooltip from './ChartTooltip';

// ─── Constants ────────────────────────────────────────────────────────────────

const MOOD_EMOJI: Record<Mood, string> = {
    great: '🚀', good: '😊', okay: '😐', tired: '😴', stressed: '😤'
};

const MOOD_COLORS: Record<Mood, string> = {
    great: '#06b6d4', good: '#10b981', okay: '#f59e0b', tired: '#8b5cf6', stressed: '#ef4444',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


interface WeekSummary {
    dates: string[];
    logs: DailyMetric[];
    totalStudyMins: number;
    totalNotes: number;
    avgConfidence: number;
    goalsRate: number;
    activeDays: number;
    bestDay: { date: string; mins: number } | null;
    worstDay: { date: string; mins: number } | null;
    dominantMood: Mood | null;
    topTopics: { name: string; count: number }[];
    dailyData: { day: string; date: string; studyTime: number; confidence: number | null; goals: number | null }[];
}

function computeWeek(allLogs: DailyMetric[], weeksAgo: number): WeekSummary {
    const dates = getWeekDates(weeksAgo);
    const logs = allLogs.filter(l => dates.includes(l.date));

    const totalStudyMins = logs.reduce((s, l) => s + l.totalStudyTime, 0);
    const totalNotes = logs.reduce((s, l) => s + l.notesCreated, 0);
    const activeDays = logs.filter(l => l.totalStudyTime > 0).length;

    const avgConfidence = logs.length
        ? Math.round(logs.reduce((s, l) => s + l.confidenceScore, 0) / logs.length)
        : 0;

    const goalsTotal = logs.reduce((s, l) => s + l.goalsTotal, 0);
    const goalsCompleted = logs.reduce((s, l) => s + l.goalsCompleted, 0);
    const goalsRate = goalsTotal > 0 ? Math.round((goalsCompleted / goalsTotal) * 100) : 0;

    const activeLogs = logs.filter(l => l.totalStudyTime > 0);
    const bestDayLog = activeLogs.length
        ? activeLogs.reduce((best, l) => l.totalStudyTime > best.totalStudyTime ? l : best)
        : null;
    const worstDayLog = activeLogs.length > 1
        ? activeLogs.reduce((worst, l) => l.totalStudyTime < worst.totalStudyTime ? l : worst)
        : null;

    const bestDay = bestDayLog ? { date: bestDayLog.date, mins: bestDayLog.totalStudyTime } : null;
    const worstDay = worstDayLog ? { date: worstDayLog.date, mins: worstDayLog.totalStudyTime } : null;

    // dominant mood
    const moodCount: Record<string, number> = {};
    logs.forEach(l => { moodCount[l.mood] = (moodCount[l.mood] ?? 0) + 1; });
    const dominantMood = Object.keys(moodCount).length
        ? Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0][0] as Mood
        : null;

    // top topics
    const topicMap: Record<string, number> = {};
    logs.forEach(l => l.topicsCovered.forEach(t => { topicMap[t] = (topicMap[t] ?? 0) + 1; }));
    const topTopics = Object.entries(topicMap)
        .sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    // daily chart data
    const dailyData = dates.map(date => {
        const log = logs.find(l => l.date === date);
        const d = new Date(date);
        return {
            day: DAY_NAMES[d.getDay()],
            date,
            studyTime: log?.totalStudyTime ?? 0,
            confidence: log?.confidenceScore ?? null,
            goals: log ? Math.round((log.goalsCompleted / Math.max(log.goalsTotal, 1)) * 100) : null,
        };
    });

    return { dates, logs, totalStudyMins, totalNotes, avgConfidence, goalsRate, activeDays, bestDay, worstDay, dominantMood, topTopics, dailyData };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WeeklyReport() {
    const { hydrated, logs } = useMetrics();
    const [weeksAgo, setWeeksAgo] = useState(0);

    const current = useMemo(() => computeWeek(logs, weeksAgo), [logs, weeksAgo]);
    const prev = useMemo(() => computeWeek(logs, weeksAgo + 1), [logs, weeksAgo]);

    if (!hydrated) {
        return (
            <div className="flex items-center justify-center h-64">
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>Loading...</div>
            </div>
        );
    }

    const hasData = current.logs.length > 0;

    return (
        <div className="metrics-root p-5 md:p-8 max-w-5xl mx-auto">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
                        📋 Weekly Report
                    </h1>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>
                        {current.dates[0]} → {current.dates[6]}
                    </p>
                </div>
                <WeekSelector weeksAgo={weeksAgo} onChange={setWeeksAgo} />
            </div>

            {!hasData ? (
                /* ── Empty State ── */
                <div className="metrics-card">
                    <div className="empty-state">
                        <span className="empty-state-icon">📋</span>
                        <p className="empty-state-title">No data for this week</p>
                        <p className="empty-state-sub">Log your study sessions in Metrics to see weekly reports here.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-5">

                    {/* ── Grade Card ── */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.06))',
                        border: '1px solid var(--border)', borderRadius: 20, padding: 28,
                        display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center',
                    }}>
                        {/* Grade */}
                        <div style={{ textAlign: 'center', minWidth: 80 }}>
                            <div style={{
                                fontSize: 56, fontWeight: 900, fontFamily: 'Syne, sans-serif', lineHeight: 1,
                                color: current.goalsRate >= 80 ? '#10b981' : current.goalsRate >= 50 ? '#f59e0b' : '#ef4444',
                            }}>
                                {current.goalsRate >= 80 ? 'A' : current.goalsRate >= 60 ? 'B' : current.goalsRate >= 40 ? 'C' : 'D'}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
                                Week Grade
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)', marginBottom: 6 }}>
                                {current.activeDays}/7 active days
                                {current.dominantMood && <span style={{ marginLeft: 8 }}>{MOOD_EMOJI[current.dominantMood]}</span>}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
                                {formatMinutes(current.totalStudyMins)} studied · {current.totalNotes} notes · {current.avgConfidence}% avg confidence
                            </div>
                            {current.bestDay && (
                                <div style={{ fontSize: 11, color: '#10b981', fontFamily: 'JetBrains Mono, monospace', marginTop: 6 }}>
                                    🏆 Best day: {new Date(current.bestDay.date).toLocaleDateString('en-US', { weekday: 'long' })} ({formatMinutes(current.bestDay.mins)})
                                </div>
                            )}
                        </div>

                        {/* vs last week */}
                        {prev.logs.length > 0 && (
                            <div style={{
                                padding: '12px 16px', borderRadius: 12,
                                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                                minWidth: 140,
                            }}>
                                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                                    vs {weeksAgo === 0 ? 'last' : 'prev'} week
                                </div>
                                <div className="space-y-1">
                                    {[
                                        { label: 'Study time', cur: current.totalStudyMins, pre: prev.totalStudyMins },
                                        { label: 'Notes', cur: current.totalNotes, pre: prev.totalNotes },
                                        { label: 'Goals%', cur: current.goalsRate, pre: prev.goalsRate },
                                    ].map(row => (
                                        <div key={row.label} className="flex items-center justify-between gap-3">
                                            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{row.label}</span>
                                            <Delta current={row.cur} prev={row.pre} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Stat Grid ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatRow icon="⏱" label="Study Time" value={formatMinutes(current.totalStudyMins)} accent="#06b6d4" />
                        <StatRow icon="📝" label="Notes Created" value={String(current.totalNotes)} accent="#8b5cf6" />
                        <StatRow icon="⭐" label="Avg Confidence" value={`${current.avgConfidence}%`} accent="#f59e0b" />
                        <StatRow icon="🎯" label="Goals Rate" value={`${current.goalsRate}%`} accent="#10b981" />
                    </div>

                    {/* ── Daily Study Time Bar Chart ── */}
                    <div className="metrics-card">
                        <div className="metrics-card-title">⏱ Daily Study Time</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={current.dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltip unit=" min" />} />
                                <Bar dataKey="studyTime" radius={[6, 6, 0, 0]}
                                    fill="#06b6d4"
                                    label={false}
                                >
                                    {current.dailyData.map((entry, i) => (
                                        <rect key={i} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ── Confidence Trend ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="metrics-card">
                            <div className="metrics-card-title">⭐ Daily Confidence</div>
                            <ResponsiveContainer width="100%" height={150}>
                                <LineChart data={current.dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }} tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTooltip unit="%" />} />
                                    <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} connectNulls />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* ── Topics Covered ── */}
                        <div className="metrics-card">
                            <div className="metrics-card-title">📚 Topics This Week</div>
                            {current.topTopics.length === 0 ? (
                                <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', padding: '20px 0', textAlign: 'center' }}>
                                    No topics logged
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {current.topTopics.map((t, i) => {
                                        const colors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
                                        const color = colors[i % colors.length];
                                        const max = current.topTopics[0].count;
                                        return (
                                            <div key={t.name} className="flex items-center gap-2">
                                                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', width: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                                                <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: 'rgba(255,255,255,0.06)' }}>
                                                    <div style={{ width: `${(t.count / max) * 100}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                                                </div>
                                                <span style={{ fontSize: 10, color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, width: 12 }}>{t.count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Daily Breakdown Table ── */}
                    <div className="metrics-card">
                        <div className="metrics-card-title">📅 Day by Day Breakdown</div>
                        <div className="space-y-2">
                            {current.dailyData.map((d, i) => {
                                const log = current.logs.find(l => l.date === d.date);
                                const isToday = d.date === new Date().toISOString().split('T')[0];
                                return (
                                    <div key={d.date} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '10px 14px', borderRadius: 10,
                                        background: isToday ? 'rgba(6,182,212,0.06)' : 'var(--bg-tertiary)',
                                        border: `1px solid ${isToday ? 'rgba(6,182,212,0.3)' : 'var(--border)'}`,
                                        opacity: d.studyTime === 0 && !isToday ? 0.5 : 1,
                                    }}>
                                        <div style={{ width: 36, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: isToday ? '#06b6d4' : 'var(--text-secondary)', fontWeight: isToday ? 700 : 400 }}>
                                            {d.day}{isToday ? ' ·' : ''}
                                        </div>
                                        <div style={{ fontSize: 14 }}>{log ? MOOD_EMOJI[log.mood] : '—'}</div>
                                        <div className="flex-1">
                                            {d.studyTime > 0 ? (
                                                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                                                    <div style={{
                                                        height: '100%', borderRadius: 2, background: '#06b6d4',
                                                        width: `${Math.min(100, (d.studyTime / 180) * 100)}%`,
                                                    }} />
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>no session</div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#06b6d4', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, width: 44, textAlign: 'right' }}>
                                            {d.studyTime > 0 ? formatMinutes(d.studyTime) : '—'}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace', width: 36, textAlign: 'right' }}>
                                            {d.confidence ? `${d.confidence}%` : '—'}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#10b981', fontFamily: 'JetBrains Mono, monospace', width: 36, textAlign: 'right' }}>
                                            {log ? `${log.goalsCompleted}/${log.goalsTotal}` : '—'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className="flex gap-4 mt-3" style={{ paddingLeft: 4 }}>
                            {[['⏱', '#06b6d4', 'Time'], ['⭐', '#f59e0b', 'Confidence'], ['🎯', '#10b981', 'Goals']].map(([icon, color, label]) => (
                                <div key={label} className="flex items-center gap-1">
                                    <span style={{ fontSize: 11 }}>{icon}</span>
                                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Mood Summary ── */}
                    {current.logs.length > 0 && (
                        <div className="metrics-card">
                            <div className="metrics-card-title">😊 Mood This Week</div>
                            <div className="flex gap-3 flex-wrap">
                                {current.logs.map(log => (
                                    <div key={log.id} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                        padding: '10px 14px', borderRadius: 12,
                                        background: 'var(--bg-tertiary)', border: `1px solid ${MOOD_COLORS[log.mood]}30`,
                                    }}>
                                        <span style={{ fontSize: 22 }}>{MOOD_EMOJI[log.mood]}</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                                            {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                    </div>
                                ))}
                                {current.dominantMood && (
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        gap: 4, padding: '10px 14px', borderRadius: 12, marginLeft: 'auto',
                                        background: `${MOOD_COLORS[current.dominantMood]}12`,
                                        border: `1px solid ${MOOD_COLORS[current.dominantMood]}30`,
                                    }}>
                                        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>dominant</span>
                                        <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: MOOD_COLORS[current.dominantMood], textTransform: 'capitalize' }}>
                                            {MOOD_EMOJI[current.dominantMood]} {current.dominantMood}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
