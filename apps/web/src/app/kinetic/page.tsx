'use client';

import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  FileText,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

import type { Route } from 'next';
import type { ReactElement } from 'react';

import { PageContent, PageHeader, StatCard, StatGrid, Section } from '@/components/ui';

// Mock data for the dashboard
const recentActivity = [
  {
    id: 1,
    type: 'success',
    action: 'Policy evaluation passed',
    details: 'content-safety policy on gpt-4 request',
    time: '2 minutes ago',
  },
  {
    id: 2,
    type: 'warning',
    action: 'PII detected and redacted',
    details: 'Email address found in user input',
    time: '5 minutes ago',
  },
  {
    id: 3,
    type: 'success',
    action: 'Policy evaluation passed',
    details: 'pii-detection policy on claude-3 request',
    time: '8 minutes ago',
  },
  {
    id: 4,
    type: 'error',
    action: 'Policy violation blocked',
    details: 'Prohibited content detected',
    time: '12 minutes ago',
  },
  {
    id: 5,
    type: 'info',
    action: 'New policy activated',
    details: 'custom-guardrails-v2 now enforcing',
    time: '1 hour ago',
  },
];

const activePolicies = [
  { name: 'content-safety', evaluations: '12.4K', status: 'active', passRate: '99.2%' },
  { name: 'pii-detection', evaluations: '8.7K', status: 'active', passRate: '97.8%' },
  { name: 'prompt-injection', evaluations: '6.2K', status: 'active', passRate: '99.9%' },
  { name: 'rate-limiting', evaluations: '15.1K', status: 'active', passRate: '100%' },
];

const activityIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Activity,
};

const activityColors = {
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-accent',
};

export default function KineticDashboard(): ReactElement {
  return (
    <PageContent>
      <PageHeader title="Dashboard" description="Monitor your AI governance in real-time" />

      {/* Stats Grid */}
      <Section>
        <StatGrid columns={4}>
          <StatCard
            label="Policy Evaluations"
            value="42.4K"
            change="+12.5%"
            changeType="positive"
            icon={Shield}
            subtitle="today"
          />
          <StatCard
            label="Pass Rate"
            value="98.7%"
            change="+0.3%"
            changeType="positive"
            icon={CheckCircle}
            subtitle="vs yesterday"
          />
          <StatCard
            label="Blocked Requests"
            value="547"
            change="-8.2%"
            changeType="positive"
            icon={AlertTriangle}
            subtitle="today"
          />
          <StatCard
            label="Avg Latency"
            value="3.2ms"
            change="-0.4ms"
            changeType="positive"
            icon={Clock}
            subtitle="p99"
          />
        </StatGrid>
      </Section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Section title="Recent Activity">
            <div className="glass-card-elevated divide-y divide-[var(--border)]">
              {recentActivity.map((item) => {
                const Icon = activityIcons[item.type as keyof typeof activityIcons];
                const colorClass = activityColors[item.type as keyof typeof activityColors];
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon className="w-4 h-4" />
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
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Link
                href={'/kinetic/admin' as Route}
                className="text-sm text-accent hover:underline inline-flex items-center gap-1"
              >
                View all activity
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </Section>
        </div>

        {/* Active Policies */}
        <div>
          <Section title="Active Policies">
            <div className="glass-card-elevated divide-y divide-[var(--border)]">
              {activePolicies.map((policy) => (
                <div key={policy.name} className="p-4 hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium font-mono">{policy.name}</span>
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-current rounded-full" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{policy.evaluations} evals</span>
                    <span className="text-green-500">{policy.passRate} pass</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/kinetic/policy-simulator"
                className="text-sm text-accent hover:underline inline-flex items-center gap-1"
              >
                Manage policies
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </Section>
        </div>
      </div>

      {/* Quick Actions */}
      <Section title="Quick Actions">
        <div className="grid md:grid-cols-4 gap-4">
          <Link
            href="/kinetic/policy-simulator"
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Test Policy</div>
              <div className="text-xs text-[var(--text-muted)]">Run simulations</div>
            </div>
          </Link>

          <Link
            href="/kinetic/admin"
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">View Logs</div>
              <div className="text-xs text-[var(--text-muted)]">Audit trail</div>
            </div>
          </Link>

          <Link
            href="/kinetic/settings/billing"
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Usage</div>
              <div className="text-xs text-[var(--text-muted)]">View limits</div>
            </div>
          </Link>

          <Link
            href="#"
            className="glass-card-elevated p-4 flex items-center gap-4 hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-accent group-hover:shadow-accent transition-shadow">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium">Docs</div>
              <div className="text-xs text-[var(--text-muted)]">API reference</div>
            </div>
          </Link>
        </div>
      </Section>
    </PageContent>
  );
}
