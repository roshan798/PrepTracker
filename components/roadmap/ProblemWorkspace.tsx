'use client';

import { useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';
import { Problem, ProblemCodeLanguage } from '@/lib/types';
import Notes from '@/components/Notes/Notes';

const languages: { value: ProblemCodeLanguage; label: string }[] = [
  { value: 'plaintext', label: 'Pseudocode' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const complexities = [
  '',
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(n³)',
  'O(2ⁿ)',
  'O(n!)',
];

function isProblemCodeLanguage(value: string): value is ProblemCodeLanguage {
  return languages.some(language => language.value === value);
}

interface ProblemWorkspaceProps {
  problem: Problem;
  onChange: (updates: Partial<Problem>) => void;
}

export default function ProblemWorkspace({ problem, onChange }: ProblemWorkspaceProps) {
  const language = problem.solutionLanguage ?? 'javascript';
  const code = problem.solutionCode ?? '';
  const highlightedCode = useMemo(() => {
    if (!code) return '';
    return hljs.highlight(code, { language }).value;
  }, [code, language]);

  return (
    <div className="problem-workspace">
      <section className="problem-workspace-column" aria-label="Solution editor">
        <div className="problem-workspace-heading">
          <div>
            <h4>Solution & pseudocode</h4>
            <p>Draft an approach, then compare it with your final code.</p>
          </div>
          <select aria-label="Solution language" value={language}
            onChange={event => {
              const value = event.target.value;
              if (isProblemCodeLanguage(value)) onChange({ solutionLanguage: value });
            }}>
            {languages.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        <textarea
          value={code}
          onChange={event => onChange({ solutionCode: event.target.value })}
          placeholder="Write pseudocode or a solution here..."
          aria-label={`Solution code for ${problem.name}`}
          spellCheck={false}
          rows={10}
          className="problem-code-input"
        />
        <div className="problem-code-preview-label">Syntax preview</div>
        <pre className="problem-code-preview">
          {highlightedCode ? (
            <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          ) : (
            <span>Code preview will appear here.</span>
          )}
        </pre>
      </section>

      <section className="problem-workspace-column" aria-label="Notes and complexity">
        <div className="problem-workspace-heading">
          <div>
            <h4>Notes & complexity</h4>
            <p>Capture the key insight and verify the cost of your approach.</p>
          </div>
        </div>
        <div className="problem-complexity-grid">
          <label>
            <span>Time</span>
            <select aria-label="Time complexity" value={problem.timeComplexity ?? ''}
              onChange={event => onChange({ timeComplexity: event.target.value })}>
              {complexities.map(value => <option key={value || 'unset'} value={value}>{value || 'Select'}</option>)}
            </select>
          </label>
          <label>
            <span>Space</span>
            <select aria-label="Space complexity" value={problem.spaceComplexity ?? ''}
              onChange={event => onChange({ spaceComplexity: event.target.value })}>
              {complexities.map(value => <option key={value || 'unset'} value={value}>{value || 'Select'}</option>)}
            </select>
          </label>
        </div>
        <Notes
          value={problem.notes}
          onChange={event => onChange({ notes: event.target.value })}
          placeholder="Add the key idea, edge cases, and what you learned..."
          rows={8}
          label="Problem notes"
        />
      </section>
    </div>
  );
}
