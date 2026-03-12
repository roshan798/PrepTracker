'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Problem } from '@/lib/types';
import { getDifficultyColor } from '@/lib/utils';
import { ExternalLink, Trash2, StickyNote } from 'lucide-react';

import Notes from '../Notes/Notes';
import { NotesToggleButton } from '../ui/NotesToggleButton';

interface ProblemItemProps {
    roadmapId: string;
    topicId: string;
    subtopicId: string;
    problem: Problem;
}

export default function ProblemItem({ roadmapId, topicId, subtopicId, problem }: ProblemItemProps) {
    const dispatch = useAppDispatch();
    const [showNotes, setShowNotes] = useState(false);

    const updateProblem = (updates: Partial<Problem>) => {
        dispatch({ type: 'UPDATE_PROBLEM', payload: { roadmapId, topicId, subtopicId, problemId: problem.id, updates } });
    };

    const deleteProblem = () => {
        dispatch({ type: 'DELETE_PROBLEM', payload: { roadmapId, topicId, subtopicId, problemId: problem.id } });
    };

    return (
        <div className="rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="group flex items-center gap-2.5 px-3 py-2">
                <button onClick={() => updateProblem({ status: problem.status === 'completed' ? 'not-started' : 'completed' })}
                    className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all
                ${problem.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 hover:border-emerald-500'}`}>
                    {problem.status === 'completed' && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>

                <span className={`flex-1 text-xs ${problem.status === 'completed' ? 'line-through opacity-50' : ''}`}
                    style={{ color: 'var(--text-primary)' }}>
                    {problem.leetcodeNumber && (
                        <span className="mono mr-1.5 opacity-50">#{problem.leetcodeNumber}</span>
                    )}
                    {problem.name}
                </span>

                <span className={`text-xs px-1.5 py-0.5 rounded border mono shrink-0 ${getDifficultyColor(problem.difficulty)}`}
                    title={problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}>
                    {problem.difficulty[0].toUpperCase()}
                </span>

                <NotesToggleButton
                    value={problem.notes}
                    showNotes={showNotes}
                    onToggle={() => setShowNotes(!showNotes)}
                />

                {problem.url && (
                    <a href={problem.url} target="_blank" rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                        style={{ color: 'var(--text-secondary)' }}>
                        <ExternalLink size={12} />
                    </a>
                )}

                <button onClick={deleteProblem}
                    className="opacity-0 group-hover:opacity-40 hover:!opacity-100 hover:text-rose-400 transition-all"
                    style={{ color: 'var(--text-secondary)' }}>
                    <Trash2 size={11} />
                </button>
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
    );
}
