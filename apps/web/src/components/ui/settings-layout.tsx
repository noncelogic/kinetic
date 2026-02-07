'use client';

import { User, Palette, CreditCard, Bell, Shield, Key } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { Route } from 'next';
import type { ReactElement, ReactNode } from 'react';

const settingsNav = [
  { label: 'Profile', href: '/kinetic/settings/profile', icon: User },
  { label: 'Appearance', href: '/kinetic/settings/appearance', icon: Palette },
  { label: 'Billing', href: '/kinetic/settings/billing', icon: CreditCard },
  { label: 'Notifications', href: '/kinetic/settings/notifications', icon: Bell },
  { label: 'Security', href: '/kinetic/settings/security', icon: Shield },
  { label: 'API Keys', href: '/kinetic/settings/api-keys', icon: Key },
];

interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps): ReactElement {
  const pathname = usePathname();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Settings</h1>
        <p className="text-[var(--text-secondary)]">
          Manage your account preferences and configurations.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Settings Navigation */}
        <nav className="w-56 flex-shrink-0">
          <ul className="space-y-1">
            {settingsNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href as Route}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${
                        active
                          ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }
                    `}
                  >
                    <item.icon
                      className={`w-[18px] h-[18px] ${active ? 'text-accent' : 'opacity-70'}`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings Content */}
        <div className="flex-1 max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
