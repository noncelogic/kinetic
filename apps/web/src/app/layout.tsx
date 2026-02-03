import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google';

import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TRPCProvider>
            {children}
            <FeedbackWrapper />
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
