import { appRouter, createTRPCContext } from '@repo/service';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request): Promise<Response> => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ userId: undefined }), // Add auth here
  });
};

export { handler as GET, handler as POST };
