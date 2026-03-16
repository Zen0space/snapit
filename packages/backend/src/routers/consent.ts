import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma.js";
import { router, publicProcedure, adminProcedure } from "../trpc.js";
import type { CookieConsentRecord } from "@snap-it/types";

const ConsentLevelSchema = z.enum(["all", "necessary"]);

export const consentRouter = router({
  /**
   * Public — called by the web app whenever a visitor sets or updates consent.
   * Upserts a single CookieConsent row keyed by visitorId.
   */
  setConsent: publicProcedure
    .input(
      z.object({
        visitorId: z.string().uuid(),
        consent: ConsentLevelSchema,
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.cookieConsent.upsert({
          where: { visitorId: input.visitorId },
          update: { consent: input.consent },
          create: { visitorId: input.visitorId, consent: input.consent },
        });
      } catch (error) {
        // Fire-and-forget — log server-side but never break the web app
        console.error("[consent] Failed to upsert consent:", error);
        return { ok: false };
      }
      return { ok: true };
    }),

  /**
   * Admin — paginated list of all visitors with their consent level and event count.
   */
  getConsents: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      }),
    )
    .query(
      async ({
        input,
      }): Promise<{
        records: CookieConsentRecord[];
        total: number;
        pages: number;
      }> => {
        const skip = (input.page - 1) * input.limit;

        try {
          const [rows, total] = await Promise.all([
            prisma.cookieConsent.findMany({
              orderBy: { updatedAt: "desc" },
              skip,
              take: input.limit,
            }),
            prisma.cookieConsent.count(),
          ]);

          // Fetch per-visitor event counts in one query
          const visitorIds = rows.map((r: { visitorId: string }) => r.visitorId);
          const eventCounts = await prisma.event.groupBy({
            by: ["visitorId"],
            _count: { visitorId: true },
            where: { visitorId: { in: visitorIds } },
          });

          const countMap = new Map(
            eventCounts.map((ec: { visitorId: string | null; _count: { visitorId: number } }) => [ec.visitorId, ec._count.visitorId]),
          );

          return {
            records: rows.map((r: { id: string; visitorId: string; consent: string; createdAt: Date; updatedAt: Date }) => ({
              id: r.id,
              visitorId: r.visitorId,
              consent: r.consent as CookieConsentRecord["consent"],
              eventCount: countMap.get(r.visitorId) ?? 0,
              createdAt: r.createdAt.toISOString(),
              updatedAt: r.updatedAt.toISOString(),
            })),
            total,
            pages: Math.ceil(total / input.limit),
          };
        } catch (error) {
          console.error("[consent] Failed to fetch consents:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch consent records",
          });
        }
      },
    ),
});
