'use client';

import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import type { Route } from 'next';
import type { ReactElement, ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
      { label: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Admin', href: '/app/admin', icon: Users },
      { label: 'Logs', href: '/app/logs', icon: FileText },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Profile', href: '/app/settings/profile', icon: Settings },
      { label: 'Notifications', href: '/app/settings/notifications', icon: Bell },
    ],
  },
];

export function Sidebar(): ReactElement {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === '/app';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[260px] bg-[var(--bg-secondary)] fixed top-0 left-0 h-screen z-50 flex flex-col">
      {/* Logo */}
      <div className="p-5">
        <Link href="/" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" className="flex-shrink-0">
            <rect
              x="6"
              y="6"
              width="52"
              height="52"
              rx="12"
              stroke="#f59e0b"
              strokeWidth="3"
              fill="none"
            />
            <path d="M20 16H26V30L40 16H48L30 34L48 48H40L26 34V48H20V16Z" fill="#f59e0b" />
          </svg>
          <span className="font-semibold text-lg tracking-tight">Kinetic</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.label} className="px-3 mb-6">
            <div className="font-mono text-[0.6875rem] uppercase tracking-widest text-[var(--text-muted)] px-3 mb-2">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative
                      ${
                        active
                          ? 'text-[var(--text-primary)] bg-[var(--bg-elevated)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent rounded-r" />
                    )}
                    <item.icon
                      className={`w-[18px] h-[18px] ${active ? 'text-accent' : 'opacity-70'}`}
                    />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto bg-accent text-[var(--bg-primary)] text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer transition-colors group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-dim to-accent flex items-center justify-center font-semibold text-xs text-[var(--bg-primary)]">
            {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{session?.user?.name || 'User'}</div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {session?.user?.email || 'user@example.com'}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]" />
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps): ReactElement {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[260px] min-h-screen">{children}</main>
    </div>
  );
}
