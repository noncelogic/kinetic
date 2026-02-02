import { prisma as db } from '@repo/database';
import { z } from 'zod';

export const GenerateMediaSchema = z.object({
  prompt: z.string().min(3),
  userId: z.string(),
});

export async function generateMediaAsset(input: z.infer<typeof GenerateMediaSchema>) {
  // 1. Create Job
  const job = await db.generationJob.create({
    data: {
      userId: input.userId,
      prompt: input.prompt,
      status: 'PROCESSING',
    },
  });

  // 2. Audit Log (Creation)
  await db.auditLog.create({
    data: {
      action: 'ASSET_CREATED', // Using closest enum match
      entityType: 'GenerationJob',
      entityId: job.id,
      actorId: input.userId,
      metadata: { prompt: input.prompt },
    },
  });

  // 3. Simulate Async AI (This would be a queue in prod)
  // For the demo, we fake it "optimistically" or use a timeout if calling from client
  // But since tRPC is req/res, we return the JOB ID and let the client poll.
  
  // Fire-and-forget the "Worker"
  simulateWorker(job.id, input.userId);

  return job;
}

async function simulateWorker(jobId: string, userId: string) {
  // Wait 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Create the Asset
  const asset = await db.asset.create({
    data: {
      type: 'MEDIA',
      title: 'Generated Track',
      description: 'AI Generated audio',
      status: 'PENDING_REVIEW', // The "Banking" twist
      ownerId: userId,
      content: { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Public placeholder
    },
  });

  // Update Job
  await db.generationJob.update({
    where: { id: jobId },
    data: {
      status: 'COMPLETED',
      assetId: asset.id,
      resultUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
  });

  // Audit Log (Completion)
  await db.auditLog.create({
    data: {
      action: 'ASSET_UPDATED',
      entityType: 'Asset',
      entityId: asset.id,
      actorId: 'system', // System performed the generation
      metadata: { status: 'PENDING_REVIEW' },
    },
  });
}
