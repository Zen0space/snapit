import { initTRPC, TRPCError } from '@trpc/server'
import type { Request } from 'express'
import { z } from 'zod'

void z // keep import

export interface Context {
  req: Request
}

export const createContext = ({ req }: { req: Request }): Context => ({
  req,
})

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

// Admin procedure — validates ADMIN_PASSWORD env var via Authorization header
const isAdmin = t.middleware(({ ctx, next }) => {
  const authHeader = ctx.req.headers['authorization']
  const token = authHeader?.replace('Bearer ', '')
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || token !== adminPassword) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({ ctx })
})

export const adminProcedure: typeof t.procedure = t.procedure.use(isAdmin) as typeof t.procedure
