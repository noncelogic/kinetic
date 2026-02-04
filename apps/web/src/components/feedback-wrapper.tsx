'use client';

import { FeedbackWidget } from '@repo/feedback';

import { trpc } from '@/trpc/client';

export function FeedbackWrapper() {
  const mutation = trpc.feedback.submit.useMutation();

  return (
    <FeedbackWidget
      onSubmit={async (data) => {
        // Map frontend type to backend type
        const typeMap: Record<string, 'BUG' | 'FEATURE' | 'GENERAL'> = {
          bug: 'BUG',
          feature: 'FEATURE',
          general: 'GENERAL',
          praise: 'GENERAL',
        };

        await mutation.mutateAsync({
          title: data.title,
          description: data.description,
          type: typeMap[data.type] || 'GENERAL',
          email: data.email,
          metadata: data.metadata,
        });
      }}
    />
  );
}
