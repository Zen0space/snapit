"use client";

import { useRouter } from "next/navigation";
import type { CookieConsentRecord } from "@snap-it/types";

const CONSENT_STYLES: Record<string, string> = {
  all: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  necessary: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

interface Props {
  data: { records: CookieConsentRecord[]; total: number; pages: number } | null;
  currentPage: number;
}

export default function CookiesClient({ data, currentPage }: Props) {
  const router = useRouter();

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    router.push(`/cookies?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Cookies</h1>
        <p className="text-white/40 text-sm mt-1">
          {data
            ? `${data.total.toLocaleString()} visitor${data.total !== 1 ? "s" : ""} with consent recorded`
            : "Failed to load"}
        </p>
      </div>

      {/* Table */}
      {!data ? (
        <div className="text-center py-16 text-white/30">
          Failed to load consent records. Check backend.
        </div>
      ) : data.records.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          No consent records yet. They will appear here once visitors interact
          with the cookie banner.
        </div>
      ) : (
        <>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {[
                      "Visitor ID",
                      "Consent",
                      "Events",
                      "First Seen",
                      "Last Updated",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.records.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Visitor ID */}
                      <td className="px-4 py-3">
                        <span
                          title={record.visitorId}
                          className="font-mono text-xs text-white/60 bg-white/5 px-2 py-1 rounded-md border border-white/10 cursor-default select-all"
                        >
                          {record.visitorId.slice(0, 8)}&hellip;
                          {record.visitorId.slice(-4)}
                        </span>
                      </td>

                      {/* Consent badge */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${CONSENT_STYLES[record.consent] ?? "bg-white/10 text-white/50"}`}
                        >
                          {record.consent === "all" ? "All" : "Necessary Only"}
                        </span>
                      </td>

                      {/* Event count */}
                      <td className="px-4 py-3 text-white/60 tabular-nums">
                        {record.eventCount.toLocaleString()}
                      </td>

                      {/* First seen */}
                      <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>

                      {/* Last updated */}
                      <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">
                        {new Date(record.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-white/30 text-sm">
                Page {currentPage} of {data.pages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= data.pages}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
