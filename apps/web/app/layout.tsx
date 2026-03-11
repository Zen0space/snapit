import type { Metadata } from 'next'
import './globals.css'

// TODO: Add landing page later — editor will move to /editor, and / will become the marketing page

export const metadata: Metadata = {
  title: 'Snap-It — Beautiful Screenshots Instantly',
  description:
    'Turn any screenshot into a beautiful, share-ready image. Add backgrounds, shadows, annotations and more — right in your browser.',
  openGraph: {
    title: 'Snap-It',
    description: 'Beautiful screenshots in seconds.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
