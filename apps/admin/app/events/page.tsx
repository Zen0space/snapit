import { createAdminTrpc } from "@/lib/trpc";
import EventsClient from "./EventsClient";
import AdminLayout from "@/components/AdminLayout";
import type { AnalyticsEvent, EventType } from "@snap-it/types";

type RawEvent = {
  id: string;
  type: string;
  tool: string | null;
  meta: string | null;
  country: string | null;
  region: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  createdAt: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string; type?: string };
}) {
  // Use ADMIN_PASSWORD server-side — never exposed to the browser.
  // The signed session cookie is verified by middleware before reaching here;
  // this env var is only available in server-side code (no NEXT_PUBLIC_ prefix).
  const password = process.env.ADMIN_PASSWORD ?? "";

  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const type = searchParams.type as EventType | undefined;

  let data: { events: AnalyticsEvent[]; total: number; pages: number } | null =
    null;
  try {
    const trpc = createAdminTrpc(password);
    const result = await trpc.analytics.getRecentEvents.query({
      page,
      limit: 50,
      type,
    });
    data = {
      events: result.events.map((e: RawEvent) => ({
        ...e,
        type: e.type as EventType,
        device: e.device as AnalyticsEvent["device"],
      })),
      total: result.total,
      pages: result.pages,
    };
  } catch {
    data = null;
  }

  return (
    <AdminLayout>
      <EventsClient data={data} currentPage={page} currentType={type} />
    </AdminLayout>
  );
}
