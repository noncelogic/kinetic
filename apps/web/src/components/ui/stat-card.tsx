import { LucideIcon } from 'lucide-react';

import type { ReactElement, ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  subtitle?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  subtitle,
}: StatCardProps): ReactElement {
  const changeColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-[var(--text-muted)]',
  };

  return (
    <div className="glass-card-elevated p-6 group hover:border-[var(--border-hover)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="text-3xl font-semibold tracking-tight mb-1">{value}</div>

      {(change || subtitle) && (
        <div className="flex items-center gap-2">
          {change && (
            <span className={`text-sm font-medium ${changeColors[changeType]}`}>{change}</span>
          )}
          {subtitle && <span className="text-sm text-[var(--text-muted)]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function StatGrid({ children, columns = 4 }: StatGridProps): ReactElement {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={`grid gap-6 ${gridCols[columns]}`}>{children}</div>;
}
