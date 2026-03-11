import { z } from 'zod'
import geoip from 'geoip-lite'
import { UAParser } from 'ua-parser-js'
import { prisma } from '../prisma'
import { router, publicProcedure, adminProcedure } from '../trpc'
import type { DashboardStats } from '@snap-it/types'

const EventTypeSchema = z.enum([
  'image_uploaded',
  'bg_changed',
  'exported',
  'tool_used',
  'ratio_changed',
  'shadow_toggled',
  'corner_radius_changed',
])

export const analyticsRouter = router({
  // Public — called by the web app (fire-and-forget)
  logEvent: publicProcedure
    .input(
      z.object({
        type: EventTypeSchema,
        tool: z.string().optional(),
        meta: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip =
        (ctx.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        ctx.req.socket.remoteAddress ||
        ''

      const geo = geoip.lookup(ip)
      const ua = new UAParser(ctx.req.headers['user-agent'])
      const browser = ua.getBrowser().name ?? null
      const os = ua.getOS().name ?? null
      const deviceType = ua.getDevice().type

      // Map ua-parser device types to our DeviceType
      let device: string | null = null
      if (deviceType === 'mobile') device = 'mobile'
      else if (deviceType === 'tablet') device = 'tablet'
      else device = 'desktop'

      await prisma.event.create({
        data: {
          type: input.type,
          tool: input.tool ?? null,
          meta: input.meta ?? null,
          country: geo?.country ?? null,
          region: geo?.region ?? null,
          browser,
          os,
          device,
        },
      })

      return { ok: true }
    }),

  // Admin — dashboard stats
  getStats: adminProcedure.query(async (): Promise<DashboardStats> => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalExports,
      totalUploads,
      totalEvents,
      exportsToday,
      countryRows,
      browserRows,
      deviceRows,
      dailyRows,
    ] = await Promise.all([
      prisma.event.count({ where: { type: 'exported' } }),
      prisma.event.count({ where: { type: 'image_uploaded' } }),
      prisma.event.count(),
      prisma.event.count({ where: { type: 'exported', createdAt: { gte: todayStart } } }),
      prisma.event.groupBy({
        by: ['country'],
        _count: { country: true },
        where: { country: { not: null } },
        orderBy: { _count: { country: 'desc' } },
        take: 10,
      }),
      prisma.event.groupBy({
        by: ['browser'],
        _count: { browser: true },
        where: { browser: { not: null } },
        orderBy: { _count: { browser: 'desc' } },
        take: 10,
      }),
      prisma.event.groupBy({
        by: ['device'],
        _count: { device: true },
        where: { device: { not: null } },
        orderBy: { _count: { device: 'desc' } },
        take: 5,
      }),
      prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
        SELECT DATE("createdAt")::text as date, COUNT(*)::bigint as count
        FROM "Event"
        WHERE "createdAt" >= ${thirtyDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
    ])

    return {
      totalExports,
      totalUploads,
      totalEvents,
      exportsToday,
      topCountries: countryRows.map((r: { country: string | null; _count: { country: number } }) => ({
        country: r.country ?? 'Unknown',
        count: r._count.country,
      })),
      topBrowsers: browserRows.map((r: { browser: string | null; _count: { browser: number } }) => ({
        browser: r.browser ?? 'Unknown',
        count: r._count.browser,
      })),
      topDevices: deviceRows.map((r: { device: string | null; _count: { device: number } }) => ({
        device: r.device ?? 'Unknown',
        count: r._count.device,
      })),
      eventsOverTime: dailyRows.map((r: { date: string; count: bigint }) => ({
        date: r.date,
        count: Number(r.count),
      })),
    }
  }),

  // Admin — recent events table
  getRecentEvents: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
        type: EventTypeSchema.optional(),
      })
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit
      const where = input.type ? { type: input.type } : {}

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: input.limit,
        }),
        prisma.event.count({ where }),
      ])

      return {
        events: events.map((e: { id: string; type: string; tool: string | null; meta: string | null; country: string | null; region: string | null; browser: string | null; os: string | null; device: string | null; createdAt: Date }) => ({
          ...e,
          createdAt: e.createdAt.toISOString(),
        })),
        total,
        pages: Math.ceil(total / input.limit),
      }
    }),
})
