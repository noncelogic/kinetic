# Design System — Project Kinetic

**Philosophy**: Precise, dark, technical, calm.

This document defines the visual language for the application. All UI work must reference and extend this system — never invent ad-hoc values.

---

## Reference Designs

Static HTML mockups live in `~/designs/v2/`:

| Screen                | File                       | Purpose                          |
| --------------------- | -------------------------- | -------------------------------- |
| Landing               | `landing.html`             | Marketing page, hero treatment   |
| Dashboard             | `dashboard.html`           | Authenticated home, data density |
| Policy Simulator      | `policy-simulator.html`    | Complex interactive UI           |
| Admin                 | `admin.html`               | Tables, bulk actions             |
| Settings - Profile    | `settings-profile.html`    | Form layouts                     |
| Settings - Appearance | `settings-appearance.html` | Preferences UI                   |
| Settings - Billing    | `settings-billing.html`    | Payment, plans                   |

Open these files directly in a browser for visual reference.

---

## Color Tokens

### Backgrounds

| Token            | Hex       | Usage                |
| ---------------- | --------- | -------------------- |
| `--bg-primary`   | `#0a0a0b` | Page background      |
| `--bg-secondary` | `#111113` | Cards, sections      |
| `--bg-elevated`  | `#18181b` | Hover states, modals |
| `--bg-hover`     | `#1f1f23` | Interactive hover    |

### Text

| Token              | Hex       | Usage                  |
| ------------------ | --------- | ---------------------- |
| `--text-primary`   | `#fafafa` | Headings, body         |
| `--text-secondary` | `#a1a1aa` | Descriptions, labels   |
| `--text-muted`     | `#52525b` | Placeholders, disabled |

### Accent

| Token          | Hex       | Usage                          |
| -------------- | --------- | ------------------------------ |
| `--accent`     | `#22d3ee` | Primary actions, links, focus  |
| `--accent-dim` | `#0891b2` | Hover states, secondary accent |

### Borders

| Token            | Value                    | Usage           |
| ---------------- | ------------------------ | --------------- |
| `--border`       | `rgba(255,255,255,0.06)` | Default borders |
| `--border-hover` | `rgba(255,255,255,0.12)` | Hover borders   |

### Semantic

| Token       | Hex       | Usage           |
| ----------- | --------- | --------------- |
| `--success` | `#22c55e` | Positive states |
| `--warning` | `#f59e0b` | Caution states  |
| `--error`   | `#ef4444` | Error states    |

---

## Typography

### Fonts

| Family             | Usage               | Load                   |
| ------------------ | ------------------- | ---------------------- |
| **Space Grotesk**  | Headings, body, UI  | `wght@400;500;600;700` |
| **JetBrains Mono** | Code, data, metrics | `wght@400;500`         |

### Scale

```css
--text-xs: 0.75rem; /* 12px - labels, badges */
--text-sm: 0.875rem; /* 14px - body small */
--text-base: 1rem; /* 16px - body */
--text-lg: 1.125rem; /* 18px - lead text */
--text-xl: 1.25rem; /* 20px - section headers */
--text-2xl: 1.5rem; /* 24px - page headers */
--text-3xl: 1.875rem; /* 30px - hero subhead */
--text-4xl: 2.25rem; /* 36px - hero title */
--text-5xl: 3rem; /* 48px - display */
```

### Line Heights

- Headings: `1.1` - `1.2`
- Body: `1.6`
- Tight (UI): `1.4`

---

## Spacing

Base unit: `4px`

| Token        | Value  | Usage             |
| ------------ | ------ | ----------------- |
| `--space-1`  | `4px`  | Tight gaps        |
| `--space-2`  | `8px`  | Related elements  |
| `--space-3`  | `12px` | Component padding |
| `--space-4`  | `16px` | Section gaps      |
| `--space-6`  | `24px` | Card padding      |
| `--space-8`  | `32px` | Section spacing   |
| `--space-12` | `48px` | Major sections    |
| `--space-16` | `64px` | Page sections     |

---

## Border Radius

| Token           | Value    | Usage               |
| --------------- | -------- | ------------------- |
| `--radius-sm`   | `6px`    | Buttons, inputs     |
| `--radius-md`   | `8px`    | Cards               |
| `--radius-lg`   | `12px`   | Modals, large cards |
| `--radius-xl`   | `16px`   | Feature sections    |
| `--radius-full` | `9999px` | Pills, avatars      |

---

## Shadows

Minimal shadows — rely on borders and elevation via background:

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.6);
```

---

## Signature Effects

### 1. Grain Overlay

Adds subtle texture across the entire UI. Applied globally via `::before` pseudo-element.

```css
.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
}

.grain::before {
  content: '';
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url('data:image/svg+xml,...'); /* fractalNoise */
  animation: grain 0.5s steps(1) infinite;
}
```

**When to use**: Always on. It's a global overlay.

### 2. Glassmorphism Cards

Frosted glass effect for elevated content.

```css
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
```

**When to use**: Modals, floating panels, feature highlights.

### 3. Particle Network (Hero Only)

Animated canvas with floating particles and connecting lines. Conveys "infrastructure" and "network."

**When to use**: Landing page hero section only. Not for app interiors.

### 4. Mesh Gradient Background

Subtle radial gradients with cyan tints.

```css
.mesh-bg {
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(14, 165, 233, 0.08) 0%, transparent 50%);
}
```

**When to use**: Landing page backgrounds, hero sections.

---

## Component Patterns

### Buttons

| Variant   | Background    | Text               | Border     |
| --------- | ------------- | ------------------ | ---------- |
| Primary   | `--accent`    | `--bg-primary`     | none       |
| Secondary | `transparent` | `--text-primary`   | `--border` |
| Ghost     | `transparent` | `--text-secondary` | none       |
| Danger    | `--error`     | `white`            | none       |

All buttons: `--radius-sm`, `font-weight: 500`, smooth hover transitions.

### Cards

| Variant     | Background                      | Border                    |
| ----------- | ------------------------------- | ------------------------- |
| Default     | `--bg-secondary`                | `--border`                |
| Elevated    | `--bg-elevated`                 | `--border`                |
| Glass       | `rgba(255,255,255,0.02)` + blur | `--border`                |
| Interactive | Default + hover → `--bg-hover`  | `--border-hover` on hover |

### Inputs

- Background: `--bg-secondary`
- Border: `--border` → `--accent` on focus
- Placeholder: `--text-muted`
- Focus ring: `0 0 0 2px rgba(34,211,238,0.2)`

### Navigation

- Sidebar: `--bg-secondary` background, fixed width
- Active item: `--bg-elevated` + left accent border
- Hover: `--bg-hover`

---

## Animation

### Timing

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### Principles

- Micro-interactions: `--duration-fast`
- State transitions: `--duration-normal`
- Layout changes: `--duration-slow`
- Use opacity + transform, avoid animating layout properties

---

## Anti-Patterns ❌

| Don't                              | Do Instead                               |
| ---------------------------------- | ---------------------------------------- |
| Invent hex colors                  | Use design tokens                        |
| Hard-code spacing (`margin: 17px`) | Use spacing scale                        |
| Mix font families arbitrarily      | Space Grotesk for UI, JetBrains for code |
| Use bright pure colors             | Stick to the muted palette               |
| Add shadows everywhere             | Rely on borders and background elevation |
| Animate height/width               | Animate opacity and transform            |
| Put particle network everywhere    | Hero only                                |

---

## For Agents

When building or extending UI:

1. **Reference the HTML designs** — open them in browser for visual context
2. **Use only defined tokens** — if a value isn't here, propose adding it
3. **Check component patterns** — don't reinvent buttons, cards, inputs
4. **Apply signature effects consistently** — grain is global, glass is elevated, particles are hero-only
5. **If it appears 3x, extract it** — add to component library

When proposing new patterns:

1. Add to this document first
2. Get approval
3. Then implement

---

## Evolution Log

| Date       | Change                    | Rationale                                      |
| ---------- | ------------------------- | ---------------------------------------------- |
| 2026-02-06 | Initial v2 design system  | Moved from generic shadcn to custom dark theme |
| 2026-02-06 | Added grain overlay       | Adds warmth and texture to flat dark UI        |
| 2026-02-06 | Particle network for hero | Conveys "infrastructure" visually              |
