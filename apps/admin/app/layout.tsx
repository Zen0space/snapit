import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Snap-It Admin',
  description: 'Analytics dashboard for Snap-It',
  robots: 'noindex, nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
