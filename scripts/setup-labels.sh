#!/bin/bash
# Apply GitHub labels from labels.yml
# Usage: ./scripts/setup-labels.sh <owner/repo>

REPO=${1:-"noncelogic/kinetic"}

# Delete default labels first (optional)
# gh label delete "bug" -R "$REPO" --yes 2>/dev/null

# Create labels
gh label create "bug" -c "d73a4a" -d "Something isn't working" -R "$REPO" --force
gh label create "enhancement" -c "a2eeef" -d "New feature or request" -R "$REPO" --force
gh label create "documentation" -c "0075ca" -d "Improvements or additions to documentation" -R "$REPO" --force
gh label create "question" -c "d876e3" -d "Further information is requested" -R "$REPO" --force
gh label create "triage" -c "fbca04" -d "Needs triage" -R "$REPO" --force
gh label create "confirmed" -c "0e8a16" -d "Bug confirmed, ready to fix" -R "$REPO" --force
gh label create "wontfix" -c "ffffff" -d "This will not be worked on" -R "$REPO" --force
gh label create "duplicate" -c "cfd3d7" -d "This issue or PR already exists" -R "$REPO" --force
gh label create "priority: critical" -c "b60205" -d "Must be fixed ASAP" -R "$REPO" --force
gh label create "priority: high" -c "d93f0b" -d "Should be fixed soon" -R "$REPO" --force
gh label create "priority: medium" -c "fbca04" -d "Normal priority" -R "$REPO" --force
gh label create "priority: low" -c "c2e0c6" -d "Nice to have" -R "$REPO" --force
gh label create "area: auth" -c "5319e7" -d "Authentication related" -R "$REPO" --force
gh label create "area: database" -c "5319e7" -d "Database/Prisma related" -R "$REPO" --force
gh label create "area: ui" -c "5319e7" -d "UI components" -R "$REPO" --force
gh label create "area: api" -c "5319e7" -d "tRPC/API related" -R "$REPO" --force
gh label create "area: dx" -c "5319e7" -d "Developer experience" -R "$REPO" --force
gh label create "good first issue" -c "7057ff" -d "Good for newcomers" -R "$REPO" --force
gh label create "help wanted" -c "008672" -d "Extra attention is needed" -R "$REPO" --force
gh label create "breaking change" -c "b60205" -d "Introduces breaking changes" -R "$REPO" --force

echo "✓ Labels created for $REPO"
