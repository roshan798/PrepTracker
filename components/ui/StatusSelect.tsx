'use client';
import { Status } from '@/lib/types';
import { getStatusBg } from '@/lib/utils';

interface StatusSelectProps {
  status: Status;
  onChange: (status: Status) => void;
  compact?: boolean;
}

const labels: Record<Status, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

export default function StatusSelect({ status, onChange, compact = false }: StatusSelectProps) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as Status)}
      className={`border rounded-lg font-medium text-xs status-transition cursor-pointer ${getStatusBg(status)} ${compact ? 'px-2 py-1' : 'px-3 py-1.5'}`}
      style={{ backgroundColor: 'transparent', outline: 'none' }}
    >
      <option value="not-started" className="bg-gray-900 text-slate-400">Not Started</option>
      <option value="in-progress" className="bg-gray-900 text-amber-400">In Progress</option>
      <option value="completed" className="bg-gray-900 text-emerald-400">Completed</option>
    </select>
  );
}
