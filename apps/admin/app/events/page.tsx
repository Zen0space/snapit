import { cookies } from "next/headers";
import { createAdminTrpc } from "@/lib/trpc";
import EventsClient from "./EventsClient";
import AdminLayout from "@/components/AdminLayout";
import type { AnalyticsEvent, EventType } from "@snap-it/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string; type?: string };
}) {
  const cookieStore = cookies();
  const session = cookieStore.get("snap_admin_session");
  const password = session?.value ?? "";

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
      events: result.events.map((e) => ({
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
