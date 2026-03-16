import { z } from "zod";
import { createAdminTrpc } from "@/lib/trpc";
import CookiesClient from "./CookiesClient";
import AdminLayout from "@/components/AdminLayout";
import type { CookieConsentRecord } from "@snap-it/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CookiesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const password = process.env.ADMIN_PASSWORD ?? "";

  const pageSchema = z.coerce.number().int().min(1).default(1);
  const page = pageSchema.catch(1).parse(searchParams.page);

  let data: {
    records: CookieConsentRecord[];
    total: number;
    pages: number;
  } | null = null;

  try {
    const trpc = createAdminTrpc(password);
    data = await trpc.consent.getConsents.query({ page, limit: 50 });
  } catch {
    data = null;
  }

  return (
    <AdminLayout>
      <CookiesClient data={data} currentPage={page} />
    </AdminLayout>
  );
}
