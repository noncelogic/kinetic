'use client';

import { FeedbackWidget } from '@repo/feedback/widget';

export function FeedbackWrapper() {
  return (
    <FeedbackWidget
      projectId="kinetic-v1"
      onSubmit={async (data) => {
        // TODO: Wire to tRPC mutation
        console.log('Feedback submitted:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }}
    />
  );
}
