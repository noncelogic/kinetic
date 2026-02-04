import { prisma } from '@repo/database';
import { z } from 'zod';

import { router, publicProcedure } from '../trpc';

export const feedbackRouter = router({
  submit: publicProcedure // Allowing public for now (anonymous feedback), or switch to protected
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        type: z.enum(['BUG', 'FEATURE', 'GENERAL']), // Simplified enum
        email: z.string().email().optional(),
        metadata: z.any().optional(), // For screenshot/url
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Map simplified type to DB Enum if needed, or update DB Enum
      // DB has: BUG_REPORT, FEATURE_REQUEST, GENERAL, REVIEW_COMMENT

      let dbType: 'BUG_REPORT' | 'FEATURE_REQUEST' | 'GENERAL' = 'GENERAL';
      if (input.type === 'BUG') {
        dbType = 'BUG_REPORT';
      }
      if (input.type === 'FEATURE') {
        dbType = 'FEATURE_REQUEST';
      }

      return prisma.feedback.create({
        data: {
          title: input.title,
          description: input.description,
          type: dbType,
          metadata: input.metadata || {},
          authorEmail: input.email,
          authorId: ctx.userId || undefined, // Link if logged in
        },
      });
    }),
});
