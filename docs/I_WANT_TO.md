# I Want To...

Quick reference for common tasks. Copy-paste ready.

---

## Development

### Start the dev server

```bash
pnpm dev
```

### Start just the web app

```bash
pnpm dev --filter=web
```

### Check if everything builds

```bash
pnpm build
```

---

## Quality Checks

### Run everything before pushing

```bash
./scripts/preflight.sh
```

### Just type check

```bash
pnpm typecheck
```

### Just lint

```bash
pnpm lint
```

### Just tests

```bash
pnpm test
```

### Tests for one package

```bash
pnpm test --filter=@repo/service
```

---

## Database

### Check database status

```bash
./scripts/db-status.sh
```

### Regenerate Prisma client (after schema change)

```bash
pnpm db:generate
```

### Push schema to database

```bash
pnpm db:push
```

### Open Prisma Studio (GUI)

```bash
pnpm db:studio
```

### Create a migration

```bash
cd packages/database
npx prisma migrate dev --name <migration-name>
```

---

## Git / Branches

### Start a new feature branch

```bash
./scripts/branch-setup.sh feat/my-feature
```

### See what's changed

```bash
git diff main...HEAD
```

### Check for debug code before pushing

```bash
git diff HEAD~1 | grep -E "(console\.log|debugger|\.only)"
```

---

## Add New Things

### Add a tRPC endpoint

1. Define input schema in `packages/entities/src/`
2. Write test in `packages/service/src/routers/__tests__/`
3. Implement in `packages/service/src/routers/`
4. Run `pnpm test --filter=@repo/service`

### Add a UI component

1. Check `DESIGN.md` for tokens and patterns
2. Create in `packages/ui/src/components/`
3. Use only design tokens (no ad-hoc colors/spacing)
4. Export from `packages/ui/src/index.ts`

### Add a new page

1. Create in `apps/web/src/app/<route>/page.tsx`
2. Server Component by default
3. Add 'use client' only if needed

---

## Troubleshooting

### Prisma client not found

```bash
pnpm db:generate
```

### Stale builds / weird behavior

```bash
rm -rf .turbo node_modules/.cache
pnpm install
pnpm build
```

### Pre-commit hook failing

Make sure `.husky/pre-commit` uses `pnpm lint-staged` not `npx lint-staged`

### Check the error library

```bash
cat docs/errors/README.md
```

---

## Deploy

### Push to trigger Vercel preview

```bash
git push origin HEAD
```

### Check Vercel deployment status

Go to: https://vercel.com/noncelogic/boilerplate-web
