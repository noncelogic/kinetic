import { prisma } from '@repo/database';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

export interface Context {
  prisma: typeof prisma;
  userId?: string;
}

export const createTRPCContext = async (opts: { userId?: string }): Promise<Context> => {
  return {
    prisma,
    userId: opts.userId,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});
