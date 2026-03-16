import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Snap-It uses anonymous analytics, what data is collected, your consent choices, and your rights.",
  alternates: { canonical: `${BASE_URL}/cookie-policy` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "March 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-white/60">
        {children}
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-white/50">
      {children}
    </span>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function Cross({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Nav */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-violet-500">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            Snap-It
          </Link>
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to editor
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-5 py-14 space-y-10">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Cookie Policy</h1>
          <p className="text-sm text-white/30">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Intro */}
        <p className="text-sm leading-relaxed text-white/60">
          Snap-It uses a small amount of anonymous analytics to understand how
          the tool is being used. This page explains exactly what is collected,
          why, and what choices you have. We have deliberately kept this as
          simple and honest as possible.
        </p>

        {/* TL;DR card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/30">
            TL;DR
          </p>
          <ul className="space-y-2">
            <Check>
              We collect anonymous usage events — no names, no emails, no IP
              addresses stored.
            </Check>
            <Check>
              All data lives on our own servers. Nothing is sent to Google,
              Meta, or any third party.
            </Check>
            <Check>
              You choose what to allow. "Necessary Only" limits tracking to
              uploads and exports.
            </Check>
            <Check>
              General events are deleted after 3 months. Upload and export
              events after 12 months.
            </Check>
            <Cross>We do not use advertising cookies or tracking pixels.</Cross>
            <Cross>We do not sell or share your data with anyone.</Cross>
          </ul>
        </div>

        <div className="h-px bg-white/5" />

        {/* Sections */}
        <Section title="1. What we collect">
          <p>
            When you use Snap-It, we may record the following anonymous data
            points alongside each action:
          </p>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-2.5 text-left font-semibold text-white/40 uppercase tracking-wider">
                    Data point
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-white/40 uppercase tracking-wider">
                    Example
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-white/40 uppercase tracking-wider">
                    How obtained
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  [
                    "Event type",
                    "image_uploaded, exported",
                    "Your action in the editor",
                  ],
                  [
                    "Country / Region",
                    "US / California",
                    "IP address lookup — IP is never stored",
                  ],
                  ["Browser name", "Chrome, Firefox", "User-Agent header"],
                  ["Operating system", "macOS, Windows", "User-Agent header"],
                  ["Device type", "desktop, mobile", "User-Agent header"],
                  [
                    "Anonymous visitor ID",
                    "a3f8…c21d (UUID)",
                    "Generated in your browser on first consent",
                  ],
                ].map(([field, example, source]) => (
                  <tr key={field} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 font-mono text-white/70">
                      {field}
                    </td>
                    <td className="px-4 py-2.5 text-white/40">{example}</td>
                    <td className="px-4 py-2.5 text-white/40">{source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Your IP address is used only to resolve a country and region, then
            immediately discarded. It is never written to our database.
          </p>
        </Section>

        <Section title="2. What we never collect">
          <ul className="space-y-2">
            <Cross>Your name, email address, or any account information</Cross>
            <Cross>
              Your IP address (used transiently for geo-lookup only, never
              stored)
            </Cross>
            <Cross>The content of your screenshots or uploaded images</Cross>
            <Cross>Payment or billing information</Cross>
            <Cross>
              Precise location (only country and region, never GPS or city)
            </Cross>
            <Cross>Cross-site tracking identifiers</Cross>
          </ul>
        </Section>

        <Section title="3. Why we collect it">
          <p>
            Snap-It is a free tool with no accounts. The only way we can
            understand whether it is working well — and which features matter —
            is through anonymous usage data. Specifically we use it to:
          </p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>
              Understand which export formats and aspect ratios are most popular
            </li>
            <li>
              Spot drops in upload or export success that might signal a bug
            </li>
            <li>Make informed decisions about which features to build next</li>
            <li>
              Share anonymised aggregate milestones publicly (e.g. "10,000
              exports this month")
            </li>
          </ul>
          <p className="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-300/80">
            <strong className="text-amber-300">On aggregate statistics:</strong>{" "}
            Totals such as "X exports this month" are numbers only — they cannot
            identify any individual and are not personal data under GDPR or
            CCPA. We may share these figures publicly.
          </p>
        </Section>

        <Section title="4. Third parties">
          <p>
            <strong className="text-white/80">None.</strong> We do not use
            Google Analytics, Meta Pixel, Hotjar, Mixpanel, or any third-party
            analytics or advertising service. Every byte of data we collect goes
            directly to our own servers and stays there. We do not sell, rent,
            or share your data with any external party.
          </p>
        </Section>

        <Section title="5. Your consent choices">
          <p>
            When you first visit Snap-It you are shown a cookie banner with two
            options:
          </p>
          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <p className="font-medium text-emerald-400 mb-1">Allow All</p>
              <p className="text-white/50">
                All five event types are recorded:{" "}
                {[
                  "image_uploaded",
                  "exported",
                  "bg_changed",
                  "copied",
                  "shadow_toggled",
                ]
                  .map((t) => <Tag key={t}>{t}</Tag>)
                  .reduce<React.ReactNode[]>(
                    (acc, el, i) => (i === 0 ? [el] : [...acc, " ", el]),
                    [],
                  )}
              </p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
              <p className="font-medium text-amber-400 mb-1">Necessary Only</p>
              <p className="text-white/50">
                Only core product events are recorded: <Tag>image_uploaded</Tag>{" "}
                and <Tag>exported</Tag>. Style and interaction events are
                suppressed entirely.
              </p>
            </div>
          </div>
          <p>
            Your choice is stored in your browser&apos;s{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono text-white/60">
              localStorage
            </code>{" "}
            under the key{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono text-white/60">
              snap_cookie_consent
            </code>
            . No cookie is set. Clearing your browser storage resets your
            preference and the banner will re-appear.
          </p>
        </Section>

        <Section title="6. Data retention">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-2.5 text-left font-semibold text-white/40 uppercase tracking-wider">
                    Data type
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-white/40 uppercase tracking-wider">
                    Retained for
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  [
                    "General events (bg_changed, copied, shadow_toggled)",
                    "3 months",
                  ],
                  ["Core events (image_uploaded, exported)", "12 months"],
                  ["Consent records (visitor ID + choice)", "12 months"],
                ].map(([type, period]) => (
                  <tr key={type} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-white/60">{type}</td>
                    <td className="px-4 py-2.5 font-medium text-white/80">
                      {period}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Deletion runs automatically every 24 hours on our servers. No manual
            action is required.
          </p>
        </Section>

        <Section title="7. Your rights">
          <p>
            Depending on where you are located you may have rights under GDPR,
            CCPA, or similar legislation to:
          </p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>
              Request a copy of any data associated with your anonymous visitor
              ID
            </li>
            <li>
              Request deletion of your data before the automatic retention
              period
            </li>
            <li>Object to processing</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a
              href="mailto:support@rekabytes.com"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              support@rekabytes.com
            </a>{" "}
            with the subject line{" "}
            <em className="text-white/50">Data Request — Snap-It</em>. Include
            your anonymous visitor ID if you have it (found in browser{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono text-white/60">
              localStorage
            </code>{" "}
            under{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono text-white/60">
              snap_visitor_id
            </code>
            ). We aim to respond within 30 days.
          </p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>
            If we make material changes to this policy we will update the date
            at the top of this page. Continued use of Snap-It after changes are
            posted constitutes acceptance.
          </p>
        </Section>

        {/* Footer */}
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Rekabytes. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Back to Snap-It →
          </Link>
        </div>
      </main>
    </div>
  );
}
