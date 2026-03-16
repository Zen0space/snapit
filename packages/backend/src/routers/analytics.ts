import { z } from "zod";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma.js";
import { router, publicProcedure, adminProcedure } from "../trpc.js";
import type { DashboardStats } from "@snap-it/types";

const EventTypeSchema = z.enum([
  "image_uploaded",
  "bg_changed",
  "exported",
  "copied",
  "shadow_toggled",
]);

/**
 * Returns true only for non-empty, non-loopback, non-private IPs.
 * Skips the geoip lookup entirely for local/internal addresses that
 * will never resolve to a geographic location.
 */
function isValidPublicIP(ip: string): boolean {
  if (!ip) return false;

  // Loopback
  if (ip === "127.0.0.1" || ip === "::1") return false;
  if (ip.startsWith("::ffff:127.")) return false;

  // Private ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
  if (/^10\./.test(ip)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return false;
  if (/^192\.168\./.test(ip)) return false;

  // IPv4 — four dot-separated octets
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return true;

  // IPv6 — contains at least one colon
  if (ip.includes(":")) return true;

  return false;
}

export const analyticsRouter = router({
  // Public — called by the web app (fire-and-forget)
  logEvent: publicProcedure
    .input(
      z.object({
        type: EventTypeSchema,
        tool: z.string().optional(),
        meta: z.string().optional(),
        visitorId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const ip =
        (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        ctx.req.socket.remoteAddress ||
        "";

      const geo = isValidPublicIP(ip) ? geoip.lookup(ip) : null;
      const ua = new UAParser(ctx.req.headers["user-agent"]);
      const browser = ua.getBrowser().name ?? null;
      const os = ua.getOS().name ?? null;
      const deviceType = ua.getDevice().type;

      // Map ua-parser device types to our DeviceType
      let device: string | null = null;
      if (deviceType === "mobile") device = "mobile";
      else if (deviceType === "tablet") device = "tablet";
      else device = "desktop";

      try {
        await prisma.event.create({
          data: {
            type: input.type,
            tool: input.tool ?? null,
            meta: input.meta ?? null,
            visitorId: input.visitorId ?? null,
            country: geo?.country ?? null,
            region: geo?.region ?? null,
            browser,
            os,
            device,
          },
        });
      } catch (error) {
        // Fire-and-forget — log server-side but don't throw so the web app is unaffected
        console.error("[analytics] Failed to log event:", error);
        return { ok: false };
      }

      return { ok: true };
    }),

  // Admin — dashboard stats
  getStats: adminProcedure.query(async (): Promise<DashboardStats> => {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    try {
      const [
        totalExports,
        totalUploads,
        totalCopies,
        totalEvents,
        exportsToday,
        copiesToday,
        countryRows,
        browserRows,
        deviceRows,
        dailyRows,
      ] = await Promise.all([
        prisma.event.count({ where: { type: "exported" } }),
        prisma.event.count({ where: { type: "image_uploaded" } }),
        prisma.event.count({ where: { type: "copied" } }),
        prisma.event.count(),
        prisma.event.count({
          where: { type: "exported", createdAt: { gte: todayStart } },
        }),
        prisma.event.count({
          where: { type: "copied", createdAt: { gte: todayStart } },
        }),
        prisma.event.groupBy({
          by: ["country"],
          _count: { country: true },
          where: { country: { not: null } },
          orderBy: { _count: { country: "desc" } },
          take: 10,
        }),
        prisma.event.groupBy({
          by: ["browser"],
          _count: { browser: true },
          where: { browser: { not: null } },
          orderBy: { _count: { browser: "desc" } },
          take: 10,
        }),
        prisma.event.groupBy({
          by: ["device"],
          _count: { device: true },
          where: { device: { not: null } },
          orderBy: { _count: { device: "desc" } },
          take: 5,
        }),
        prisma.$queryRaw<
          Array<{ date: string; exports: bigint; copies: bigint }>
        >`
          SELECT
            DATE("createdAt")::text as date,
            COUNT(*) FILTER (WHERE type = 'exported')::bigint as exports,
            COUNT(*) FILTER (WHERE type = 'copied')::bigint as copies
          FROM "Event"
          WHERE "createdAt" >= ${thirtyDaysAgo}
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `,
      ]);

      return {
        totalExports,
        totalUploads,
        totalCopies,
        totalEvents,
        exportsToday,
        copiesToday,
        topCountries: countryRows.map(
          (r: { country: string | null; _count: { country: number } }) => ({
            country: r.country ?? "Unknown",
            count: r._count.country,
          }),
        ),
        topBrowsers: browserRows.map(
          (r: { browser: string | null; _count: { browser: number } }) => ({
            browser: r.browser ?? "Unknown",
            count: r._count.browser,
          }),
        ),
        topDevices: deviceRows.map(
          (r: { device: string | null; _count: { device: number } }) => ({
            device: r.device ?? "Unknown",
            count: r._count.device,
          }),
        ),
        eventsOverTime: dailyRows.map(
          (r: { date: string; exports: bigint; copies: bigint }) => ({
            date: r.date,
            exports: Number(r.exports),
            copies: Number(r.copies),
          }),
        ),
      };
    } catch (error) {
      console.error("[analytics] Failed to fetch stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch stats",
      });
    }
  }),

  // Admin — recent events table
  getRecentEvents: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
        type: EventTypeSchema.optional(),
      }),
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;
      const where = input.type ? { type: input.type } : {};

      try {
        const [events, total] = await Promise.all([
          prisma.event.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: input.limit,
          }),
          prisma.event.count({ where }),
        ]);

        return {
          events: events.map(
            (e: {
              id: string;
              type: string;
              tool: string | null;
              meta: string | null;
              visitorId: string | null;
              country: string | null;
              region: string | null;
              browser: string | null;
              os: string | null;
              device: string | null;
              createdAt: Date;
            }) => ({
              ...e,
              createdAt: e.createdAt.toISOString(),
            }),
          ),
          total,
          pages: Math.ceil(total / input.limit),
        };
      } catch (error) {
        console.error("[analytics] Failed to fetch recent events:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch events",
        });
      }
    }),
});
