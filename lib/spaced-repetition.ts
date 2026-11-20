import { Problem, Roadmap } from './types';

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface DueReview {
  roadmapId: string;
  roadmapName: string;
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  problem: Problem;
}

export function dateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return dateKey(result);
}

export function getInitialReviewSchedule(date: Date = new Date()): Pick<Problem, 'reviewDueAt' | 'reviewIntervalDays' | 'reviewCount'> {
  return {
    reviewDueAt: addDays(date, 3),
    reviewIntervalDays: 3,
    reviewCount: 0,
  };
}

export function getNextReviewInterval(currentInterval: number, rating: ReviewRating): number {
  if (rating === 'again') return 1;
  if (rating === 'hard') return Math.min(90, Math.max(2, Math.ceil(currentInterval * 1.3)));
  if (rating === 'good') return Math.min(90, Math.max(3, Math.ceil(currentInterval * 2)));
  return Math.min(90, Math.max(4, Math.ceil(currentInterval * 2.5)));
}

export function getNextReviewSchedule(
  problem: Problem,
  rating: ReviewRating,
  date: Date = new Date(),
): Pick<Problem, 'reviewDueAt' | 'reviewIntervalDays' | 'reviewCount' | 'lastReviewedAt'> {
  const interval = getNextReviewInterval(problem.reviewIntervalDays ?? 3, rating);
  const today = dateKey(date);
  return {
    reviewDueAt: addDays(date, interval),
    reviewIntervalDays: interval,
    reviewCount: (problem.reviewCount ?? 0) + 1,
    lastReviewedAt: today,
  };
}

export function getDueReviews(roadmaps: Roadmap[], date: Date = new Date()): DueReview[] {
  const today = dateKey(date);
  const due: DueReview[] = [];

  for (const roadmap of roadmaps) {
    for (const topic of roadmap.topics) {
      for (const subtopic of topic.subtopics) {
        for (const problem of subtopic.problems) {
          if (problem.status === 'completed' && problem.reviewDueAt && problem.reviewDueAt <= today) {
            due.push({
              roadmapId: roadmap.id,
              roadmapName: roadmap.name,
              topicId: topic.id,
              topicName: topic.name,
              subtopicId: subtopic.id,
              subtopicName: subtopic.name,
              problem,
            });
          }
        }
      }
    }
  }

  return due.sort((a, b) => (a.problem.reviewDueAt ?? '').localeCompare(b.problem.reviewDueAt ?? ''));
}
