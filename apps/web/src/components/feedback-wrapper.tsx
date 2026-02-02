'use client';

import { FeedbackWidget } from '@repo/feedback';

export function FeedbackWrapper() {
  return (
    <FeedbackWidget
      onSubmit={async (data) => {
        // TODO: Wire to tRPC mutation
        console.log('Feedback submitted:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }}
    />
  );
}
