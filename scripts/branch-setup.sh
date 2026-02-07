#!/bin/bash
# branch-setup.sh — Create a new feature branch from latest main
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BRANCH_NAME=$1

if [ -z "$BRANCH_NAME" ]; then
  echo -e "${RED}Usage: ./scripts/branch-setup.sh <branch-name>${NC}"
  echo ""
  echo "Branch naming convention:"
  echo "  feat/<description>    — New feature"
  echo "  fix/<description>     — Bug fix"
  echo "  chore/<description>   — Maintenance"
  echo "  docs/<description>    — Documentation"
  echo "  refactor/<description> — Code refactor"
  echo ""
  echo "Example: ./scripts/branch-setup.sh feat/add-user-settings"
  exit 1
fi

# Validate branch name format
if ! [[ "$BRANCH_NAME" =~ ^(feat|fix|chore|docs|refactor)/ ]]; then
  echo -e "${YELLOW}⚠️  Warning: Branch name doesn't follow convention${NC}"
  echo "  Expected: feat/, fix/, chore/, docs/, or refactor/"
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo -e "${YELLOW}🌿 Setting up branch: $BRANCH_NAME${NC}"
echo ""

# Ensure we're on main and up to date
echo -e "${YELLOW}📥 Updating main...${NC}"
git checkout main
git pull origin main
echo -e "${GREEN}✓ Main updated${NC}"
echo ""

# Create new branch
echo -e "${YELLOW}🌱 Creating branch...${NC}"
git checkout -b "$BRANCH_NAME"
echo -e "${GREEN}✓ Branch created${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Generate Prisma client
echo -e "${YELLOW}🗄️  Generating Prisma client...${NC}"
pnpm db:generate
echo -e "${GREEN}✓ Prisma client ready${NC}"
echo ""

# Verify clean state
echo -e "${YELLOW}🔷 Verifying clean state...${NC}"
pnpm typecheck
echo -e "${GREEN}✓ Types OK${NC}"
echo ""

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Branch ready: $BRANCH_NAME${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Make your changes"
echo "  2. Run ./scripts/preflight.sh before pushing"
echo "  3. git push -u origin $BRANCH_NAME"
