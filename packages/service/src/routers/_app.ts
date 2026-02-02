import { router } from '../trpc'
import { assetRouter } from './asset'
import { healthRouter } from './health'
import { userRouter } from './user'
import { mediaRouter } from './media'

export const appRouter = router({
  health: healthRouter,
  user: userRouter,
  asset: assetRouter,
  media: mediaRouter,
})

export type AppRouter = typeof appRouter
