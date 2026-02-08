# Kinetic

A production-ready full-stack starter for building modern web applications — fast.

<p align="center">
  <img src="apps/web/public/brand/kinetic-logo.svg" alt="Kinetic" width="64" height="64">
</p>

<p align="center">
  <strong>Built by <a href="https://noncelogic.com">Nonce Logic</a></strong>
</p>

---

## Why Kinetic?

**Designed for AI-first development.** Kinetic is structured so AI coding assistants (Claude, Cursor, Copilot) can navigate, understand, and extend your codebase with minimal friction:

- **Strict types everywhere** — AI agents make fewer mistakes
- **Colocated code** — related files live together, easier to reason about
- **Clear package boundaries** — each package has one job
- **Comprehensive CLAUDE.md** — project context for AI agents baked in

Skip the boilerplate. Kinetic gives you everything you need to ship a production app:

- **Auth, database, API** — all wired up and type-safe
- **Pre-built UI components** — sidebars, dashboards, settings pages
- **Modern stack** — the same tools we use for client projects
- **MIT licensed** — use it however you want

## Features

- ⚡ **Next.js 15** — App Router, Server Components, Server Actions
- 🔐 **Authentication** — NextAuth with Google OAuth (easily extensible)
- 🗄️ **Database** — Neon Postgres + Prisma ORM (type-safe queries)
- 🔌 **API** — tRPC for end-to-end type safety
- 🎨 **UI Components** — Sidebar, Topbar, StatCards, Settings layouts
- 🌙 **Dark/Light Mode** — CSS variables with matched contrast ratios
- 📦 **Monorepo** — Turborepo + pnpm workspaces
- ✅ **Quality Gates** — ESLint, Prettier, TypeScript strict mode

## Quick Start

```bash
# Clone the template
npx degit noncelogic/kinetic my-app
cd my-app

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Push database schema
pnpm db:push

# Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
kinetic/
├── apps/
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   ├── server/      # Server-side code (tRPC, auth)
│       │   └── lib/         # Utilities
│       └── public/          # Static assets
├── packages/
│   ├── database/            # Prisma schema + client
│   ├── ui/                  # Shared UI components
│   ├── service/             # tRPC routers + business logic
│   ├── entities/            # Zod schemas + shared types
│   └── ...
└── tooling/                 # Shared configs (ESLint, TS, Tailwind)
```

## Environment Variables

```bash
# Database (Neon)
DATABASE_URL="postgresql://..."

# Auth (NextAuth)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Available Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Build for production     |
| `pnpm typecheck` | Run TypeScript checks    |
| `pnpm lint`      | Run ESLint               |
| `pnpm format`    | Run Prettier             |
| `pnpm db:push`   | Push schema to database  |
| `pnpm db:studio` | Open Prisma Studio       |

## UI Components

Ready-to-use components for common patterns:

| Component        | Description                      |
| ---------------- | -------------------------------- |
| `Sidebar`        | App navigation with sections     |
| `AppShell`       | Layout wrapper with sidebar      |
| `Topbar`         | Header with search and actions   |
| `PageHeader`     | Page title with optional actions |
| `PageContent`    | Content wrapper with padding     |
| `StatCard`       | Metric display card              |
| `StatGrid`       | Grid layout for stats            |
| `SettingsLayout` | Settings page with side nav      |

## Customization

### Branding

Update logos in `apps/web/public/brand/` and CSS variables in `apps/web/src/app/globals.css`.

### Adding Pages

1. Create a folder in `apps/web/src/app/app/`
2. Add a `page.tsx` file
3. Update navigation in `components/ui/sidebar.tsx`

### Database

1. Edit schema in `packages/database/prisma/schema.prisma`
2. Run `pnpm db:push` to apply changes
3. Use the typed Prisma client in your API routes

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/noncelogic/kinetic)

### Railway

```bash
npm i -g @railway/cli
railway login
railway up
```

## Need Help?

- **Use Kinetic yourself** — it's MIT licensed, go build something
- **Want us to build it for you?** — [Talk to us](https://noncelogic.com)

We typically deliver first testable builds in 2 weeks or less.

---

MIT © [Nonce Logic](https://noncelogic.com)
