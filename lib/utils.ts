import { Roadmap, RoadmapStats, Status } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getRoadmapStats(roadmap: Roadmap): RoadmapStats {
  let total = 0;
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;
  let problemsTotal = 0;
  let problemsCompleted = 0;

  roadmap.topics.forEach(topic => {
    if (topic.subtopics.length === 0) {
      total++;
      if (topic.status === 'completed') completed++;
      else if (topic.status === 'in-progress') inProgress++;
      else notStarted++;
    } else {
      topic.subtopics.forEach(subtopic => {
        total++;
        if (subtopic.status === 'completed') completed++;
        else if (subtopic.status === 'in-progress') inProgress++;
        else notStarted++;

        subtopic.problems.forEach(problem => {
          problemsTotal++;
          if (problem.status === 'completed') problemsCompleted++;
        });
      });
    }
  });

  return {
    total,
    completed,
    inProgress,
    notStarted,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    problemsTotal,
    problemsCompleted,
  };
}

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'completed': return 'text-emerald-400';
    case 'in-progress': return 'text-amber-400';
    default: return 'text-slate-500';
  }
}

export function getStatusBg(status: Status): string {
  switch (status) {
    case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    default: return 'text-slate-400';
  }
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}
