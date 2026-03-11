import { cookies } from 'next/headers'
import { createAdminTrpc } from '@/lib/trpc'
import DashboardClient from './DashboardClient'
import AdminLayout from '@/components/AdminLayout'
import type { DashboardStats } from '@snap-it/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchStats(password: string): Promise<DashboardStats | null> {
  try {
    const trpc = createAdminTrpc(password)
    return await trpc.analytics.getStats.query()
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const session = cookieStore.get('snap_admin_session')
  const password = session?.value ?? ''
  const stats = await fetchStats(password)

  return (
    <AdminLayout>
      <DashboardClient stats={stats} />
    </AdminLayout>
  )
}
