# Agentic Turbo Starter

A production-ready monorepo boilerplate optimized for AI-assisted development.

Build maintainable SaaS apps at 10x speed with agentic coding loops.

## Why This Exists

Most AI-generated code is throwaway. This boilerplate changes that by:

- **Structured for agents** — Clear package boundaries agents can reason about
- **Type-safe end-to-end** — TypeScript + Zod + tRPC = less hallucination
- **TDD-friendly** — Test files agents can verify against
- **Monorepo by default** — Ship multiple apps from one codebase

## Stack

- **Build:** Turborepo + pnpm workspaces
- **Apps:** Next.js 15 (App Router, Server Components)
- **API:** tRPC 11 + Zod validation
- **Database:** Prisma + PostgreSQL
- **Auth:** Planned (Clerk integration pending)
- **UI:** Tailwind + shadcn/ui
- **Testing:** Vitest + Testing Library

## Structure

```
├── apps/
│   ├── web/              # Main SaaS app
│   └── marketing/        # Landing page (static export)
├── packages/
│   ├── @repo/ui/         # Shared components
│   ├── @repo/database/   # Prisma client + migrations
│   ├── @repo/service/    # Business logic layer
│   ├── @repo/entities/   # Shared types/schemas
│   └── @repo/config/     # Shared configs (tsconfig, eslint)
├── CLAUDE.md             # Agent instructions (Claude)
├── GEMINI.md             # Agent instructions (Gemini)
└── turbo.json
```

## Agent Instructions

This repo includes `CLAUDE.md` and `GEMINI.md` files with:

- Project structure overview
- Code style guidelines
- Common commands
- Current feature context

Update these files as your project evolves. Agents work better with context.

## Quick Start

```bash
# Clone and install
pnpm install

# Start dev (all apps)
pnpm dev

# Start specific app
pnpm dev --filter=web

# Run tests
pnpm test

# Database
pnpm db:push
pnpm db:generate
```

## Deploy (Vercel) — `apps/web`

This repo is a pnpm + Turborepo monorepo. The deployable prototype is the Next.js app in `apps/web`.

### Option A (recommended): Set Vercel Root Directory

1. Import the repo in Vercel.
2. In **Project Settings → General → Root Directory**, set: `apps/web`
3. Set environment variables (see below).
4. Deploy.

### Option B: Keep Root Directory at repo root

A root `vercel.json` is included to point Vercel at `apps/web`.

### Required environment variables

- `DATABASE_URL` — PostgreSQL connection string used by Prisma.

### Smoke test

After deploy (or locally), the tRPC API route should respond:

- `GET /api/trpc/health.ping` → `{ "result": { "data": { "json": { "ok": true }}}}`

## Philosophy

1. **Packages are boundaries** — Each package has one job. Agents focus better.
2. **Types are documentation** — Zod schemas = runtime validation + agent context.
3. **Tests are specs** — Write the test first. Agent implements to pass.
4. **Small PRs** — One feature, one package, one session.

## Dogfooding

This boilerplate is used to build real SaaS products. If it sucks, we feel it.

## License

MIT

---

_Built for the agentic era._
