'use client';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}

const colorMap: Record<string, string> = {
  cyan: 'from-cyan-400 to-cyan-500',
  violet: 'from-violet-400 to-violet-500',
  rose: 'from-rose-400 to-rose-500',
  emerald: 'from-emerald-400 to-emerald-500',
  amber: 'from-amber-400 to-amber-500',
  default: 'from-cyan-400 to-blue-500',
};

export default function ProgressBar({ percentage, color = 'default', height = 'h-2', showLabel = false }: ProgressBarProps) {
  const gradientClass = colorMap[color] || colorMap.default;
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium mono" style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span className="text-xs font-bold mono" style={{ color: 'var(--text-primary)' }}>{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full overflow-hidden`} style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <div
          className={`${height} rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
