'use client';

import { Flame, Sparkles } from 'lucide-react';
import { useAppState } from '@/lib/store';
import { useMetrics } from '@/components/Metrics/metricsStore';
import { getGamificationStats } from '@/components/Metrics/helpers';

export default function GamificationStatus({ compact = false }: { compact?: boolean }) {
  const { roadmaps } = useAppState();
  const { hydrated, logs } = useMetrics();

  if (!hydrated) return null;

  const { level, levelProgress, xpToNextLevel, streak, totalXp } = getGamificationStats(roadmaps, logs);

  if (compact) {
    return (
      <div className="gamification-header-badges" aria-label={`Level ${level}, ${streak} day study streak`}>
        <span className="gamification-header-level"><Sparkles size={13} /> Lv {level}</span>
        <span className="gamification-header-streak"><Flame size={14} /> {streak}</span>
      </div>
    );
  }

  return (
    <section className="gamification-card surface-card" aria-label="Study level and streak">
      <div className="gamification-card-main">
        <div className="gamification-level-icon"><Sparkles size={19} /></div>
        <div className="min-w-0 flex-1">
          <div className="page-kicker mb-1">Your momentum</div>
          <div className="flex items-baseline gap-2">
            <h2 className="gamification-level-title">Level {level}</h2>
            <span className="gamification-xp-label">{totalXp} XP</span>
          </div>
          <div className="gamification-progress-track" role="progressbar"
            aria-label={`Level ${level} progress`} aria-valuenow={levelProgress}
            aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${levelProgress}%` }} />
          </div>
          <p className="gamification-next-level">{xpToNextLevel} XP to level {level + 1}</p>
        </div>
      </div>
      <div className="gamification-streak">
        <Flame size={17} />
        <div>
          <strong>{streak} day{streak === 1 ? '' : 's'}</strong>
          <span>study streak</span>
        </div>
      </div>
    </section>
  );
}
