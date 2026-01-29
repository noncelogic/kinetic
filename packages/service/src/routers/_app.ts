import { router } from '../trpc';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  // Add more routers here
  // post: postRouter,
});

export type AppRouter = typeof appRouter;
