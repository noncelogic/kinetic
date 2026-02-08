'use client';

import { Construction } from 'lucide-react';

import type { ReactElement } from 'react';

import { PageContent } from '@/components/ui';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps): ReactElement {
  return (
    <PageContent>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-[var(--text-muted)] max-w-md">
          {description || "We're working on this. Check back soon."}
        </p>
      </div>
    </PageContent>
  );
}
