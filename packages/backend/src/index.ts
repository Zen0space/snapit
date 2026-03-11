import express from 'express'
import cors from 'cors'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './router'
import { createContext } from './trpc'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9000

// CORS — allow web and admin apps
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:3002')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, etc.)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
  })
)

app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// tRPC handler
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => createContext({ req }),
  })
)

app.listen(PORT, () => {
  console.log(`🚀 Snap-It backend running on http://localhost:${PORT}`)
  console.log(`   tRPC: http://localhost:${PORT}/trpc`)
  console.log(`   Health: http://localhost:${PORT}/health`)
})
