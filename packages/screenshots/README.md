# @repo/screenshots

Playwright-based screenshot capture for visual regression testing of the Kinetic Boilerplate.

## Prerequisites

Install Playwright browsers (first time only):

```bash
pnpm --filter @repo/screenshots exec playwright install chromium
```

## Running Screenshots

1. **Start the dev server** in one terminal:

   ```bash
   pnpm --filter web dev
   ```

2. **Run screenshot capture** in another terminal:

   ```bash
   pnpm --filter @repo/screenshots capture
   ```

## Output

Screenshots are saved to:

```
packages/screenshots/screenshots/
├── landing.png           # / (Landing page)
├── kinetic-demo.png      # /kinetic (Demo page)
├── policy-simulator.png  # /kinetic/policy-simulator (Key feature)
└── showroom.png          # /showroom (Marketing page)
```

## Updating Baselines

To update baseline screenshots after intentional UI changes:

```bash
pnpm --filter @repo/screenshots capture:update
```

## Configuration

- **Viewport**: 1280x720
- **Browser**: Chromium only
- **Base URL**: http://localhost:3000

Edit `playwright.config.ts` to customize settings.

## Routes Captured

| Route                       | Description      |
| --------------------------- | ---------------- |
| `/`                         | Landing page     |
| `/kinetic`                  | Demo page        |
| `/kinetic/policy-simulator` | Policy simulator |
| `/showroom`                 | Marketing page   |

## Adding New Routes

Edit `tests/capture.spec.ts` and add to the `ROUTES` array:

```ts
const ROUTES: Route[] = [
  // ... existing routes
  { name: 'new-page', path: '/new-page', delay: 1000 },
];
```

## Troubleshooting

- **Timeout errors**: Increase `delay` for pages with heavy animations
- **Missing elements**: Add `waitFor` selector to wait for specific content
- **Dev server not running**: Ensure `pnpm --filter web dev` is running first
