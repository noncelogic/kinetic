'use client';

import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Settings,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

import type { Route } from 'next';
import type { ReactElement } from 'react';

import { PageContent, PageHeader, StatCard, StatGrid, Section } from '@/components/ui';

// Sample data - replace with real data
const recentActivity = [
  { id: 1, type: 'success', action: 'User signed up', details: 'john@example.com', time: '2 minutes ago' },
  { id: 2, type: 'info', action: 'Settings updated', details: 'Notification preferences', time: '15 minutes ago' },
  { id: 3, type: 'success', action: 'API key created', details: 'Production key', time: '1 hour ago' },
  { id: 4, type: 'info', action: 'Report generated', details: 'Weekly summary', time: '2 hours ago' },
];

const activityColors = {
  success: 'text-green-500',
  info: 'text-accent',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

export default function DashboardPage(): ReactElement {
  return (
    <PageContent>
      <PageHeader
        title="Dashboard"
        description="Overview of your application"
      />

      {/* Stats Grid */}
      <Section>
        <StatGrid columns={4}>
          <StatCard
            label="Active Users"
            value="1,234"
            change="+12%"
            changeType="positive"
            icon={Users}
            subtitle="this month"
          />
          <StatCard
            label="API Requests"
            value="45.2K"
            change="+8%"
            changeType="positive"
            icon={Activity}
            subtitle="today"
          />
          <StatCard
            label="Avg Response"
            value="124ms"
            change="-15ms"
            changeType="positive"
            icon={Clock}
            subtitle="p95"
          />
          <StatCard
            label="Uptime"
            value="99.9%"
            change="0%"
            changeType="neutral"
            icon={TrendingUp}
            subtitle="30 days"
          />
        </StatGrid>
      </Section>

      {/* Activity Feed */}
      <Section title="Recent Activity">
        <div className="glass-card-elevated divide-y divide-[var(--border)]">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center flex-shrink-0 ${activityColors[item.type as keyof typeof activityColors]}`}
              >
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.action}</div>
                <div className="text-xs text-[var(--text-muted)] truncate">
                  {item.details}
                </div>
              </div>
              <div className="text-xs text-[var(--text-muted)] flex-shrink-0">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick Actions */}
      <Section title="Quick Actions">
        <div className="grid md:grid-cols-4 gap-4">
          <Link
            href={'/app/analytics' as Route}
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Analytics</div>
              <div className="text-xs text-[var(--text-muted)]">View metrics</div>
            </div>
          </Link>

          <Link
            href={'/app/admin' as Route}
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-[var(--text-muted)]">Manage team</div>
            </div>
          </Link>

          <Link
            href={'/app/settings/profile' as Route}
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Settings</div>
              <div className="text-xs text-[var(--text-muted)]">Your profile</div>
            </div>
          </Link>

          <Link
            href={'/app/logs' as Route}
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Logs</div>
              <div className="text-xs text-[var(--text-muted)]">Activity log</div>
            </div>
          </Link>
        </div>
      </Section>
    </PageContent>
  );
}
