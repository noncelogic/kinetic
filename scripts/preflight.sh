#!/bin/bash
# preflight.sh — Full quality gate before commit/push
# Run this before pushing to catch issues locally
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Running preflight checks...${NC}"
echo ""

# Step 1: Install dependencies (frozen)
echo -e "${YELLOW}📦 Step 1/6: Checking dependencies...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies OK${NC}"
echo ""

# Step 2: Prisma generate (in case schema changed)
echo -e "${YELLOW}🗄️  Step 2/6: Generating Prisma client...${NC}"
pnpm db:generate
echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

# Step 3: Type check
echo -e "${YELLOW}🔷 Step 3/6: Type checking...${NC}"
pnpm typecheck
echo -e "${GREEN}✓ Types OK${NC}"
echo ""

# Step 4: Lint
echo -e "${YELLOW}🧹 Step 4/7: Linting...${NC}"
pnpm lint
echo -e "${GREEN}✓ Lint OK${NC}"
echo ""

# Step 5: Format check
echo -e "${YELLOW}📐 Step 5/7: Checking formatting...${NC}"
pnpm format:check
echo -e "${GREEN}✓ Format OK${NC}"
echo ""

# Step 6: Tests
echo -e "${YELLOW}🧪 Step 6/7: Running tests...${NC}"
pnpm test
echo -e "${GREEN}✓ Tests OK${NC}"
echo ""

# Step 7: Build
echo -e "${YELLOW}🏗️  Step 7/7: Building...${NC}"
pnpm build
echo -e "${GREEN}✓ Build OK${NC}"
echo ""

# Summary
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ PREFLIGHT COMPLETE — Ready to push${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
