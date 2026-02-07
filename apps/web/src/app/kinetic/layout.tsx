import type { ReactElement, ReactNode } from 'react';

import { AppShell } from '@/components/ui/sidebar';
import { Topbar } from '@/components/ui/topbar';

interface KineticLayoutProps {
  children: ReactNode;
}

export default function KineticLayout({ children }: KineticLayoutProps): ReactElement {
  return (
    <AppShell>
      <Topbar />
      {children}
    </AppShell>
  );
}
