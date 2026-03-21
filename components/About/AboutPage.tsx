'use client';

import Link from 'next/link';

const STACK = [
  { name: 'Next.js 14', desc: 'App Router, server components, file-based routing', color: '#06b6d4' },
  { name: 'TypeScript', desc: 'End-to-end type safety across all components', color: '#8b5cf6' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling with CSS variables for theming', color: '#10b981' },
  { name: 'React Context + useReducer', desc: 'Global state without any external library', color: '#f59e0b' },
  { name: 'localStorage', desc: '100% offline — all data lives in your browser', color: '#ef4444' },
  { name: 'Recharts', desc: 'Metrics charts — area, bar, line, pie', color: '#06b6d4' },
  { name: 'PWA + next-pwa', desc: 'Installable, works fully offline after first load', color: '#8b5cf6' },
  { name: 'highlight.js', desc: 'Syntax highlighting inside notes code blocks', color: '#10b981' },
];

const FEATURES = [
  { icon: '🗺️', title: 'Roadmap Tracker', desc: 'Predefined + custom roadmaps with topic → subtopic → problem hierarchy. Status cascades automatically.' },
  { icon: '📝', title: 'Rich Notes', desc: 'Per-problem Markdown notes with syntax highlighting, toolbar, keyboard shortcuts, and collapsible cards.' },
  { icon: '📊', title: 'Prep Metrics', desc: 'Daily study session logging with mood, confidence, goals. Area/line/bar charts and 90-day heatmap.' },
  { icon: '🃏', title: 'Flashcard Mode', desc: 'Your notes become flashcards. Flip-card animation, keyboard controls, session history.' },
  { icon: '📋', title: 'Weekly Report', desc: 'Auto-generated week summary with grade, vs-last-week deltas, and day-by-day breakdown.' },
  { icon: '🎯', title: 'Interview Simulation', desc: 'Timed mock interviews — random problems, no hints, honest marking, grade + history.' },
  { icon: '🔄', title: 'Data Merge', desc: 'Versioned data.ts — bump DATA_VERSION and user progress is preserved while new content appears.' },
  { icon: '📱', title: 'PWA Offline', desc: 'Installs as a native app. Works with no internet. All data in localStorage, never leaves your device.' },
];

const JOURNEY = [
  { phase: 'Foundation', desc: 'Next.js + TypeScript + Tailwind setup. Core types defined — Roadmap → Topic → Subtopic → Problem. Basic CRUD with useReducer.' },
  { phase: 'State & Persistence', desc: 'localStorage persistence with debounced saves. Data versioning system so updates don\'t wipe user progress — merge algorithm preserves status and notes.' },
  { phase: 'Notes System', desc: 'Multi-note per problem with NoteItem[] JSON storage. Custom Markdown renderer with code block extraction to prevent p-tag-inside-code bugs. highlight.js integration.' },
  { phase: 'Status Cascade', desc: 'Auto-derive subtopic status from problems, topic status from subtopics. Completing all problems completes the parent automatically.' },
  { phase: 'Metrics', desc: 'DailyMetric logged automatically — problems completed patch goalsCompleted, session start time tracked on every state change. Recharts dashboard.' },
  { phase: 'PWA', desc: 'next-pwa integration (migrated from v5 to @ducanh2912/next-pwa for Next.js 14 compatibility). Service worker caches all static assets.' },
  { phase: 'Flashcards', desc: 'Notes → flashcards. Each NoteItem rendered separately to avoid markdown cross-contamination. 3D flip animation, keyboard navigation.' },
  { phase: 'Weekly Report & Sim', desc: 'Weekly report with grade, delta badges, and day-by-day breakdown. Interview simulation with countdown timer, problem navigation, and scoring.' },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>⚡</div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 900,
          color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.02em',
        }}>
          PrepTracker
        </h1>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
          color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7,
        }}>
          A job-switch prep tracker built entirely offline. No database. No backend. No accounts.
          Everything lives in your browser.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          {['100% Offline', 'No Backend', 'Open Source', 'PWA'].map(tag => (
            <span key={tag} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)',
              color: 'var(--accent-cyan)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
          What's Inside
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '16px 18px',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                {f.title}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
          Tech Stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {STACK.map(s => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 14px',
            }}>
              <div style={{ width: 3, borderRadius: 2, alignSelf: 'stretch', background: s.color, flexShrink: 0, minHeight: 24 }} />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 3 }}>
                  {s.name}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Build Journey */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
          How It Was Built
        </h2>
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute', left: 15, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(to bottom, var(--accent-cyan), rgba(0,229,255,0.1))',
            borderRadius: 1,
          }} />
          <div className="space-y-4" style={{ paddingLeft: 44 }}>
            {JOURNEY.map((j, i) => (
              <div key={j.phase} style={{
                position: 'relative',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px',
              }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -35, top: 16, width: 12, height: 12,
                  borderRadius: '50%', background: 'var(--accent-cyan)',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 0 8px rgba(0,229,255,0.4)',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                    color: 'var(--accent-cyan)', background: 'rgba(0,229,255,0.1)',
                    border: '1px solid rgba(0,229,255,0.2)', borderRadius: 4,
                    padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>Phase {i + 1}</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {j.phase}
                  </span>
                </div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {j.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
          Design Philosophy
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { icon: '🔒', title: 'Privacy First', desc: 'Your prep data never leaves your device. No servers, no telemetry, no accounts. localStorage only.' },
            { icon: '⚡', title: 'Zero Dependencies for Data', desc: 'React Context + useReducer handles everything. No Redux, no Zustand, no external state library.' },
            { icon: '🧩', title: 'Composable Data Model', desc: 'Roadmap → Topic → Subtopic → Problem. Each level has status, notes, and can be extended without breaking existing data.' },
            { icon: '🔄', title: 'Safe Updates', desc: 'DATA_VERSION + merge algorithm means you can update data.ts freely. User progress is never lost on deploy.' },
          ].map(p => (
            <div key={p.title} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '16px 18px',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</span>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '28px 0',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Built with ☕ for developers prepping for job switches.<br />
          No ads. No tracking. No server costs. Just prep.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: '← Dashboard', href: '/' },
            { label: '📊 Metrics', href: '/metrics' },
            { label: '🃏 Flashcards', href: '/flashcards' },
            { label: '🎯 Simulation', href: '/simulation' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: 'var(--accent-cyan)', textDecoration: 'none',
            }}>{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
