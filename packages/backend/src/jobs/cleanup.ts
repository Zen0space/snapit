import { prisma } from "../prisma.js";

/**
 * Data retention policy:
 *
 * - General events (bg_changed, copied, shadow_toggled): 3 months
 * - Core events (image_uploaded, exported):             12 months
 * - CookieConsent records:                              12 months
 *
 * Runs once on startup, then every 24 hours.
 * Fire-and-forget — errors are logged but never crash the server.
 */

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

const LONG_RETENTION_TYPES = ["image_uploaded", "exported"] as const;

export async function runCleanup(): Promise<void> {
  const now = Date.now();
  const threeMonthsAgo = new Date(now - THREE_MONTHS_MS);
  const twelveMonthsAgo = new Date(now - TWELVE_MONTHS_MS);

  try {
    // Delete short-retention events older than 3 months
    const { count: shortCount } = await prisma.event.deleteMany({
      where: {
        type: { notIn: [...LONG_RETENTION_TYPES] },
        createdAt: { lt: threeMonthsAgo },
      },
    });

    // Delete long-retention events older than 12 months
    const { count: longCount } = await prisma.event.deleteMany({
      where: {
        type: { in: [...LONG_RETENTION_TYPES] },
        createdAt: { lt: twelveMonthsAgo },
      },
    });

    // Delete stale consent records older than 12 months
    const { count: consentCount } = await prisma.cookieConsent.deleteMany({
      where: {
        updatedAt: { lt: twelveMonthsAgo },
      },
    });

    const total = shortCount + longCount + consentCount;
    if (total > 0) {
      console.log(
        `[cleanup] Removed ${shortCount} general events, ` +
          `${longCount} core events, ` +
          `${consentCount} consent records (${total} total)`,
      );
    } else {
      console.log(
        "[cleanup] Nothing to remove — database is within retention policy",
      );
    }
  } catch (error) {
    // Never crash the server — cleanup is best-effort
    console.error("[cleanup] Error during data retention cleanup:", error);
  }
}

const INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Starts the cleanup scheduler.
 * Runs immediately on call, then every 24 hours.
 */
export function startCleanupScheduler(): void {
  console.log(
    "[cleanup] Scheduler started — retention: 3mo general / 12mo core",
  );

  // Run once at startup (defer slightly so the server is fully up first)
  setTimeout(() => {
    runCleanup().catch(() => {});
  }, 5_000);

  // Then every 24 hours
  setInterval(() => {
    runCleanup().catch(() => {});
  }, INTERVAL_MS);
}
