'use client';

import type { ReactElement, ReactNode } from 'react';

import { SettingsLayout } from '@/components/ui/settings-layout';

interface LayoutProps {
  children: ReactNode;
}

export default function SettingsPageLayout({ children }: LayoutProps): ReactElement {
  return <SettingsLayout>{children}</SettingsLayout>;
}
