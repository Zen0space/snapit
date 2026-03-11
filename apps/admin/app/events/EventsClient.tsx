'use client'

import { useRouter } from 'next/navigation'
import type { AnalyticsEvent } from '@snap-it/types'

const EVENT_TYPES = [
  'image_uploaded',
  'bg_changed',
  'exported',
  'tool_used',
  'ratio_changed',
  'shadow_toggled',
  'corner_radius_changed',
]

const EVENT_COLORS: Record<string, string> = {
  image_uploaded: 'bg-sky-500/20 text-sky-400',
  bg_changed: 'bg-violet-500/20 text-violet-400',
  exported: 'bg-emerald-500/20 text-emerald-400',
  tool_used: 'bg-amber-500/20 text-amber-400',
  ratio_changed: 'bg-pink-500/20 text-pink-400',
  shadow_toggled: 'bg-slate-500/20 text-slate-400',
  corner_radius_changed: 'bg-orange-500/20 text-orange-400',
}

interface Props {
  data: { events: AnalyticsEvent[]; total: number; pages: number } | null
  currentPage: number
  currentType?: string
}

export default function EventsClient({ data, currentPage, currentType }: Props) {
  const router = useRouter()

  const updateFilter = (type?: string, page = 1) => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (page > 1) params.set('page', String(page))
    router.push(`/events?${params.toString()}`)
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-white/40 text-sm mt-1">
            {data ? `${data.total.toLocaleString()} total events` : 'Failed to load'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => updateFilter(undefined)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            !currentType
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'bg-white/5 text-white/50 hover:text-white/80 border border-transparent'
          }`}
        >
          All
        </button>
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => updateFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              currentType === type
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-white/5 text-white/50 hover:text-white/80 border border-transparent'
            }`}
          >
            {type.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      {!data ? (
        <div className="text-center py-16 text-white/30">Failed to load events. Check backend.</div>
      ) : (
        <>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Event', 'Tool', 'Country', 'Browser', 'OS', 'Device', 'Time'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.events.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-white/30">
                        No events found
                      </td>
                    </tr>
                  )}
                  {data.events.map((event) => (
                    <tr key={event.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${EVENT_COLORS[event.type] ?? 'bg-white/10 text-white/50'}`}>
                          {event.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/50 font-mono text-xs">
                        {event.tool ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {event.country ?? '—'}
                        {event.region ? <span className="text-white/30 text-xs ml-1">/{event.region}</span> : null}
                      </td>
                      <td className="px-4 py-3 text-white/70">{event.browser ?? '—'}</td>
                      <td className="px-4 py-3 text-white/70">{event.os ?? '—'}</td>
                      <td className="px-4 py-3 text-white/50 text-xs capitalize">{event.device ?? '—'}</td>
                      <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">
                        {new Date(event.createdAt).toLocaleString()}
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
                onClick={() => updateFilter(currentType, currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-white/30 text-sm">
                Page {currentPage} of {data.pages}
              </span>
              <button
                onClick={() => updateFilter(currentType, currentPage + 1)}
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
  )
}
