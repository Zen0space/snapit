'use client'

import type { DashboardStats } from '@snap-it/types'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface Props {
  stats: DashboardStats | null
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="text-sm text-white/40 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="text-sm font-semibold text-white/60 mb-4">{title}</p>
      {children}
    </div>
  )
}

export default function DashboardClient({ stats }: Props) {
  if (!stats) {
    return (
      <div className="p-8 text-center text-white/40">
        <p>Failed to load stats. Check that the backend is running.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Snap-It analytics overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Exports" value={stats.totalExports} sub="All time" />
        <StatCard label="Exports Today" value={stats.exportsToday} sub="Since midnight" />
        <StatCard label="Total Uploads" value={stats.totalUploads} sub="Images processed" />
        <StatCard label="Total Events" value={stats.totalEvents} sub="All event types" />
      </div>

      {/* Events over time */}
      <ChartCard title="Events over last 30 days">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stats.eventsOverTime} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)} // MM-DD
            />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
              itemStyle={{ color: '#0ea5e9' }}
            />
            <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top countries */}
        <ChartCard title="Top Countries">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.topCountries} layout="vertical" margin={{ left: 0, right: 4 }}>
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
              <YAxis dataKey="country" type="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={36} />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                itemStyle={{ color: '#0ea5e9' }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top browsers */}
        <ChartCard title="Browsers">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.topBrowsers}
                dataKey="count"
                nameKey="browser"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {stats.topBrowsers.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              />
              <Legend
                formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Devices */}
        <ChartCard title="Devices">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.topDevices}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {stats.topDevices.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              />
              <Legend
                formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
