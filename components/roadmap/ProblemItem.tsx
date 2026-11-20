'use client';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Problem } from '@/lib/types';
import { getDifficultyColor } from '@/lib/utils';
import { CalendarClock, CalendarPlus, Code2, ExternalLink, Trash2 } from 'lucide-react';
import { dateKey, getInitialReviewSchedule } from '@/lib/spaced-repetition';

import Notes from '../Notes/Notes';
import { NotesToggleButton } from '../ui/NotesToggleButton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ProblemWorkspace from './ProblemWorkspace';

interface ProblemItemProps {
    roadmapId: string;
    topicId: string;
    subtopicId: string;
    problem: Problem;
    resume: boolean;
}

export default function ProblemItem({ roadmapId, topicId, subtopicId, problem, resume }: ProblemItemProps) {
    const dispatch = useAppDispatch();
    const problemRef = useRef<HTMLLIElement>(null);
    const [showNotes, setShowNotes] = useState(false);
    const [showWorkspace, setShowWorkspace] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (!resume) return;
        const frame = requestAnimationFrame(() => {
            problemRef.current?.scrollIntoView({ block: 'center', behavior: 'auto' });
        });
        return () => cancelAnimationFrame(frame);
    }, [resume]);

    const updateProblem = (updates: Partial<Problem>) => {
        dispatch({ type: 'UPDATE_PROBLEM', payload: { roadmapId, topicId, subtopicId, problemId: problem.id, updates } });
    };

    const deleteProblem = () => {
        dispatch({ type: 'DELETE_PROBLEM', payload: { roadmapId, topicId, subtopicId, problemId: problem.id } });
        setConfirmDelete(false);
    };

    const markComplete = () => {
        if (problem.status === 'completed') {
            updateProblem({ status: 'not-started' });
            return;
        }
        updateProblem({
            status: 'completed',
            ...(problem.reviewDueAt ? {} : getInitialReviewSchedule()),
        });
    };

    return (
        <li
            ref={problemRef}
            id={`problem-${problem.id}`}
            className="list-none"
            data-resume-problem={problem.id}
            data-roadmap-id={roadmapId}
            data-topic-id={topicId}
            data-subtopic-id={subtopicId}>
            <div className="rounded-xl border transition-colors"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="roadmap-problem-row flex flex-wrap items-center gap-x-2.5 gap-y-1.5 px-2.5 py-2">
                <button
                    type="button"
                    role="checkbox"
                    aria-checked={problem.status === 'completed'}
                    aria-label={`Mark ${problem.name} ${problem.status === 'completed' ? 'incomplete' : 'complete'}`}
                    onClick={markComplete}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all
                ${problem.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-500'}`}>
                    {problem.status === 'completed' && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>

                <span className={`min-w-[8rem] flex-1 text-sm leading-snug ${problem.status === 'completed' ? 'line-through opacity-50' : ''}`}
                    style={{ color: 'var(--text-primary)' }}>
                    {problem.leetcodeNumber && (
                        <span className="mono mr-1.5 opacity-50">#{problem.leetcodeNumber}</span>
                    )}
                    {problem.name}
                </span>

                <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-1 pl-7 sm:w-auto sm:pl-0">
                {problem.status === 'completed' && problem.reviewDueAt ? (
                    <span className={`review-schedule-badge ${problem.reviewDueAt <= dateKey() ? 'due' : ''}`}
                        title={`Next review: ${problem.reviewDueAt}`}>
                        <CalendarClock size={12} />
                        {problem.reviewDueAt <= dateKey() ? 'Review due' : `Review ${problem.reviewDueAt}`}
                    </span>
                ) : problem.status === 'completed' ? (
                    <button type="button" onClick={() => updateProblem(getInitialReviewSchedule())}
                        className="review-schedule-action" aria-label={`Add ${problem.name} to review schedule`}>
                        <CalendarPlus size={13} />
                        Review in 3 days
                    </button>
                ) : null}
                <span
                    aria-label={`${problem.difficulty} difficulty`}
                    className={`text-[11px] px-2 py-1 rounded-lg border mono shrink-0 ${getDifficultyColor(problem.difficulty)}`}
                    title={problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </span>

                <NotesToggleButton
                    value={problem.notes}
                    showNotes={showNotes || showWorkspace}
                    onToggle={() => {
                        if (showWorkspace) {
                            setShowWorkspace(false);
                            setShowNotes(true);
                        } else {
                            setShowNotes(value => !value);
                        }
                    }}
                    label={problem.name}
                />

                <button type="button" onClick={() => {
                    setShowWorkspace(value => !value);
                    setShowNotes(false);
                }}
                    aria-label={`${showWorkspace ? 'Close' : 'Open'} code workspace for ${problem.name}`}
                    aria-expanded={showWorkspace}
                    title={showWorkspace ? 'Close code workspace' : 'Open code workspace'}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${showWorkspace ? 'border-violet-500/40 bg-violet-500/10 text-violet-400' : 'border-transparent hover:bg-violet-500/10'}`}
                    style={{ color: showWorkspace ? undefined : 'var(--text-secondary)' }}>
                    <Code2 size={14} />
                </button>

                {problem.url && (
                    <a href={problem.url} target="_blank" rel="noopener noreferrer"
                        aria-label={`Open link for ${problem.name} in a new tab`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-cyan-500/10"
                        style={{ color: 'var(--text-secondary)' }}>
                        <ExternalLink size={14} />
                    </a>
                )}

                <button onClick={() => setConfirmDelete(true)}
                    type="button"
                    aria-label={`Delete ${problem.name}`}
                    title="Delete task"
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                    style={{ color: 'var(--text-secondary)' }}>
                    <Trash2 size={13} />
                </button>
                </div>
            </div>
            {showWorkspace && (
                <div className="px-3 pb-3">
                    <ProblemWorkspace problem={problem} onChange={updateProblem} />
                </div>
            )}
            {showNotes && !showWorkspace && (
                <div className="px-3 pb-2">
                    <Notes
                        value={problem.notes}
                        onChange={(e) => updateProblem({ notes: e.target.value })}
                        placeholder="Add notes, solution ideas, or performance analysis..."
                        rows={3}
                    />
                </div>
            )}
            </div>
            {confirmDelete && (
                <ConfirmDialog
                    title={`Delete ${problem.name}?`}
                    description="This task, its notes, and its progress will be permanently removed."
                    onCancel={() => setConfirmDelete(false)}
                    onConfirm={deleteProblem}
                />
            )}
        </li>
    );
}
