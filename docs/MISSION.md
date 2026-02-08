# Kinetic — Mission Brief v2

> Last updated: 2026-02-07
> Status: Draft for review

---

## What Is Kinetic?

**Kinetic is a full-stack starter template** — the foundation we use to rapidly build bespoke applications for clients. It's not a product to sell; it's the engine that powers delivery.

The name reflects the value: **things in motion, accelerated development, momentum from day one.**

---

## Core Value Proposition

> **Quality code. Lots of features. In a short amount of time.**

We're an AI-first development shop. The boilerplate + AI workflow lets us deliver in weeks what traditional agencies take months to build.

**Target audience:** PE firms with portfolio companies needing bespoke automations, SaaS MVPs, or modernized internal tools.

**Differentiator:** Not just faster — _better_. The modular architecture enforces quality checks at every integration layer. AI generates code; the architecture ensures it's production-grade.

---

## The Modular Architecture (The Real "Guardrails")

Kinetic isn't about AI content moderation. The "guardrails" are **architectural**:

- **Shared entity models** — Single source of truth across apps
- **Component library** — Consistent UI, already tested
- **API layer patterns** — tRPC, typed end-to-end
- **Auth/session management** — Solved once, reused everywhere
- **Database patterns** — Migrations, seeding, typed queries

When a client needs multiple apps (portal, admin, onboarding), they share these modules. Less duplication, fewer bugs, faster iteration.

---

## The Landing Page: Problem Analyzer

Instead of a fake "product demo," the landing page features a **Problem Analyzer** — a conversational agent that:

1. **Intake:** Prospect describes their problem (industry, what they need to build)
2. **AI probing:** Narrows down to something solvable by full-stack app(s)
3. **Fit assessment:**
   - ✅ Good fit → Explains how Kinetic boilerplate accelerates their project, what modules apply, rough process
   - ❌ Not a fit → Explains bespoke approach, still demonstrates AI-first advantage
4. **Handoff:** Routes to sales conversation (Joe) if qualified or rate-limited

### Technical Implementation

- **Frontend:** Chat widget or inline section on landing page
- **Backend:** LangChain-powered agent with RAG (retrieval over context docs)
- **Vector store:** pgvector in Neon (already in stack)
- **Context docs:** Case studies, architecture overview, process docs, pricing heuristics
- **Streaming:** Vercel AI SDK for frontend streaming

### Protections

- **Identity capture:** Email before chat starts
- **Rate limiting:** Prevent token harvesting
- **Escalation:** Rate limit or qualified lead → handoff to sales

---

## Infrastructure Direction

**Current:** Vercel-compatible (serverless Next.js)

**Target:** Railway or Render — better fit for multi-service deployments:

- Next.js app
- LangChain/Flowise agent (if containerized)
- Postgres (Neon or Railway-native)
- Redis (rate limiting, queues)
- Future workers/cron jobs

Keep codebase platform-agnostic. A `railway.toml` or `render.yaml` can be added without breaking Vercel compatibility.

---

## What's Already Built (as of 2026-02-07)

### Design System (v2)

- [x] CSS tokens (dark/light mode, matched contrast)
- [x] Component library (Sidebar, Topbar, PageHeader, StatCard, etc.)
- [x] Typography: Space Grotesk + Inter
- [x] Logo: Precision Block (amber #f59e0b)

### Pages

- [x] Landing page (needs copy revision)
- [x] Dashboard (placeholder stats)
- [x] Settings (Profile, Appearance, Billing)
- [x] Coming Soon placeholders (Analytics, Audit Logs, Admin)
- [x] Policy Simulator (to be repurposed or removed)

### Infra

- [x] Auth (NextAuth, Google OAuth)
- [x] Database (Neon Postgres)
- [x] tRPC API layer
- [x] Monorepo structure (apps/web, packages/\*)

---

## Next Steps (Proposed)

### Phase 1: Stabilize the Boilerplate

1. [ ] Strip domain-specific copy (governance, policies, compliance)
2. [ ] Neutralize or remove Policy Simulator page
3. [ ] Update landing page copy to reflect actual value prop
4. [ ] Finalize logo/brand assets (README banner, OG image, favicon)
5. [ ] Add Railway/Render deployment config

### Phase 2: Problem Analyzer

1. [ ] Scaffold chat UI component
2. [ ] Set up LangChain agent with basic context
3. [ ] Add pgvector extension to Neon, create embeddings table
4. [ ] Ingest initial context docs (architecture, process, case study)
5. [ ] Add email capture gate
6. [ ] Add rate limiting middleware
7. [ ] Build escalation/handoff flow

### Phase 3: Content & Polish

1. [ ] Write case study content (sanitized NDTC or similar)
2. [ ] Create process documentation for ingestion
3. [ ] Refine agent prompts based on test conversations
4. [ ] Launch to staging, test with real prospects

---

## Open Questions

1. **Policy Simulator page:** Delete, repurpose as component showcase, or leave as Zod demo?
2. **Chat UI style:** Floating widget (corner) or inline section on landing page?
3. **LangChain hosting:** In-app API route, or separate service (Flowise, LangServe)?
4. **Context docs:** What's the minimum set to start? (Architecture overview, 1 case study, process doc?)
5. **Rate limits:** What thresholds? (e.g., 5 messages before email, 20/day per user?)

---

## References

- **Boilerplate repo:** `~/ws/__active/noncelogic/boilerplate/`
- **NDTC-Web (prior art):** Reference for scope/complexity of delivered work
- **Design files:** `~/designs/v2/*.html`

---

_This document replaces the previous "Phase 2: Concept Car" brief._
