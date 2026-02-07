#!/bin/bash
# db-status.sh — Check database connection and schema status
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🗄️  Database Status Check${NC}"
echo ""

cd packages/database

# Validate schema syntax
echo -e "${YELLOW}📋 Validating schema...${NC}"
if npx prisma validate; then
  echo -e "${GREEN}✓ Schema valid${NC}"
else
  echo -e "${RED}✗ Schema invalid${NC}"
  exit 1
fi
echo ""

# Check connection
echo -e "${YELLOW}🔌 Checking connection...${NC}"
if npx prisma db pull --print > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Connected to database${NC}"
else
  echo -e "${RED}✗ Cannot connect to database${NC}"
  echo "  Check DATABASE_URL in .env"
  exit 1
fi
echo ""

# Migration status
echo -e "${YELLOW}📊 Migration status...${NC}"
npx prisma migrate status
echo ""

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DATABASE OK${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
