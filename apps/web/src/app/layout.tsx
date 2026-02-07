import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import { auth } from '@/auth';
import { FeedbackWrapper } from '@/components/feedback-wrapper';
import { TRPCProvider } from '@/trpc/provider';

import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kinetic — AI Policy Engine',
  description:
    'Ship AI features without the risk. Enterprise-grade AI governance with built-in policy enforcement.',
  openGraph: {
    title: 'Kinetic — AI Policy Engine',
    description:
      'Ship AI features without the risk. Enterprise-grade AI governance with built-in policy enforcement.',
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
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* Grain overlay for texture */}
        <div className="grain" aria-hidden="true" />

        {/* Mesh gradient background */}
        <div className="mesh-bg" aria-hidden="true" />

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
