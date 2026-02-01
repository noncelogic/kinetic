'use client';

import Link from 'next/link';
import { useState, useEffect, type ReactElement } from 'react';

// ============================================================================
// KINETIC BRAND SYSTEM
// ============================================================================
// Colors: #050505 (dark), #FF5F00 (orange), #00FF41 (green)
// Fonts: JetBrains Mono (mono) + Satoshi (sans)

// ============================================================================
// VELOCITY TICKER COMPONENT
// ============================================================================
function VelocityTicker(): ReactElement {
  const [metrics, setMetrics] = useState({
    sprints: 47,
    daysAverage: 12.3,
    signoffs: 94,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        sprints: prev.sprints + Math.floor(Math.random() * 2),
        daysAverage: Math.max(10, prev.daysAverage - Math.random() * 0.1),
        signoffs: Math.min(99, prev.signoffs + Math.random() * 0.5),
      }));
    }, 3000);
    return () => { clearInterval(interval); };
  }, []);

  return (
    <div className="relative overflow-hidden border-y border-[#00FF41]/20 bg-[#050505]/80 backdrop-blur-xl">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 65, 0.03) 2px,
              rgba(0, 255, 65, 0.03) 4px
            )`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8 overflow-x-auto scrollbar-hide">
          {/* Ticker Items */}
          <div className="flex items-center gap-3 min-w-fit">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span className="font-mono text-xs text-[#00FF41]/60 uppercase tracking-wider">
              Active Sprints
            </span>
            <span className="font-mono text-lg font-bold text-[#00FF41]">
              {metrics.sprints}
            </span>
          </div>

          <div className="w-px h-6 bg-[#00FF41]/20" />

          <div className="flex items-center gap-3 min-w-fit">
            <span className="font-mono text-xs text-[#FF5F00]/60 uppercase tracking-wider">
              Avg. Days to Sign-off
            </span>
            <span className="font-mono text-lg font-bold text-[#FF5F00]">
              {metrics.daysAverage.toFixed(1)}
            </span>
          </div>

          <div className="w-px h-6 bg-[#00FF41]/20" />

          <div className="flex items-center gap-3 min-w-fit">
            <span className="font-mono text-xs text-[#00FF41]/60 uppercase tracking-wider">
              Approval Rate
            </span>
            <span className="font-mono text-lg font-bold text-[#00FF41]">
              {metrics.signoffs.toFixed(0)}%
            </span>
          </div>

          <div className="w-px h-6 bg-[#00FF41]/20" />

          <div className="flex items-center gap-3 min-w-fit">
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">
              Status
            </span>
            <span className="font-mono text-sm font-medium text-[#00FF41] flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]" />
              </span>
              OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BLUEPRINT GRID BACKGROUND
// ============================================================================
function BlueprintGrid(): ReactElement {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Finer grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      />

      {/* Corner markers */}
      <svg className="absolute top-8 left-8 w-16 h-16 text-[#00FF41]/10" viewBox="0 0 64 64">
        <path d="M0 20 L0 0 L20 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute top-8 right-8 w-16 h-16 text-[#00FF41]/10" viewBox="0 0 64 64">
        <path d="M44 0 L64 0 L64 20" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-8 left-8 w-16 h-16 text-[#00FF41]/10" viewBox="0 0 64 64">
        <path d="M0 44 L0 64 L20 64" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-8 right-8 w-16 h-16 text-[#00FF41]/10" viewBox="0 0 64 64">
        <path d="M44 64 L64 64 L64 44" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ============================================================================
// HUD BADGE COMPONENT
// ============================================================================
interface HUDBadgeProps {
  label: string;
  value: string;
  color?: 'green' | 'orange';
}

function HUDBadge({ label, value, color = 'green' }: HUDBadgeProps): ReactElement {
  const colorClass = color === 'green' ? 'text-[#00FF41]' : 'text-[#FF5F00]';
  const borderClass = color === 'green' ? 'border-[#00FF41]/30' : 'border-[#FF5F00]/30';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${borderClass} bg-[#050505]/50 backdrop-blur-sm`}>
      <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
      <span className={`font-mono text-sm font-bold ${colorClass}`}>{value}</span>
    </div>
  );
}

// ============================================================================
// PROBLEM/SOLUTION SECTION
// ============================================================================
function ProblemSolutionSection(): ReactElement {
  const problems = [
    {
      icon: '⏳',
      problem: 'Months of discovery meetings',
      solution: 'Structured sprint with clear milestones',
    },
    {
      icon: '📋',
      problem: 'Requirements that never get built',
      solution: 'Working prototype by Day 7',
    },
    {
      icon: '🔄',
      problem: 'Endless revision cycles',
      solution: 'Focused feedback loops, one iteration',
    },
    {
      icon: '❓',
      problem: '"We\'ll know it when we see it"',
      solution: 'Signed-off spec before code begins',
    },
  ];

  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#FF5F00]/30 bg-[#FF5F00]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF5F00]" />
            <span className="font-mono text-xs text-[#FF5F00] uppercase tracking-wider">
              The Problem
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Traditional Projects <span className="text-[#FF5F00]">Break</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
            You've seen it before. Discovery drags. Scope creeps. 
            The prototype arrives months late—and still misses the mark.
          </p>
        </div>

        {/* Problem/Solution Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((item, index) => (
            <div
              key={index}
              className="group relative bg-[#0a0a0a]/80 rounded-lg border border-white/5 p-6 hover:border-[#00FF41]/20 transition-all duration-500"
            >
              {/* Problem side */}
              <div className="flex items-start gap-4 mb-4 pb-4 border-b border-white/5">
                <span className="text-2xl opacity-50 group-hover:opacity-30 transition-opacity">{item.icon}</span>
                <div>
                  <span className="font-mono text-[10px] text-[#FF5F00]/60 uppercase tracking-wider">Problem</span>
                  <p className="text-white/60 line-through decoration-[#FF5F00]/40 group-hover:text-white/30 transition-colors">
                    {item.problem}
                  </p>
                </div>
              </div>

              {/* Solution side */}
              <div className="flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">✓</span>
                <div>
                  <span className="font-mono text-[10px] text-[#00FF41]/60 uppercase tracking-wider">Solution</span>
                  <p className="text-[#00FF41] font-medium">{item.solution}</p>
                </div>
              </div>

              {/* HUD corner */}
              <svg className="absolute top-0 right-0 w-8 h-8 text-[#00FF41]/10" viewBox="0 0 32 32">
                <path d="M24 0 L32 0 L32 8" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PROCESS TIMELINE
// ============================================================================
function ProcessTimeline(): ReactElement {
  const phases = [
    {
      day: '0-3',
      title: 'Discovery Sprint',
      description: 'Stakeholder interviews, constraint mapping, success metrics defined.',
      status: 'lock',
    },
    {
      day: '4-7',
      title: 'Blueprint Prototype',
      description: 'Clickable prototype built. Core flows validated with real users.',
      status: 'build',
    },
    {
      day: '8-11',
      title: 'Refinement Cycle',
      description: 'One focused iteration. Edge cases handled. Polish applied.',
      status: 'refine',
    },
    {
      day: '12-14',
      title: 'Sign-off Package',
      description: 'Spec document, prototype handoff, implementation roadmap delivered.',
      status: 'ship',
    },
  ];

  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#00FF41]/30 bg-[#00FF41]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span className="font-mono text-xs text-[#00FF41] uppercase tracking-wider">
              The Process
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Zero to Sign-off in <span className="text-[#00FF41]">14 Days</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
            A battle-tested process that delivers clarity, not chaos. 
            Every day has a purpose. Every output is tangible.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00FF41]/50 via-[#FF5F00]/50 to-[#00FF41]/50" />

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Day marker */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-lg border border-[#00FF41]/30 bg-[#050505] flex items-center justify-center z-10">
                  <div className="text-center">
                    <span className="font-mono text-[10px] text-white/40 block">DAY</span>
                    <span className="font-mono text-sm font-bold text-[#00FF41]">{phase.day}</span>
                  </div>
                </div>

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-[calc(50%-4rem)] ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-[#0a0a0a]/80 rounded-lg border border-white/5 p-6 hover:border-[#00FF41]/20 transition-all">
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                      {phase.title}
                    </h3>
                    <p className="text-white/50 text-sm">{phase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOCIAL PROOF SECTION
// ============================================================================
function SocialProofSection(): ReactElement {
  const testimonials = [
    {
      quote: "14 days sounded aggressive. We shipped in 12. The blueprint approach eliminated the usual back-and-forth.",
      author: "Sarah Chen",
      role: "VP Product, FinTech Startup",
      avatar: "SC",
    },
    {
      quote: "Finally, a process that respects our time. No death by committee. Just structured progress.",
      author: "Marcus Webb",
      role: "CTO, Healthcare Platform",
      avatar: "MW",
    },
  ];

  return (
    <section className="relative py-24 px-6 z-10 bg-[#0a0a0a]/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-white/30 uppercase tracking-wider">
            Trusted by Product Teams
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="relative bg-[#050505]/80 rounded-lg border border-white/5 p-8"
            >
              {/* Quote mark */}
              <span className="absolute top-6 right-6 text-4xl text-[#00FF41]/10 font-serif">"</span>

              <p className="text-white/70 text-lg mb-6 leading-relaxed">{t.quote}</p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5F00] to-[#00FF41] flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-[#050505]">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{t.author}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================
function CTASection(): ReactElement {
  return (
    <section className="relative py-32 px-6 z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* HUD Frame */}
        <div className="relative">
          {/* Corner accents */}
          <svg className="absolute -top-4 -left-4 w-8 h-8 text-[#00FF41]/30" viewBox="0 0 32 32">
            <path d="M0 12 L0 0 L12 0" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <svg className="absolute -top-4 -right-4 w-8 h-8 text-[#00FF41]/30" viewBox="0 0 32 32">
            <path d="M20 0 L32 0 L32 12" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <svg className="absolute -bottom-4 -left-4 w-8 h-8 text-[#00FF41]/30" viewBox="0 0 32 32">
            <path d="M0 20 L0 32 L12 32" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <svg className="absolute -bottom-4 -right-4 w-8 h-8 text-[#00FF41]/30" viewBox="0 0 32 32">
            <path d="M20 32 L32 32 L32 20" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>

          <div className="py-16 px-8 border border-[#00FF41]/10 rounded-lg bg-[#050505]/50 backdrop-blur-xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Ready to <span className="text-[#00FF41]">Ship</span>?
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 font-light">
              Stop waiting for requirements to be "final." Start building with clarity.
              <br />
              Book your Prototype Sprint or download the methodology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#book"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[#FF5F00] text-[#050505] font-bold text-lg hover:bg-[#FF5F00]/90 transition-all hover:scale-105"
              >
                <span>Book a Prototype Sprint</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              <a
                href="#download"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-[#00FF41]/30 text-[#00FF41] font-bold text-lg hover:bg-[#00FF41]/5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download the Blueprint</span>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              <HUDBadge label="Response Time" value="< 24h" />
              <HUDBadge label="Satisfaction" value="100%" />
              <HUDBadge label="Sprints Completed" value="47+" color="orange" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN SHOWROOM PAGE
// ============================================================================
export default function ShowroomPage(): ReactElement {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Blueprint Grid Background */}
      <BlueprintGrid />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Kinetic Logo */}
            <div className="w-10 h-10 rounded-lg border border-[#00FF41]/30 bg-[#050505] flex items-center justify-center relative overflow-hidden">
              <span className="font-mono font-bold text-[#00FF41] text-lg">K</span>
              {/* Scan line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF41]/10 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            <div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Kinetic
              </span>
              <span className="hidden sm:inline text-xs text-white/30 ml-2 font-mono">SHOWROOM</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#process" className="font-mono text-xs text-white/50 hover:text-[#00FF41] transition-colors uppercase tracking-wider">
              Process
            </a>
            <a href="#proof" className="font-mono text-xs text-white/50 hover:text-[#00FF41] transition-colors uppercase tracking-wider">
              Results
            </a>
            <Link href="/kinetic" className="font-mono text-xs text-white/50 hover:text-[#00FF41] transition-colors uppercase tracking-wider">
              Platform
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#book"
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#FF5F00] text-[#050505] hover:bg-[#FF5F00]/90 transition-all hover:scale-105"
            >
              Book Sprint
            </a>
          </div>
        </div>
      </nav>

      {/* Velocity Ticker */}
      <div className="pt-16">
        <VelocityTicker />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#00FF41]/30 bg-[#00FF41]/5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]" />
            </span>
            <span className="font-mono text-xs text-[#00FF41] uppercase tracking-wider">
              Now Accepting Sprint Clients
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            <span className="text-white">Zero to Sign-off</span>
            <br />
            <span className="text-[#00FF41]">in 14 Days</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Skip the months of discovery theater. Get a working prototype, validated spec, 
            and implementation roadmap—all in two weeks.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#book"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[#FF5F00] text-[#050505] font-bold text-lg hover:bg-[#FF5F00]/90 transition-all hover:scale-105"
            >
              <span>Book a Prototype Sprint</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <a
              href="#download"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-[#00FF41]/30 text-[#00FF41] font-bold text-lg hover:bg-[#00FF41]/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download the Blueprint</span>
            </a>
          </div>

          {/* HUD Metrics */}
          <div className="flex flex-wrap justify-center gap-4">
            <HUDBadge label="Timeline" value="14 DAYS" />
            <HUDBadge label="Deliverables" value="3 ARTIFACTS" color="orange" />
            <HUDBadge label="Guarantee" value="SIGN-OFF" />
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <ProblemSolutionSection />

      {/* Process Timeline */}
      <div id="process">
        <ProcessTimeline />
      </div>

      {/* Social Proof */}
      <div id="proof">
        <SocialProofSection />
      </div>

      {/* CTA Section */}
      <div id="book">
        <CTASection />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-[#00FF41]/30 bg-[#050505] flex items-center justify-center">
              <span className="font-mono font-bold text-[#00FF41] text-sm">K</span>
            </div>
            <span className="text-white/40 text-sm font-mono">
              © {new Date().getFullYear()} Kinetic by NonceLogic
            </span>
          </div>
          <div className="flex gap-6 text-sm font-mono text-white/30">
            <a href="#" className="hover:text-[#00FF41] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#00FF41] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#00FF41] transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Global Styles for animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        @font-face {
          font-family: 'Satoshi';
          src: url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
          font-weight: 400 900;
          font-style: normal;
        }

        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        body {
          font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
    </div>
  );
}
