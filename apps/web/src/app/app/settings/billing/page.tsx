'use client';

import { Check, CreditCard, Zap } from 'lucide-react';

import type { ReactElement } from 'react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'For individuals and small projects',
    features: [
      '1,000 policy evaluations/mo',
      '1 team member',
      'Community support',
      'Basic analytics',
    ],
    current: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing teams and businesses',
    features: [
      '50,000 policy evaluations/mo',
      '10 team members',
      'Priority support',
      'Advanced analytics',
      'Custom policies',
      'API access',
    ],
    current: true,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited evaluations',
      'Unlimited team members',
      'Dedicated support',
      'Custom SLA',
      'SSO & SAML',
      'Audit logs',
      'On-premise option',
    ],
    current: false,
  },
];

export default function BillingSettings(): ReactElement {
  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <section className="glass-card-elevated p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Current Plan</h2>
            <p className="text-sm text-[var(--text-muted)]">You are currently on the Pro plan.</p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
            Pro
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-semibold">$49</span>
          <span className="text-[var(--text-muted)]">/month</span>
        </div>

        <div className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] mb-4">
          <Zap className="w-5 h-5 text-accent" />
          <div className="flex-1">
            <div className="text-sm font-medium">Policy Evaluations</div>
            <div className="text-xs text-[var(--text-muted)]">32,450 / 50,000 used this month</div>
          </div>
          <div className="text-sm font-medium text-accent">65%</div>
        </div>

        <div className="w-full bg-[var(--bg-primary)] rounded-full h-2 overflow-hidden">
          <div className="bg-accent h-full rounded-full" style={{ width: '65%' }} />
        </div>
      </section>

      {/* Plans */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Available Plans</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Choose the plan that best fits your needs.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                glass-card-elevated p-6 relative
                ${plan.popular ? 'border-accent' : ''}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-accent text-[var(--bg-primary)]">
                  Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-semibold">{plan.price}</span>
                <span className="text-[var(--text-muted)] text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`
                  w-full py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    plan.current
                      ? 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-muted)] cursor-default'
                      : plan.popular
                        ? 'btn-primary'
                        : 'btn-secondary'
                  }
                `}
                disabled={plan.current}
              >
                {plan.current
                  ? 'Current Plan'
                  : plan.id === 'enterprise'
                    ? 'Contact Sales'
                    : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Method */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Payment Method</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">Manage your payment information.</p>

        <div className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
          <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">•••• •••• •••• 4242</div>
            <div className="text-xs text-[var(--text-muted)]">Expires 12/25</div>
          </div>
          <button className="btn-secondary text-xs px-3 py-1.5 rounded-lg">Update</button>
        </div>
      </section>

      {/* Billing History */}
      <section className="glass-card-elevated p-6">
        <h2 className="text-lg font-semibold mb-1">Billing History</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">View and download past invoices.</p>

        <div className="space-y-2">
          {[
            { date: 'Feb 1, 2026', amount: '$49.00', status: 'Paid' },
            { date: 'Jan 1, 2026', amount: '$49.00', status: 'Paid' },
            { date: 'Dec 1, 2025', amount: '$49.00', status: 'Paid' },
          ].map((invoice, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]"
            >
              <div className="text-sm">{invoice.date}</div>
              <div className="text-sm font-medium">{invoice.amount}</div>
              <div className="text-xs text-green-500">{invoice.status}</div>
              <button className="text-xs text-accent hover:underline">Download</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
