import Link from 'next/link';
import type { ReactElement } from 'react';
import { ShieldCheck, Zap, Lock, Database, Code, CheckCircle } from 'lucide-react';
import { Button } from '@repo/ui';

export default function Home(): ReactElement {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <ShieldCheck className="w-5 h-5" />
            </div>
            NonceLogic
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#tech-stack" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
              Stack
            </Link>
            <Link href="/media">
              <Button size="sm">
                Launch Concept Car
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Concept Car Live: AI Policy Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Ship AI Features <br className="hidden md:block"/>
            <span className="text-primary">Without The Risk.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            The enterprise-grade boilerplate for Generative AI. 
            Built-in C2PA tagging, PII detection, and policy enforcement rails.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/media">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25">
                Try the Demo
              </Button>
            </Link>
            <Link href="https://github.com/noncelogic/boilerplate" target="_blank">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View on GitHub
              </Button>
            </Link>
          </div>

          {/* Screenshot Placeholder / Frame */}
          <div className="relative rounded-xl border bg-background/50 shadow-2xl p-2 md:p-4 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="rounded-lg overflow-hidden border bg-muted aspect-[16/9] relative group">
               {/* Replace this div with an <Image /> of the dashboard */}
               <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-500">
                  <div className="text-center space-y-2">
                    <Database className="w-12 h-12 mx-auto opacity-20" />
                    <p className="font-mono text-sm">Media Banking Dashboard Preview</p>
                  </div>
               </div>
               
               {/* Simulated UI Overlay */}
               <div className="absolute top-4 left-4 right-4 h-12 bg-zinc-800/50 rounded flex items-center px-4 border border-white/5">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section id="tech-stack" className="py-24 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">The NonceLogic Stack</h2>
            <p className="text-muted-foreground">Opinionated, type-safe, and production-ready.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: 'Next.js 15', desc: 'App Router & Server Actions', icon: Zap },
              { title: 'tRPC', desc: 'End-to-end type safety', icon: Code },
              { title: 'Prisma + Neon', desc: 'Serverless PostgreSQL', icon: Database },
              { title: 'NextAuth v5', desc: 'Own your user data', icon: Lock },
            ].map((tech) => (
              <div key={tech.title} className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <tech.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">{tech.title}</h3>
                <p className="text-sm text-muted-foreground">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Governance as Code.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Don't rely on manual reviews. NonceLogic embeds policy checks directly into the generation pipeline.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Real-time PII Detection & Redaction',
                  'C2PA Content Credentials Injection',
                  'Immutable Audit Logs for Compliance',
                  'RBAC-gated Approval Workflows',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-20 blur-2xl"></div>
              <div className="relative rounded-2xl border bg-background p-6 shadow-2xl">
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between text-muted-foreground border-b pb-2">
                    <span>Policy Engine Output</span>
                    <span>v1.0.2</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>Rule 4.2: C2PA Metadata Present</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>Rule 1.1: No PII Detected</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>Rule 7.0: License Compatible</span>
                    </div>
                    <div className="mt-4 p-3 bg-green-500/10 rounded border border-green-500/20 text-green-600">
                      Status: APPROVED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
             <ShieldCheck className="w-4 h-4" />
             NonceLogic
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NonceLogic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
