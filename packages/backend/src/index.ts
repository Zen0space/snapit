import "dotenv/config";
import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router.js";
import { createContext } from "./trpc.js";

// Validate critical environment variables before starting
const REQUIRED_ENV_VARS = ["ADMIN_PASSWORD", "DATABASE_URL"] as const;
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(
    `FATAL: Missing required environment variables: ${missingVars.join(", ")}`,
  );
  console.error("Server cannot start without these variables set.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9000;

// CORS — allow web and admin apps
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3002"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// tRPC handler
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => createContext({ req }),
  }),
);

app.listen(PORT, () => {
  console.log(`🚀 Snap-It backend running on http://localhost:${PORT}`);
  console.log(`   tRPC: http://localhost:${PORT}/trpc`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});
