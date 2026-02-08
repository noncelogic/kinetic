# Kinetic

A production-ready full-stack starter template for rapidly building modern web applications.

<p align="center">
  <img src="apps/web/public/brand/kinetic-logo.svg" alt="Kinetic" width="64" height="64">
</p>

## Features

- ⚡ **Next.js 14** — App Router, Server Components, Server Actions
- 🔐 **Authentication** — NextAuth with Google OAuth (easily extensible)
- 🗄️ **Database** — Neon Postgres + Drizzle ORM (type-safe queries)
- 🔌 **API** — tRPC for end-to-end type safety
- 🎨 **UI Components** — Pre-built Sidebar, Topbar, StatCards, Settings layouts
- 🌙 **Dark/Light Mode** — CSS variables with matched contrast ratios
- 📦 **Monorepo** — Turborepo + pnpm workspaces
- ✅ **Quality Gates** — ESLint, Prettier, TypeScript strict mode

## Quick Start

```bash
# Clone the template
npx degit noncelogic/kinetic my-app

# Install dependencies
cd my-app
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
│       │   │   ├── app/     # Authenticated app routes
│       │   │   ├── api/     # API routes
│       │   │   └── ...
│       │   ├── components/  # React components
│       │   │   └── ui/      # UI component library
│       │   ├── server/      # Server-side code (tRPC, auth)
│       │   └── lib/         # Utilities
│       └── public/          # Static assets
├── packages/
│   ├── db/                  # Database schema + client
│   ├── ui/                  # Shared UI primitives
│   └── ...
└── tooling/                 # Shared configs (ESLint, TypeScript, Tailwind)
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

# Optional
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Run TypeScript checks
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## UI Components

Pre-built components for common patterns:

| Component | Description |
|-----------|-------------|
| `Sidebar` | App navigation with sections |
| `AppShell` | Layout wrapper with sidebar |
| `Topbar` | Header with search and actions |
| `PageHeader` | Page title with optional actions |
| `PageContent` | Content wrapper with padding |
| `StatCard` | Metric display card |
| `StatGrid` | Grid layout for stats |
| `SettingsLayout` | Settings page with side nav |
| `ComingSoon` | Placeholder for unbuilt pages |

## Customization

### Branding

Update the logo in `apps/web/public/brand/` and modify CSS variables in `apps/web/src/app/globals.css`.

### Adding Pages

1. Create a new folder in `apps/web/src/app/app/`
2. Add a `page.tsx` file
3. Update the navigation in `components/ui/sidebar.tsx`

### Database

1. Edit schema in `packages/db/src/schema/`
2. Run `pnpm db:push` to apply changes
3. Use the typed client in your API routes

## Deployment

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/noncelogic/kinetic)

## License

MIT © [Nonce Logic](https://noncelogic.com)
