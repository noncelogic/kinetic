'use client';

import { Search, Bell, HelpCircle } from 'lucide-react';

import type { ReactElement, ReactNode } from 'react';

interface TopbarProps {
  title?: string;
  children?: ReactNode;
}

export function Topbar({ title, children }: TopbarProps): ReactElement {
  return (
    <header className="sticky top-0 z-40 px-8 py-4 bg-[rgba(10,10,11,0.8)] backdrop-blur-xl flex items-center justify-between gap-8">
      {/* Left side - Title or Search */}
      <div className="flex-1 max-w-xl">
        {title ? (
          <h1 className="text-xl font-semibold">{title}</h1>
        ) : (
          <div className="flex items-center gap-3 bg-[var(--bg-elevated)] rounded-lg px-4 py-2.5 focus-within:ring-1 focus-within:ring-accent/30 transition-all">
            <Search className="w-[18px] h-[18px] text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search policies, logs, users..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <kbd className="font-mono text-[0.6875rem] text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {children}
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all">
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
}
