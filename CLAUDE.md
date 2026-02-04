# Agentic Turbo Starter - Development Guidelines

**Project**: [Your SaaS Name]
**Stack**: Next.js 15 + tRPC + Prisma + Turborepo

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
