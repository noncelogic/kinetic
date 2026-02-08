import { Button } from '@repo/ui';
import { RefreshCw, Lock, Sparkles, Users, Webhook, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import type { ReactElement } from 'react';

import { auth } from '@/auth';
import { UserNav } from '@/components/user-nav';

export default async function Home(): Promise<ReactElement> {
  const session = await auth();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 w-full z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
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

          <ul className="hidden md:flex items-center gap-10">
            <li>
              <Link
                href="#features"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all group-hover:w-full" />
              </Link>
            </li>
            <li>
              <Link
                href="#platform"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group"
              >
                Platform
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all group-hover:w-full" />
              </Link>
            </li>
            <li>
              <Link
                href="/kinetic"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all group-hover:w-full" />
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center pt-32 pb-20 px-8 max-w-[1400px] mx-auto relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full text-sm text-[var(--text-secondary)] mb-8 w-fit animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Now in public beta
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6">
          <span className="block">Ship AI features</span>
          <span className="block">with confidence,</span>
          <span className="block text-gradient-accent">not compliance fear.</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-[var(--text-secondary)] max-w-xl leading-relaxed mb-10">
          Enterprise-grade AI governance infrastructure. Built-in C2PA tagging, PII detection, and
          policy enforcement rails—all in one platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {session ? (
            <Link href="/kinetic">
              <Button className="btn-primary h-12 px-6 text-base inline-flex items-center gap-2 group">
                Open Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <form
              action={async () => {
                'use server';
                const { signIn } = await import('@/auth');
                await signIn('google', { redirectTo: '/kinetic' });
              }}
            >
              <Button
                type="submit"
                className="btn-primary h-12 px-6 text-base inline-flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          )}
          <Link href="#platform">
            <Button variant="outline" className="btn-secondary h-12 px-6 text-base">
              View Platform
            </Button>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 mt-16 border-t border-[var(--border)]">
          <div>
            <div className="text-4xl font-semibold tracking-tight text-gradient">500K+</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Policies enforced</div>
          </div>
          <div>
            <div className="text-4xl font-semibold tracking-tight text-gradient">99.99%</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Uptime SLA</div>
          </div>
          <div>
            <div className="text-4xl font-semibold tracking-tight text-gradient">&lt;10ms</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Avg latency</div>
          </div>
          <div>
            <div className="text-4xl font-semibold tracking-tight text-gradient">SOC 2</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">Type II certified</div>
          </div>
        </div>

        {/* Floating Cards (Desktop only) */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[40%]">
          <div className="relative h-96">
            {/* Card 1 */}
            <div className="glass-card absolute right-[15%] top-[20%] px-4 py-3 font-mono text-xs animate-[float1_6s_ease-in-out_infinite]">
              <span className="flex items-center gap-2 text-green-500">
                <span className="w-1.5 h-1.5 bg-current rounded-full" />
                Policy validated
              </span>
            </div>
            {/* Card 2 */}
            <div className="glass-card absolute right-[5%] top-[45%] px-4 py-3 animate-[float2_7s_ease-in-out_infinite]">
              <div className="text-2xl font-semibold text-accent">2.4ms</div>
              <div className="text-xs text-[var(--text-muted)]">avg latency</div>
            </div>
            {/* Card 3 */}
            <div className="glass-card absolute right-[25%] top-[65%] px-4 py-3 animate-[float3_5s_ease-in-out_infinite]">
              <div className="text-2xl font-semibold text-accent">0</div>
              <div className="text-xs text-[var(--text-muted)]">PII leaks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 block">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Built for serious AI operations
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Everything you need to ship AI features safely at scale. No compromises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: CheckCircle,
              title: 'Policy Enforcement',
              desc: 'Define rules once. Kinetic enforces them everywhere, automatically.',
            },
            {
              icon: RefreshCw,
              title: 'Real-time Validation',
              desc: 'Every request validated against your policies in milliseconds.',
            },
            {
              icon: Sparkles,
              title: 'PII Detection',
              desc: 'AI-powered detection catches sensitive data before it leaks.',
            },
            {
              icon: Lock,
              title: 'Enterprise Security',
              desc: 'SOC 2 Type II. End-to-end encryption. Your data stays yours.',
            },
            {
              icon: Users,
              title: 'Multi-tenant',
              desc: 'Manage multiple teams and policies from one dashboard.',
            },
            {
              icon: Webhook,
              title: 'Webhooks & Events',
              desc: 'Real-time event streams. Build reactive compliance workflows.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card-elevated p-6 group hover:border-[var(--border-hover)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-4 text-accent group-hover:shadow-accent transition-shadow">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="py-32 px-8 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 block">
            Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Developer-first infrastructure
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Simple APIs, powerful primitives. Ship compliance in hours, not months.
          </p>
        </div>

        {/* Code Preview Card */}
        <div className="glass-card-elevated p-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <pre className="font-mono text-sm text-[var(--text-secondary)] overflow-x-auto">
            <code>
              <span className="text-[#c678dd]">const</span> result ={' '}
              <span className="text-[#c678dd]">await</span> kinetic.policies.
              <span className="text-[#61afef]">evaluate</span>({'{'}
              {'\n'}
              {'  '}
              <span className="text-[#e06c75]">input</span>:{' '}
              <span className="text-[#98c379]">&quot;Generate a summary of...&quot;</span>,{'\n'}
              {'  '}
              <span className="text-[#e06c75]">model</span>:{' '}
              <span className="text-[#98c379]">&quot;gpt-4&quot;</span>,{'\n'}
              {'  '}
              <span className="text-[#e06c75]">policies</span>: [
              <span className="text-[#98c379]">&quot;pii-detection&quot;</span>,{' '}
              <span className="text-[#98c379]">&quot;content-safety&quot;</span>],{'\n'}
              {'}'});{'\n'}
              {'\n'}
              <span className="text-[var(--text-muted)]">{'// '}✓ Policy evaluated in 3ms</span>
            </code>
          </pre>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 max-w-[1400px] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Ready to ship?</h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-10">
          Join teams building AI features with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <Link href="/kinetic">
              <Button className="btn-primary h-12 px-8 text-base">Open Dashboard</Button>
            </Link>
          ) : (
            <form
              action={async () => {
                'use server';
                const { signIn } = await import('@/auth');
                await signIn('google', { redirectTo: '/kinetic' });
              }}
            >
              <Button type="submit" className="btn-primary h-12 px-8 text-base">
                Start for free
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dim rounded-lg flex items-center justify-center text-[var(--bg-primary)] font-bold text-sm">
                  K
                </div>
                <span className="font-semibold">Kinetic</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] max-w-xs">
                Enterprise-grade AI governance for teams who ship.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-4">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li>
                  <Link href="#features" className="hover:text-[var(--text-primary)] transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#platform" className="hover:text-[var(--text-primary)] transition">
                    Platform
                  </Link>
                </li>
                <li>
                  <Link href="/kinetic" className="hover:text-[var(--text-primary)] transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-4">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li>
                  <Link href="#" className="hover:text-[var(--text-primary)] transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[var(--text-primary)] transition">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[var(--text-primary)] transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-4">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li>
                  <Link href="#" className="hover:text-[var(--text-primary)] transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[var(--text-primary)] transition">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[var(--text-primary)] transition">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
            <div>© 2026 Kinetic. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-[var(--text-primary)] transition">
                Terms
              </Link>
              <Link href="#" className="hover:text-[var(--text-primary)] transition">
                Privacy
              </Link>
              <Link href="#" className="hover:text-[var(--text-primary)] transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
