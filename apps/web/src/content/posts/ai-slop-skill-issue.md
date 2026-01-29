---
title: "AI Slop is a Skill Issue (On Your Part)"
date: "2026-01-29"
excerpt: "Why AI-generated code is unmaintainable — and how to fix it with proper structure."
tags: ["ai", "software-engineering", "typescript"]
---

Everyone's scared of AI-generated spaghetti. Vibe-coded prototypes that work once, then crumble when you try to extend them.

Here's the uncomfortable truth: **the problem isn't the AI. It's you.**

## Why AI Produces Slop

Give an LLM a blank canvas and it will paint whatever it wants. That's the problem.

Without constraints, agents:
- Reinvent architecture decisions every session
- Hallucinate data shapes that don't match your API
- Create one-off patterns instead of reusing existing code

## The Fix: Opinionated Structure

The engineers getting real value from AI coding aren't smarter. They're more *structured*.

### 1. Pre-decided Architecture

Tell the AI where code lives:

```markdown
# CLAUDE.md
- Business logic → @repo/service
- Schemas → @repo/entities
- Components → @repo/ui
```

### 2. Type Boundaries with Zod

Agents hallucinate. Types don't.

```typescript
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});
```

### 3. Strict Linting

Your ESLint config is your code reviewer that never sleeps.

---

*I'm building an open-source boilerplate that bakes these patterns in. [Check it out on GitHub](#).*
