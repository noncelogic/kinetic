import { router } from '../trpc'
import { assetRouter } from './asset'
import { healthRouter } from './health'
import { userRouter } from './user'
import { mediaRouter } from './media'
import { feedbackRouter } from './feedback'

export const appRouter = router({
  health: healthRouter,
  user: userRouter,
  asset: assetRouter,
  media: mediaRouter,
  feedback: feedbackRouter,
})

export type AppRouter = typeof appRouter
