'use client';

import Link from 'next/link';
import { useState, useEffect, type ReactElement } from 'react';

// ============================================================================
// SECRET SAUCE DIAGRAM - SVG Component
// ============================================================================
function SecretSauceDiagram(): ReactElement {
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 2000);
    return () => { clearInterval(interval); };
  }, []);

  const steps = [
    { id: 'pdf', label: 'PDF Policy', icon: '📄', x: 100, y: 200 },
    { id: 'ai', label: 'AI Analysis', icon: '🧠', x: 280, y: 200 },
    { id: 'zod', label: 'Zod Schema', icon: '🛡️', x: 460, y: 200 },
    { id: 'nextjs', label: 'Next.js App', icon: '⚡', x: 640, y: 200 },
    { id: 'feedback', label: 'Feedback', icon: '💬', x: 640, y: 80 },
    { id: 'refine', label: 'Refinement', icon: '🔄', x: 280, y: 80 },
  ];

  return (
    <svg
      viewBox="0 0 800 300"
      className="w-full max-w-4xl mx-auto"
      style={{ height: 'auto', minHeight: '250px' }}
    >
      <defs>
        {/* Gradient for active flow */}
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748B" />
        </marker>
        
        <marker
          id="arrowheadActive"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="url(#flowGradient)" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="800" height="300" fill="transparent" />

      {/* Arrows - Main flow (horizontal) */}
      <path
        d="M 150 200 L 230 200"
        stroke={activeStep === 0 ? "url(#flowGradient)" : "#475569"}
        strokeWidth={activeStep === 0 ? "3" : "2"}
        fill="none"
        markerEnd={activeStep === 0 ? "url(#arrowheadActive)" : "url(#arrowhead)"}
        className="transition-all duration-500"
        filter={activeStep === 0 ? "url(#glow)" : "none"}
      />
      <path
        d="M 330 200 L 410 200"
        stroke={activeStep === 1 ? "url(#flowGradient)" : "#475569"}
        strokeWidth={activeStep === 1 ? "3" : "2"}
        fill="none"
        markerEnd={activeStep === 1 ? "url(#arrowheadActive)" : "url(#arrowhead)"}
        className="transition-all duration-500"
        filter={activeStep === 1 ? "url(#glow)" : "none"}
      />
      <path
        d="M 510 200 L 590 200"
        stroke={activeStep === 2 ? "url(#flowGradient)" : "#475569"}
        strokeWidth={activeStep === 2 ? "3" : "2"}
        fill="none"
        markerEnd={activeStep === 2 ? "url(#arrowheadActive)" : "url(#arrowhead)"}
        className="transition-all duration-500"
        filter={activeStep === 2 ? "url(#glow)" : "none"}
      />

      {/* Arrows - Feedback loop (up, left, down) */}
      <path
        d="M 640 150 L 640 120"
        stroke={activeStep === 3 ? "url(#flowGradient)" : "#475569"}
        strokeWidth={activeStep === 3 ? "3" : "2"}
        fill="none"
        markerEnd={activeStep === 3 ? "url(#arrowheadActive)" : "url(#arrowhead)"}
        className="transition-all duration-500"
        filter={activeStep === 3 ? "url(#glow)" : "none"}
      />
      <path
        d="M 590 80 L 330 80"
        stroke={activeStep === 4 ? "url(#flowGradient)" : "#475569"}
        strokeWidth={activeStep === 4 ? "3" : "2"}
        fill="none"
        markerEnd={activeStep === 4 ? "url(#arrowheadActive)" : "url(#arrowhead)"}
        className="transition-all duration-500"
        filter={activeStep === 4 ? "url(#glow)" : "none"}
      />
      <path
        d="M 280 120 L 280 150"
        stroke={activeStep === 5 ? "url(#flowGradient)" : "#475569"}
        strokeWidth={activeStep === 5 ? "3" : "2"}
        fill="none"
        markerEnd={activeStep === 5 ? "url(#arrowheadActive)" : "url(#arrowhead)"}
        className="transition-all duration-500"
        filter={activeStep === 5 ? "url(#glow)" : "none"}
      />

      {/* Step Nodes */}
      {steps.map((step, index) => (
        <g key={step.id} className="transition-all duration-500">
          {/* Node circle */}
          <circle
            cx={step.x}
            cy={step.y}
            r="40"
            fill={activeStep === index ? "#1E293B" : "#0F172A"}
            stroke={activeStep === index ? "url(#flowGradient)" : "#334155"}
            strokeWidth={activeStep === index ? "3" : "2"}
            filter={activeStep === index ? "url(#glow)" : "none"}
          />
          
          {/* Icon */}
          <text
            x={step.x}
            y={step.y - 5}
            textAnchor="middle"
            fontSize="24"
            className="select-none"
          >
            {step.icon}
          </text>
          
          {/* Label */}
          <text
            x={step.x}
            y={step.y + 70}
            textAnchor="middle"
            fill={activeStep === index ? "#F8FAFC" : "#94A3B8"}
            fontSize="13"
            fontWeight={activeStep === index ? "600" : "400"}
            className="transition-all duration-500"
          >
            {step.label}
          </text>
        </g>
      ))}

      {/* Center Label */}
      <text
        x="400"
        y="150"
        textAnchor="middle"
        fill="#64748B"
        fontSize="11"
        fontWeight="500"
        letterSpacing="0.1em"
      >
        CONTINUOUS REFINEMENT
      </text>
    </svg>
  );
}

// ============================================================================
// LOOM HERO PLACEHOLDER
// ============================================================================
function LoomHeroPlaceholder(): ReactElement {
  return (
    <div className="relative w-full aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Placeholder content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Play button */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-2xl shadow-violet-500/30 hover:scale-110 transition-transform cursor-pointer group">
          <svg className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        
        <p className="text-white font-medium text-lg">Watch the Demo</p>
        <p className="text-slate-400 text-sm mt-1">See Kinetic in action (2:30)</p>
        
        {/* Loom badge */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/50">
          <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-xs text-slate-400">Powered by Loom</span>
        </div>
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
}

// ============================================================================
// FEATURE CARD COMPONENT
// ============================================================================
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps): ReactElement {
  return (
    <div className="group relative bg-slate-800/30 rounded-2xl border border-slate-700/30 p-6 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02]">
      <div className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function KineticMarketingPage(): ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-semibold text-white">Kinetic</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
            <a href="#policy-engine" className="text-sm text-slate-400 hover:text-white transition-colors">Policy Engine</a>
            <a href="#demo" className="text-sm text-slate-400 hover:text-white transition-colors">Demo</a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/kinetic/policy-simulator"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105"
            >
              Try Simulator
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-sm text-violet-300 font-medium">Introducing Kinetic Policy Engine</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Don&apos;t Write Requirements.</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
              Run Them.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your policy documents. Watch them transform into enforceable code. 
            No translation meetings. No interpretation gaps. Just working software.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kinetic/policy-simulator"
              className="px-8 py-4 rounded-xl text-lg font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-2xl hover:shadow-violet-500/30 transition-all hover:scale-105"
            >
              See It In Action
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-xl text-lg font-medium border border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Loom Hero Video Section */}
      <section id="demo" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <LoomHeroPlaceholder />
        </div>
      </section>

      {/* Secret Sauce Diagram Section */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Secret Sauce
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From PDF to production in a continuous refinement loop. 
              Your policies become living, breathing software.
            </p>
          </div>
          
          {/* Diagram */}
          <div className="bg-slate-800/30 rounded-3xl border border-slate-700/30 p-8 md:p-12">
            <SecretSauceDiagram />
            
            {/* Step descriptions */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-700/30">
              <div className="text-center">
                <div className="text-violet-400 font-semibold mb-2">1. Extract</div>
                <p className="text-sm text-slate-400">
                  AI analyzes your policy PDFs and extracts rules, constraints, and business logic.
                </p>
              </div>
              <div className="text-center">
                <div className="text-fuchsia-400 font-semibold mb-2">2. Translate</div>
                <p className="text-sm text-slate-400">
                  Rules become Zod schemas—type-safe, runtime-validated, immediately executable.
                </p>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-semibold mb-2">3. Refine</div>
                <p className="text-sm text-slate-400">
                  Feedback from production flows back. The system learns. Policies evolve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Engine Section */}
      <section id="policy-engine" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="text-sm text-emerald-300 font-medium">🛡️ Policy Engine</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Guardrails That Think
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The Policy Engine doesn&apos;t just validate—it understands context, 
              learns from violations, and evolves with your business.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="📜"
              title="Document Intelligence"
              description="Upload PDFs, Word docs, or plain text. AI extracts the intent and constraints automatically."
              gradient="bg-violet-500/20"
            />
            <FeatureCard
              icon="🛡️"
              title="Zod-Powered Validation"
              description="Every rule becomes a type-safe schema. Violations are caught at compile time and runtime."
              gradient="bg-emerald-500/20"
            />
            <FeatureCard
              icon="⚡"
              title="Real-Time Enforcement"
              description="Policies run alongside your code. No separate compliance checks. Just built-in guardrails."
              gradient="bg-orange-500/20"
            />
            <FeatureCard
              icon="🔗"
              title="Traceability"
              description="Every code block links back to its source policy. Auditors love it. Developers love it more."
              gradient="bg-blue-500/20"
            />
            <FeatureCard
              icon="🔄"
              title="Continuous Learning"
              description="Feedback loops refine the engine. Edge cases become training data. The system improves."
              gradient="bg-pink-500/20"
            />
            <FeatureCard
              icon="🗄️"
              title="DB-First Knowledge"
              description="All policies live in your database. Version-controlled, queryable, always in sync."
              gradient="bg-amber-500/20"
            />
          </div>
        </div>
      </section>

      {/* How It Works (Process) Section */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Translation, Not Code Generation
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              We don&apos;t generate boilerplate. We translate intent into enforcement. 
              Your policies become the software—not documentation about the software.
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Upload Your Policy',
                description: 'Drop in your compliance docs, approval workflows, or business rules. Any format works.',
                color: 'violet',
              },
              {
                step: '02',
                title: 'AI Extracts Rules',
                description: 'Natural language becomes structured constraints. Ambiguity gets flagged for human review.',
                color: 'fuchsia',
              },
              {
                step: '03',
                title: 'Zod Schemas Generated',
                description: 'Each rule translates to type-safe validation. Your IDE catches violations before they ship.',
                color: 'orange',
              },
              {
                step: '04',
                title: 'Deploy & Enforce',
                description: 'Schemas integrate into your Next.js app. Policies become runtime guarantees.',
                color: 'emerald',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-6 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <span className={`text-${item.color}-400 font-mono font-bold`}>{item.step}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Stop Writing Requirements?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            See the Policy Engine in action. Try the interactive simulator 
            and watch policies become code.
          </p>
          <Link
            href="/kinetic/policy-simulator"
            className="inline-block px-10 py-5 rounded-xl text-xl font-medium bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-violet-500/30 transition-all hover:scale-105"
          >
            Try the Policy Simulator →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Kinetic. Built by NonceLogic.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
