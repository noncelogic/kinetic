#!/bin/bash
# Set up branch protection for main branch
# Usage: ./scripts/setup-branch-protection.sh <owner/repo>

REPO=${1:-"noncelogic/kinetic"}

echo "Setting up branch protection for $REPO..."

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/branches/main/protection" \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true,
  "required_conversation_resolution": true
}
EOF

echo "✓ Branch protection configured for $REPO"
echo ""
echo "Rules applied:"
echo "  - Require PR reviews (1 approval)"
echo "  - Dismiss stale reviews on new commits"
echo "  - Require status checks to pass (CI)"
echo "  - Require linear history (no merge commits)"
echo "  - Require conversation resolution"
echo "  - No force pushes"
echo "  - No branch deletion"
