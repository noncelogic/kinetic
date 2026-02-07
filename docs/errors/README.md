# Error Pattern Library

When you hit an error, check here first. If you solve something new, add it.

---

## Prisma

### PrismaClientInitializationError: Query Engine not found

**When**: After deploy to Vercel/Lambda
**Symptoms**: 500 errors, "could not locate Query Engine for runtime rhel-openssl-3.0.x"

**Cause**: Prisma engine binary not bundled by Next.js in monorepo

**Fix**:
1. Add to `packages/database/prisma/schema.prisma`:
   ```prisma
   generator client {
     provider      = "prisma-client-js"
     binaryTargets = ["native", "rhel-openssl-3.0.x"]
     output        = "../../../node_modules/.prisma/client"
   }
   ```
2. Add to `apps/web/next.config.ts`:
   ```typescript
   serverExternalPackages: ["@prisma/client", "@repo/database"]
   ```
3. Redeploy **without** build cache

**Commits**: `a362745`, `00be03a`

---

### Unknown field / Unknown model

**When**: After schema change
**Cause**: Prisma client not regenerated

**Fix**: 
```bash
pnpm db:generate
```

---

## Vercel

### No Output Directory named 'public' found

**When**: First deploy of Turborepo monorepo
**Cause**: Vercel doesn't know which app to build

**Fix**:
1. Set Root Directory to `apps/web` in Vercel dashboard
2. Enable "Include files outside root directory"
3. Leave Build Command and Output Directory at defaults

**Commit**: `5cf1603`

---

### redirect_uri_mismatch (OAuth)

**When**: OAuth login on new domain
**Cause**: Redirect URI not registered in OAuth provider

**Fix**:
1. Go to GCP Console → APIs & Services → Credentials
2. Add new domain to JavaScript Origins
3. Add callback URL to Redirect URIs: `https://<domain>/api/auth/callback/google`

---

## Husky / Git Hooks

### npm error: No matching version found for undefined@lint-staged

**When**: Commit in pnpm monorepo
**Cause**: Using `npx` instead of `pnpm` in husky hook

**Fix**: Change `.husky/pre-commit` from:
```bash
npx lint-staged
```
to:
```bash
pnpm lint-staged
```

**Commit**: `21755e1`

---

## Turbo

### Stale build / Unexpected behavior

**When**: After dependency changes, or "it works locally but not in CI"
**Cause**: Turbo cache serving old build

**Fix**:
```bash
pnpm turbo run build --force
# or nuclear:
rm -rf .turbo node_modules/.cache
pnpm install
pnpm build
```

---

## Adding New Errors

When you solve a new error, add it here:

```markdown
### [Error Title]

**When**: [context when this occurs]
**Symptoms**: [what you see]

**Cause**: [root cause]

**Fix**: [step-by-step solution]

**Commit**: [reference commit if applicable]
```
