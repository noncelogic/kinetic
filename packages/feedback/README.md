# @repo/feedback

Embeddable feedback widget for collecting user feedback in Kinetic apps.

## Features

- 🎯 **4 feedback types**: Bug, Feature Request, General, Praise
- 📸 **Metadata capture**: URL, viewport, user agent, timestamp
- 🎨 **Customizable**: Position, colors, labels
- 🌓 **Dark mode**: Automatic dark/light mode support
- ⚡ **Lightweight**: Minimal bundle size, no external CSS

## Installation

```bash
pnpm add @repo/feedback
```

## Usage

### With Provider (Recommended)

Wrap your app with `FeedbackProvider` to get automatic API integration:

```tsx
import { FeedbackProvider } from '@repo/feedback';

export default function RootLayout({ children }) {
  return (
    <FeedbackProvider
      endpoint="/api/feedback"
      projectId="my-app"
      position="bottom-right"
      accentColor="#6366f1"
      user={{ id: user?.id, email: user?.email }}
      onSuccess={(feedback) => console.log('Submitted:', feedback)}
    >
      {children}
    </FeedbackProvider>
  );
}
```

### Standalone Widget

Use the widget directly with custom submission logic:

```tsx
import { FeedbackWidget } from '@repo/feedback/widget';

export function MyFeedbackButton() {
  const handleSubmit = async (submission) => {
    await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  };

  return <FeedbackWidget onSubmit={handleSubmit} />;
}
```

### Using the Hook

Access feedback context from any component:

```tsx
import { useFeedback } from '@repo/feedback';

function MyComponent() {
  const { submitFeedback, config } = useFeedback();

  const handleCustomFeedback = async () => {
    await submitFeedback({
      type: 'feature',
      title: 'Custom submission',
      description: 'Submitted programmatically',
      metadata: { timestamp: new Date().toISOString() },
    });
  };

  return <button onClick={handleCustomFeedback}>Submit</button>;
}
```

## API Reference

### FeedbackWidgetConfig

| Prop                   | Type                                                           | Default          | Description                  |
| ---------------------- | -------------------------------------------------------------- | ---------------- | ---------------------------- |
| `endpoint`             | `string`                                                       | required         | API endpoint for submissions |
| `projectId`            | `string`                                                       | required         | Project identifier           |
| `position`             | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Widget position              |
| `accentColor`          | `string`                                                       | `'#6366f1'`      | Primary color                |
| `enableScreenshot`     | `boolean`                                                      | `false`          | Enable screenshot capture    |
| `captureConsoleErrors` | `boolean`                                                      | `false`          | Capture console errors       |
| `labels`               | `object`                                                       | `{}`             | Custom UI labels             |
| `user`                 | `{ id?, email?, name? }`                                       | `undefined`      | Pre-fill user info           |
| `onSuccess`            | `(feedback) => void`                                           | `undefined`      | Success callback             |
| `onError`              | `(error) => void`                                              | `undefined`      | Error callback               |

### FeedbackSubmission

```ts
interface FeedbackSubmission {
  type: 'bug' | 'feature' | 'general' | 'praise';
  title: string;
  description: string;
  email?: string;
  metadata: FeedbackMetadata;
}
```

## Database Schema (Prisma)

Suggested schema for storing feedback:

```prisma
model Feedback {
  id          String   @id @default(cuid())
  projectId   String
  type        String   // 'bug' | 'feature' | 'general' | 'praise'
  status      String   @default("pending")
  priority    String   @default("medium")
  title       String
  description String?  @db.Text
  email       String?
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  resolvedAt  DateTime?
  assignedTo  String?
  tags        String[]

  @@index([projectId, status])
  @@index([createdAt])
}
```

## License

MIT
