# Agentic Turbo Starter - Development Guidelines

**Project**: Project Kinetic / MediaVault
**Stack**: Next.js 15 + tRPC + Prisma + Turborepo

## ⚠️ Before Touching Any UI

**Read `DESIGN.md` first.** It defines:

- Color tokens, typography, spacing
- Signature effects (grain, glass, particles)
- Component patterns
- Anti-patterns to avoid

Reference designs live in `~/designs/v2/*.html` — open in browser for visual context.

**Rules:**

1. Use only tokens from DESIGN.md — never invent colors or spacing
2. If a pattern appears 3x, extract to component library
3. New tokens/patterns → add to DESIGN.md first, then implement

## Project Structure

```
apps/
├── web/                 # Main SaaS application
│   ├── src/app/         # Next.js App Router pages
│   ├── src/components/  # App-specific components
│   └── src/trpc/        # tRPC client setup
└── marketing/           # Static marketing site

packages/
├── @repo/ui/            # Shared UI components (shadcn/ui based)
├── @repo/database/      # Prisma schema + client
├── @repo/service/       # Business logic + tRPC routers
├── @repo/auth/          # Authentication utilities
├── @repo/entities/      # Shared Zod schemas + types
└── @repo/config/        # Shared TypeScript/ESLint configs
```

## Commands

```bash
# Development
pnpm dev                  # Start all apps
pnpm dev --filter=web     # Start specific app
pnpm build                # Build all packages

# Testing
pnpm test                 # Run all tests
pnpm test --filter=@repo/service  # Test specific package

# Database
pnpm db:generate          # Generate Prisma client
pnpm db:push              # Push schema to database
pnpm db:migrate           # Create migration
pnpm db:studio            # Open Prisma Studio

# Code Quality
pnpm lint                 # Lint all packages
pnpm typecheck            # TypeScript check
pnpm format               # Format with Prettier
```

## Code Style

### TypeScript

- Strict mode enabled
- Prefer type inference over explicit annotations
- Use Zod schemas for runtime validation
- Export types from `@repo/entities`

### React

- Server Components by default
- Client Components only when needed (interactivity)
- Colocate components with their routes

### tRPC

- Routers live in `@repo/service/src/routers/`
- Use `protectedProcedure` for authenticated routes
- Input validation with Zod schemas from `@repo/entities`

### Testing

- TDD approach: write failing test first
- Unit tests for business logic in `@repo/service`
- Integration tests for tRPC procedures
- E2E tests for critical user flows

## Current Feature

**Branch**: `main`
**Focus**: [Describe current work]

### Implementation Approach

1. Define Zod schema in `@repo/entities`
2. Write failing test in `@repo/service`
3. Implement tRPC procedure
4. Build UI component in `@repo/ui` or app
5. Connect in the app

## Tips for AI Agents

1. **Check package.json** before suggesting dependencies
2. **Read existing code** in the same package for patterns
3. **Run tests** after implementation: `pnpm test`
4. **One package at a time** — don't edit multiple packages in one response
5. **Update this file** when adding new patterns or commands

## State Management

### XState for Workflows

Complex application flows use XState machines in `@repo/state`:

```typescript
import { useOnboarding } from '@repo/state';

function OnboardingFlow() {
  const [state, send] = useOnboarding();

  if (state.matches('emailStep')) {
    return <EmailForm onNext={(email) => {
      send({ type: 'SET_EMAIL', email });
      send({ type: 'NEXT' });
    }} />;
  }
  // ... other steps
}
```

**Why XState:**

- States are explicit — no impossible transitions
- Guards enforce business rules
- Context is fully typed
- Agents can't produce invalid state logic

### TanStack Form + Zod

Forms are driven by Zod schemas in `@repo/forms`:

```typescript
import { useZodForm, TextField } from '@repo/forms';
import { ContactFormSchema } from '@repo/forms/schemas';

function ContactForm() {
  const form = useZodForm(ContactFormSchema, {
    onSubmit: async (values) => {
      // values is typed from schema
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <form.Field name="email">
        {(field) => <TextField field={field} label="Email" type="email" />}
      </form.Field>
    </form>
  );
}
```

## Linting Rules

This project uses **strict ESLint** to catch agent mistakes:

- No `any` types
- No floating promises
- No unused variables
- Strict boolean expressions
- Import ordering enforced

Run before committing:

```bash
pnpm lint        # Check
pnpm lint:fix    # Auto-fix
```

## Tips for Agents

1. **State machines**: Define all possible states and transitions upfront
2. **Form schemas**: Start with Zod schema, form derives from it
3. **Lint early**: Run `pnpm lint` after changes to catch mistakes
4. **Type errors = stop**: Don't proceed if `pnpm typecheck` fails

---

## 🚦 Quality Gates

### Before EVERY Commit

Run these checks locally. Don't push and pray.

```bash
pnpm typecheck       # Types must pass
pnpm lint            # Lint must pass
pnpm test            # Tests must pass
pnpm format          # Format code
```

Or use the preflight script:

```bash
./scripts/preflight.sh
```

### Before EVERY Push

Full verification suite:

```bash
./scripts/preflight.sh   # Runs: install, db:generate, typecheck, lint, test, build
```

### Pre-Push Checklist

- [ ] Did I run `./scripts/preflight.sh`?
- [ ] Did I check for debug code? (`console.log`, `debugger`, `.only`)
- [ ] Did I update tests for changed behavior?
- [ ] If I touched Prisma schema, did I run `pnpm db:generate`?
- [ ] If I changed shared packages, did I check downstream consumers?
- [ ] Does my commit message explain WHY, not just WHAT?

### When CI Fails

1. **READ** the full error (not just the first line)
2. **REPRODUCE** locally (pull fresh, `pnpm install`, run failing command)
3. **FIX** the root cause (not just the symptom)
4. **VERIFY** with full suite locally (`./scripts/preflight.sh`)
5. **PUSH** a single fix commit (not multiple "fix lint" commits)

### Common CI Failures

| Error            | Likely Cause                        | Fix                           |
| ---------------- | ----------------------------------- | ----------------------------- |
| Type error       | Missing types, wrong imports        | `pnpm typecheck` locally      |
| ESLint error     | Unused var, `any`, floating promise | `pnpm lint --fix`             |
| Test failed      | Logic broke, mock outdated          | `pnpm test` locally           |
| Build failed     | SSR issue, missing env var          | `pnpm build` locally          |
| Prisma error     | Schema changed, client stale        | `pnpm db:generate`            |
| Module not found | Missing dep, wrong path             | Check imports, `pnpm install` |

### Anti-Patterns ❌

| Don't                         | Do Instead                           |
| ----------------------------- | ------------------------------------ |
| Push and pray                 | Run `./scripts/preflight.sh` first   |
| Multiple "fix lint" commits   | Single commit that passes everything |
| Fix only the failing test     | Verify full suite passes             |
| Ignore type errors            | Stop and fix before continuing       |
| Hardcode values to pass tests | Fix the actual issue                 |

---

## 🛠️ Helper Scripts

| Script                             | Purpose                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| `./scripts/preflight.sh`           | Full quality gate (install → typecheck → lint → test → build) |
| `./scripts/db-status.sh`           | Check database connection and migration status                |
| `./scripts/branch-setup.sh <name>` | Create new branch from latest main with validation            |

---

## 🔄 Monorepo Gotchas

### Shared Package Changes Ripple

When you change `@repo/ui`, `@repo/entities`, or `@repo/database`:

- All consumers rebuild
- All consumer tests rerun
- Check downstream: `pnpm build --filter=...^@repo/ui`

### Prisma Client Location

After changing `packages/database/prisma/schema.prisma`:

```bash
pnpm db:generate   # ALWAYS run this
```

The client is generated to `node_modules/.prisma/client`. Forgetting this causes runtime errors.

### Environment Variables

| Location         | Purpose             |
| ---------------- | ------------------- |
| `.env` (root)    | Tooling, scripts    |
| `apps/web/.env`  | Next.js app runtime |
| Vercel dashboard | Production env vars |

Next.js apps don't inherit root `.env` — each app needs its own.

### Turbo Cache

If something weird happens:

```bash
pnpm turbo run build --force   # Skip cache
# or nuclear:
rm -rf .turbo node_modules/.cache
pnpm install
```
