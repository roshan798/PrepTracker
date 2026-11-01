'use client';

import { Check, Palette, Sparkles } from 'lucide-react';
import { AccentPalette } from '@/lib/types';
import { useAppDispatch, useAppState } from '@/lib/store';

const palettes: {
  id: AccentPalette;
  name: string;
  description: string;
  colors: [string, string, string, string, string];
}[] = [
  {
    id: 'electric',
    name: 'Electric',
    description: 'Bright teal and violet for focused momentum.',
    colors: ['#83e6d5', '#b6a1ed', '#ff8290', '#f3bb6a', '#74d6a5'],
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    description: 'Warm, energetic tones to start strong.',
    colors: ['#fdba74', '#f9a8d4', '#fda4af', '#fcd34d', '#86efac'],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Dreamy purples with a fresh mint lift.',
    colors: ['#c4b5fd', '#a78bfa', '#f0abfc', '#fcd34d', '#6ee7b7'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues and turquoise for a calm flow.',
    colors: ['#7dd3fc', '#93c5fd', '#f9a8d4', '#fcd34d', '#5eead4'],
  },
  {
    id: 'citrus',
    name: 'Citrus',
    description: 'A crisp lime accent for a lively workspace.',
    colors: ['#bef264', '#c4b5fd', '#f9a8d4', '#fcd34d', '#86efac'],
  },
  {
    id: 'berry',
    name: 'Berry',
    description: 'Vibrant berry tones with a polished edge.',
    colors: ['#f9a8d4', '#d8b4fe', '#fda4af', '#fcd34d', '#6ee7b7'],
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Grounded greens for steady, clear progress.',
    colors: ['#86efac', '#c4b5fd', '#fda4af', '#fcd34d', '#6ee7b7'],
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Confident reds and warm orange highlights.',
    colors: ['#fca5a5', '#fdba74', '#fda4af', '#fcd34d', '#86efac'],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep indigo accents with a cool glow.',
    colors: ['#a5b4fc', '#c4b5fd', '#f9a8d4', '#fcd34d', '#6ee7b7'],
  },
  {
    id: 'blossom',
    name: 'Blossom',
    description: 'Playful pinks and purples for fresh ideas.',
    colors: ['#f0abfc', '#c4b5fd', '#f9a8d4', '#fcd34d', '#6ee7b7'],
  },
];

export default function AppearancePage() {
  const { accentPalette } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-5 sm:p-8">
      <header className="space-y-4">
        <div className="page-kicker flex items-center gap-2">
          <Sparkles size={14} />
          Make it yours
        </div>
        <div className="space-y-3">
          <h1 className="page-title">Your space, your energy.</h1>
          <p className="page-description">
            Choose an accent palette that makes your study space feel motivating.
            Your choice is saved automatically and works in both light and dark mode.
          </p>
        </div>
      </header>

      <section aria-labelledby="palette-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="palette-heading" className="section-title">Color palettes</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Pick a palette to preview it across PrepTracker.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Palette size={14} />
            <span>10 palettes</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {palettes.map(palette => {
            const selected = accentPalette === palette.id;

            return (
              <button
                key={palette.id}
                type="button"
                aria-pressed={selected}
                onClick={() => dispatch({ type: 'SET_ACCENT_PALETTE', payload: palette.id })}
                className="surface-card group relative overflow-hidden p-4 text-left transition duration-200 hover:-translate-y-1"
                style={{
                  borderColor: selected ? palette.colors[0] : 'var(--glass-border)',
                  boxShadow: selected
                    ? `0 0 0 1px ${palette.colors[0]}, var(--surface-shadow), var(--glass-highlight)`
                    : undefined,
                }}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {palette.name}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {palette.description}
                    </p>
                  </div>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                    style={{
                      color: selected ? 'var(--bg-primary)' : 'transparent',
                      backgroundColor: selected ? palette.colors[0] : 'transparent',
                      borderColor: selected ? palette.colors[0] : 'var(--border)',
                    }}>
                    <Check size={15} />
                  </span>
                </div>

                <div
                  className="rounded-xl border p-3"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {palette.colors.slice(0, 3).map((color, index) => (
                        <span
                          key={color}
                          className="h-2.5 w-2.5 rounded-full"
                          aria-hidden="true"
                          style={{ backgroundColor: color, opacity: 1 - index * 0.12 }}
                        />
                      ))}
                    </div>
                    <span className="mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      TODAY
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                      style={{
                        color: 'var(--bg-primary)',
                        background: `linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[1]})`,
                      }}>
                      72
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 h-2 w-2/3 rounded-full" style={{ backgroundColor: 'var(--text-primary)', opacity: 0.8 }} />
                      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: palette.colors[0] }} />
                      </div>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: palette.colors[0] }}>+12%</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2" aria-label="Palette accent colors">
                  {palette.colors.map(color => (
                    <span
                      key={color}
                      className="h-5 flex-1 rounded-full"
                      aria-hidden="true"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {selected && (
                  <span className="sr-only" aria-live="polite">
                    {palette.name} palette selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <aside className="surface-card flex items-start gap-3 p-4 sm:p-5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ color: 'var(--accent-cyan)', backgroundColor: 'color-mix(in srgb, var(--accent-cyan) 14%, transparent)' }}>
          <Sparkles size={17} />
        </div>
        <div>
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Keep your preferred contrast</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            This only changes accent colors. Use the light/dark control in the header to change the overall appearance.
          </p>
        </div>
      </aside>
    </div>
  );
}
