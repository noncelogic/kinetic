import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import { auth } from '@/auth';
import { FeedbackWrapper } from '@/components/feedback-wrapper';
import { TRPCProvider } from '@/trpc/provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NonceLogic',
  description: 'AI Governance and Generation',
  openGraph: {
    title: 'NonceLogic',
    description: 'AI Governance and Generation',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<ReactElement> {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <TRPCProvider>
            {children}
            <FeedbackWrapper />
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
