import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { generateMediaAsset, GenerateMediaSchema } from '../media/generator';
import { simulatePolicyCheck } from '../services/policy';
import { db } from '@repo/database';

export const mediaRouter = router({
  generate: publicProcedure
    .input(GenerateMediaSchema)
    .mutation(async ({ input }) => {
      return generateMediaAsset(input);
    }),

  listJobs: publicProcedure
    .query(async () => {
      return db.generationJob.findMany({
        orderBy: { createdAt: 'desc' },
        include: { asset: true },
        take: 10,
      });
    }),

  checkPolicy: publicProcedure
    .input(z.object({ assetId: z.string() }))
    .query(async ({ input }) => {
      const asset = await db.asset.findUnique({ where: { id: input.assetId } });
      if (!asset) throw new Error("Asset not found");
      return simulatePolicyCheck(asset.content);
    }),
});
