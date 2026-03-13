import { createAdminTrpc } from "@/lib/trpc";
import DashboardClient from "./DashboardClient";
import AdminLayout from "@/components/AdminLayout";
import type { DashboardStats } from "@snap-it/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchStats(password: string): Promise<DashboardStats | null> {
  try {
    const trpc = createAdminTrpc(password);
    return await trpc.analytics.getStats.query();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  // Use ADMIN_PASSWORD server-side — never exposed to the browser.
  // The signed session cookie is verified by middleware before reaching here;
  // this env var is only available in server-side code (no NEXT_PUBLIC_ prefix).
  const password = process.env.ADMIN_PASSWORD ?? "";
  const stats = await fetchStats(password);

  return (
    <AdminLayout>
      <DashboardClient stats={stats} />
    </AdminLayout>
  );
}
