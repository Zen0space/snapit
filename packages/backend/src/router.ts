import { router } from "./trpc.js";
import { analyticsRouter } from "./routers/analytics.js";
import { consentRouter } from "./routers/consent.js";

export const appRouter = router({
  analytics: analyticsRouter,
  consent: consentRouter,
});

export type AppRouter = typeof appRouter;
