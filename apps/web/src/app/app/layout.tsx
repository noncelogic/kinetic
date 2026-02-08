import type { ReactElement, ReactNode } from 'react';

import { AppShell } from '@/components/ui/sidebar';
import { Topbar } from '@/components/ui/topbar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps): ReactElement {
  return (
    <AppShell>
      <Topbar />
      {children}
    </AppShell>
  );
}
