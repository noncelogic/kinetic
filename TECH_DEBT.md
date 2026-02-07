# Technical Debt Log

Track things we know should be fixed. Review periodically and tackle when there's time.

---

## Active Debt

| ID     | Description                  | Impact | Effort | Added      | Status |
| ------ | ---------------------------- | ------ | ------ | ---------- | ------ |
| TD-001 | ESLint config too permissive | Medium | Small  | 2026-02-04 | Open   |
| TD-002 | E2E tests not in CI pipeline | High   | Medium | 2026-02-04 | Open   |
| TD-003 | No seed data for dev DB      | Medium | Small  | 2026-02-07 | Open   |
| TD-004 | Missing loading states in UI | Low    | Medium | 2026-02-07 | Open   |

---

## Resolved Debt

| ID     | Description             | Resolved   | How              |
| ------ | ----------------------- | ---------- | ---------------- |
| TD-000 | Husky pre-commit broken | 2026-02-07 | Fixed npx → pnpm |

---

## Impact Guide

- **High**: Blocks features, causes bugs, security risk
- **Medium**: Slows development, causes confusion
- **Low**: Annoyance, nice-to-have fix

## Effort Guide

- **Small**: < 1 hour
- **Medium**: 1-4 hours
- **Large**: > 4 hours

---

## Adding Debt

When you notice something that should be fixed later:

```markdown
| TD-XXX | [Description] | [Impact] | [Effort] | YYYY-MM-DD | Open |
```

When you fix it, move to Resolved with a note on how.
