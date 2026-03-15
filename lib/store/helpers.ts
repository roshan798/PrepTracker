import { Roadmap } from '../types';
import { PREDEFINED_ROADMAPS } from '@/data/data';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEY = 'prepTrackerData';
export const VERSION_KEY = 'prepTrackerDataVersion';

// ─── Merge logic ──────────────────────────────────────────────────────────────
// Keeps user progress (status, notes) while picking up new/removed items from data.ts

export function mergePredefinedWithSaved(saved: Roadmap[]): Roadmap[] {
  return PREDEFINED_ROADMAPS.map(fresh => {
    const savedRoadmap = saved.find(r => r.id === fresh.id);
    if (!savedRoadmap) return fresh; // brand new roadmap

    const mergedTopics = fresh.topics.map(freshTopic => {
      const savedTopic = savedRoadmap.topics.find(t => t.id === freshTopic.id);
      if (!savedTopic) return freshTopic; // new topic

      const mergedSubtopics = freshTopic.subtopics.map(freshSub => {
        const savedSub = savedTopic.subtopics.find(s => s.id === freshSub.id);
        if (!savedSub) return freshSub; // new subtopic

        const mergedProblems = freshSub.problems.map(freshProb => {
          const savedProb = savedSub.problems.find(p => p.id === freshProb.id);
          if (!savedProb) return freshProb; // new problem
          // deleted problems simply don't appear — fresh is the source of truth
          return {
            ...freshProb,           // fresh metadata (name, url, difficulty)
            status: savedProb.status,
            notes: savedProb.notes,
          };
        });

        return {
          ...freshSub,
          status: savedSub.status,
          notes: savedSub.notes,
          problems: mergedProblems,
        };
      });

      // keep user-added subtopics that aren't in fresh data
      const customSubtopics = savedTopic.subtopics.filter(
        s => !freshTopic.subtopics.find(fs => fs.id === s.id)
      );

      return {
        ...freshTopic,
        status: savedTopic.status,
        notes: savedTopic.notes,
        subtopics: [...mergedSubtopics, ...customSubtopics],
      };
    });

    // keep user-added topics that aren't in fresh data
    const customTopics = savedRoadmap.topics.filter(
      t => !fresh.topics.find(ft => ft.id === t.id)
    );

    return {
      ...fresh,
      topics: [...mergedTopics, ...customTopics],
    };
  });
}
