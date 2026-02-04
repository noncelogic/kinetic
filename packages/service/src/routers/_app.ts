import { router } from '../trpc';
import { assetRouter } from './asset';
import { feedbackRouter } from './feedback';
import { healthRouter } from './health';
import { mediaRouter } from './media';
import { userRouter } from './user';

export const appRouter = router({
  health: healthRouter,
  user: userRouter,
  asset: assetRouter,
  media: mediaRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
