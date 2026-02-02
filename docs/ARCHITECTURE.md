# Architecture Overview

This project uses a layered monorepo architecture to separate concerns and enable agentic workflows.

## Layers

### 1. Application Layer (`apps/web`)
- **Role:** The entry point for users.
- **Tech:** Next.js 15 (App Router).
- **Responsibility:**
  - Routing & Layouts
  - Client-side state (React Query)
  - UI composition using `@repo/ui`
  - tRPC API Routes (`/api/trpc`)

### 2. Service Layer (`packages/service`)
- **Role:** The business logic core.
- **Tech:** Pure TypeScript, Zod.
- **Responsibility:**
  - Defines tRPC routers (procedures)
  - Validates inputs (Zod)
  - Orchestrates database calls
  - Enforces permissions (future)

### 3. Data Layer (`packages/database`)
- **Role:** Data persistence and schema.
- **Tech:** Prisma, PostgreSQL.
- **Responsibility:**
  - Database schema definition (`schema.prisma`)
  - Migrations
  - Type-safe query client

### 4. Shared Utilities
- **`@repo/entities`**: Shared Zod schemas and TypeScript interfaces used by both Client and Service.
- **`@repo/ui`**: Shared React components (shadcn/ui), decoupled from the app logic.
- **`@repo/config`**: Shared build, lint, and TS configurations.

## Data Flow

```mermaid
graph TD
    User -->|Interaction| Client[Next.js Client]
    Client -->|tRPC Query/Mutation| API[Next.js API Route]
    API -->|Procedure Call| Service[@repo/service]
    Service -->|Validation| Entities[@repo/entities]
    Service -->|Query| DB[@repo/database]
    DB -->|SQL| Postgres[(PostgreSQL)]
```

## Agentic Pattern

By isolating **Logic** (Service) from **Presentation** (App/UI), agents can:
1.  **Modify Logic:** Edit `packages/service` to change business rules without breaking UI.
2.  **Modify UI:** Edit `apps/web` or `@repo/ui` to change visuals without breaking logic.
3.  **Refactor:** Move types to `@repo/entities` to share them across boundaries.
