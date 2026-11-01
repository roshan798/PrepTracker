'use client';
import { Status } from '@/lib/types';
import { getStatusBg } from '@/lib/utils';

interface StatusSelectProps {
  status: Status;
  onChange: (status: Status) => void;
  compact?: boolean;
  ariaLabel?: string;
}

export default function StatusSelect({ status, onChange, compact = false, ariaLabel = 'Status' }: StatusSelectProps) {
  const statusColor = {
    completed: 'var(--accent-emerald)',
    'in-progress': 'var(--accent-amber)',
    'not-started': 'var(--text-secondary)',
  }[status];

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as Status)}
      aria-label={ariaLabel}
      className={`min-h-9 border rounded-lg font-medium text-xs status-transition cursor-pointer ${getStatusBg(status)} ${compact ? 'px-2 py-1' : 'px-3 py-1.5'}`}
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: statusColor }}
    >
      <option value="not-started">Not Started</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
  );
}
