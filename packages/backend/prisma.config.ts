import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use a dummy URL if DATABASE_URL is not set (e.g., during Vercel web app build)
    // This allows prisma generate to work without a real database connection
    url: env("DATABASE_URL") || "postgresql://dummy:dummy@localhost:5432/dummy",
  },
});
