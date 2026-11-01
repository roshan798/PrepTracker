'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Problem } from '@/lib/types';
import { getDifficultyColor } from '@/lib/utils';
import { ExternalLink, Trash2 } from 'lucide-react';

import Notes from '../Notes/Notes';
import { NotesToggleButton } from '../ui/NotesToggleButton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface ProblemItemProps {
    roadmapId: string;
    topicId: string;
    subtopicId: string;
    problem: Problem;
}

export default function ProblemItem({ roadmapId, topicId, subtopicId, problem }: ProblemItemProps) {
    const dispatch = useAppDispatch();
    const [showNotes, setShowNotes] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const updateProblem = (updates: Partial<Problem>) => {
        dispatch({ type: 'UPDATE_PROBLEM', payload: { roadmapId, topicId, subtopicId, problemId: problem.id, updates } });
    };

    const deleteProblem = () => {
        dispatch({ type: 'DELETE_PROBLEM', payload: { roadmapId, topicId, subtopicId, problemId: problem.id } });
        setConfirmDelete(false);
    };

    return (
        <li className="list-none">
            <div className="rounded-xl border transition-colors"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 px-2.5 py-2">
                <button
                    type="button"
                    role="checkbox"
                    aria-checked={problem.status === 'completed'}
                    aria-label={`Mark ${problem.name} ${problem.status === 'completed' ? 'incomplete' : 'complete'}`}
                    onClick={() => updateProblem({ status: problem.status === 'completed' ? 'not-started' : 'completed' })}
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
                <span
                    aria-label={`${problem.difficulty} difficulty`}
                    className={`text-[11px] px-2 py-1 rounded-lg border mono shrink-0 ${getDifficultyColor(problem.difficulty)}`}
                    title={problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </span>

                <NotesToggleButton
                    value={problem.notes}
                    showNotes={showNotes}
                    onToggle={() => setShowNotes(!showNotes)}
                    label={problem.name}
                />

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
            {showNotes && (
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
