# Architecture Decision Records

When we make significant technical decisions, document them here so future agents/humans understand *why*.

---

## Template

```markdown
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date
YYYY-MM-DD

## Context
[What is the issue we're seeing that motivates this decision?]

## Decision
[What is the change we're proposing/making?]

## Consequences
[What becomes easier or harder as a result?]
```

---

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 001 | Use pnpm for package management | Accepted | 2026-01-28 |
| 002 | Monorepo with Turborepo | Accepted | 2026-01-28 |
| 003 | Design-first UI development | Accepted | 2026-02-06 |

---

# ADR-001: Use pnpm for Package Management

## Status
Accepted

## Date
2026-01-28

## Context
Need a package manager for monorepo. Options: npm, yarn, pnpm.

## Decision
Use pnpm with workspaces.

## Consequences
**Positive:**
- Faster installs (content-addressable storage)
- Disk-efficient (shared dependencies)
- Strict dependency resolution (catches phantom deps)
- Native workspace support

**Negative:**
- Must use `pnpm` not `npx` for local packages
- Some tools assume npm (need occasional workarounds)
- Team needs to install pnpm

---

# ADR-002: Monorepo with Turborepo

## Status
Accepted

## Date
2026-01-28

## Context
Project has multiple packages (ui, database, service, entities) and apps (web, marketing). Need to manage builds, tests, and dependencies efficiently.

## Decision
Use Turborepo for monorepo orchestration.

## Consequences
**Positive:**
- Cached builds (huge speed improvement)
- Parallel execution
- Dependency graph awareness
- Easy to add new apps/packages

**Negative:**
- Learning curve for configuration
- Cache invalidation can be confusing
- Vercel monorepo deploys need specific config

---

# ADR-003: Design-First UI Development

## Status
Accepted

## Date
2026-02-06

## Context
Boilerplate UI was generic shadcn starter. Needed distinctive visual identity without endless iteration in React.

## Decision
1. Define design language in `DESIGN.md` (tokens, effects, patterns)
2. Create static HTML mockups for key screens (`~/designs/v2/`)
3. Extract patterns into component library
4. Refactor app screen-by-screen to match designs

## Consequences
**Positive:**
- Fast iteration on design (no build step)
- Clear source of truth for visual language
- Agents have explicit guidance (no guessing)
- Consistent UI across screens

**Negative:**
- HTML mockups can drift from React implementation
- Two sources of truth (design files vs code) need sync
- Upfront investment before seeing results in app
