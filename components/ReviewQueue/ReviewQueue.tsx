'use client';

import Link from 'next/link';
import { CalendarCheck, Check, Clock3, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppState } from '@/lib/store';
import { getDueReviews, getNextReviewInterval, getNextReviewSchedule, ReviewRating } from '@/lib/spaced-repetition';

const ratings: { value: ReviewRating; label: string }[] = [
  { value: 'again', label: 'Again' },
  { value: 'hard', label: 'Hard' },
  { value: 'good', label: 'Good' },
  { value: 'easy', label: 'Easy' },
];

export default function ReviewQueue() {
  const { roadmaps } = useAppState();
  const dispatch = useAppDispatch();
  const dueReviews = getDueReviews(roadmaps);

  const scheduleReview = (review: typeof dueReviews[number], rating: ReviewRating) => {
    dispatch({
      type: 'UPDATE_PROBLEM',
      payload: {
        roadmapId: review.roadmapId,
        topicId: review.topicId,
        subtopicId: review.subtopicId,
        problemId: review.problem.id,
        updates: getNextReviewSchedule(review.problem, rating),
      },
    });
  };

  return (
    <div className="page-container max-w-4xl mx-auto p-5 md:p-8">
      <div className="mb-7">
        <div className="page-kicker mb-2">Keep it fresh</div>
        <h1 className="page-title">Review queue<span className="text-cyan-400">.</span></h1>
        <p className="page-description mt-2">
          Revisit completed problems as they come due. Choose how well you remembered each solution.
        </p>
      </div>

      <div className="review-queue-summary">
        <div className="review-queue-summary-icon"><CalendarCheck size={19} /></div>
        <div>
          <strong>{dueReviews.length} due</strong>
          <span>{dueReviews.length === 1 ? 'problem ready to review' : 'problems ready to review'}</span>
        </div>
      </div>

      {dueReviews.length === 0 ? (
        <section className="review-empty-state" aria-live="polite">
          <div className="review-empty-icon"><Check size={24} /></div>
          <h2>You’re all caught up</h2>
          <p>Complete a problem to add it to your review schedule, or check back when your next review is due.</p>
          <Link href="/" className="review-empty-link">Back to dashboard</Link>
        </section>
      ) : (
        <div className="space-y-3">
          {dueReviews.map(review => (
            <article key={`${review.roadmapId}-${review.problem.id}`} className="review-card">
              <div className="review-card-heading">
                <div className="min-w-0">
                  <p className="review-breadcrumb">
                    {review.roadmapName} <span>/</span> {review.topicName} <span>/</span> {review.subtopicName}
                  </p>
                  <h2>{review.problem.name}</h2>
                </div>
                <span className="review-due-pill due"><Clock3 size={12} /> Due {review.problem.reviewDueAt}</span>
              </div>
              <div className="review-card-footer">
                <Link href={`/roadmaps/${review.roadmapId}`} className="review-roadmap-link">
                  Open roadmap
                </Link>
                <div className="review-rating-group" aria-label={`How well did you remember ${review.problem.name}?`}>
                  {ratings.map(rating => {
                    const interval = getNextReviewInterval(review.problem.reviewIntervalDays ?? 3, rating.value);
                    return (
                      <button key={rating.value} type="button" onClick={() => scheduleReview(review, rating.value)}
                        className={`review-rating-button ${rating.value}`}>
                        <span>{rating.label}</span>
                        <small>{interval}d</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="review-queue-tip">
        <RotateCcw size={14} />
        <span>Newly completed problems enter the queue after 3 days. “Again” schedules a 1-day retry; intervals grow as recall improves.</span>
      </div>
    </div>
  );
}
