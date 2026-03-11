import { router } from './trpc'
import { analyticsRouter } from './routers/analytics'

export const appRouter = router({
  analytics: analyticsRouter,
})

export type AppRouter = typeof appRouter
