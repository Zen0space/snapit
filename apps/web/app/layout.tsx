import type { Metadata } from "next";
import "./globals.css";
import { BASE_URL } from "@/lib/config";
import { CookieBanner } from "@/components/ui/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Snap-It — Free Online Screenshot Beautifier & Editor",
    template: "%s | Snap-It",
  },

  description:
    "Transform your screenshots into beautiful, share-ready images. Add gradient backgrounds, drop shadows, rounded corners and more. Free online screenshot editor — no signup required.",

  keywords: [
    "screenshot beautifier",
    "screenshot editor online",
    "beautiful screenshots",
    "free screenshot editor",
    "screenshot maker",
    "enhance screenshot",
    "add background to screenshot",
    "screenshot with shadow",
    "code screenshot tool",
    "social media screenshot maker",
    "screenshot for twitter",
    "screenshot for linkedin",
    "developer screenshot tool",
    "online screenshot tool",
    "snap it screenshot",
  ],

  authors: [{ name: "Snap-It", url: BASE_URL }],
  creator: "Snap-It",
  publisher: "Snap-It",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Snap-It",
    title: "Snap-It — Free Online Screenshot Beautifier & Editor",
    description:
      "Transform screenshots into beautiful, share-ready images. Add gradients, shadows, and rounded corners in seconds. Free — no signup required.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Snap-It — Free Online Screenshot Beautifier & Editor",
    description:
      "Transform screenshots into beautiful, share-ready images. Add gradients, shadows, and rounded corners in seconds. Free — no signup required.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data — helps Google understand the app
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Snap-It",
  description:
    "Free online screenshot beautifier and editor. Add gradient backgrounds, drop shadows, rounded corners, and more.",
  url: BASE_URL,
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern browser with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Add gradient backgrounds to screenshots",
    "Add drop shadows to screenshots",
    "Rounded corner controls",
    "Aspect ratio presets for Twitter, Instagram, YouTube",
    "Export as PNG at 2x resolution",
    "Drag and drop or paste from clipboard",
    "No signup or account required",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
