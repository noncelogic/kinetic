# Project Status

Quick orientation for agents and humans. Update this as things change.

---

## What Is This?

**Project Kinetic** — Opinionated Next.js + tRPC + Prisma boilerplate for building SaaS apps fast.

**Demo App**: MediaVault — media licensing platform (concept car to showcase the stack)

---

## Current State

| Area | Status | Notes |
|------|--------|-------|
| **Auth** | ✅ Working | Google OAuth via NextAuth |
| **Database** | ✅ Connected | Neon Postgres |
| **Deploy** | ✅ Live | Vercel (boilerplate-web-ten.vercel.app) |
| **Design System** | ✅ Defined | See DESIGN.md, designs in ~/designs/v2/ |
| **UI Refactor** | 🔄 Not started | Need to apply v2 designs to app |
| **CI** | ✅ Passing | GitHub Actions (181 tests) |

---

## In Progress

*Nothing active right now*

---

## Blocked / Waiting

*Nothing blocked right now*

---

## Recent Changes

| Date | Change |
|------|--------|
| 2026-02-07 | Added quality gates, scripts, error library, ADRs |
| 2026-02-06 | Created v2 design system and HTML mockups |
| 2026-02-04 | Fixed Prisma monorepo bundling (PR #4), OAuth working |

---

## Quick Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build all
pnpm test                   # Run tests

# Quality
./scripts/preflight.sh      # Full quality gate
./scripts/db-status.sh      # Check database

# Database
pnpm db:generate            # Regenerate Prisma client
pnpm db:push                # Push schema changes
pnpm db:studio              # Open Prisma Studio

# Branching
./scripts/branch-setup.sh feat/my-feature
```

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Agent development guidelines |
| `DESIGN.md` | Design system documentation |
| `TECH_DEBT.md` | Known issues to fix |
| `docs/errors/` | Error pattern library |
| `docs/decisions/` | Architecture decisions |

---

## Links

- **Production**: https://boilerplate-web-ten.vercel.app
- **GitHub**: https://github.com/noncelogic/boilerplate
- **Vercel Dashboard**: https://vercel.com/noncelogic/boilerplate-web
