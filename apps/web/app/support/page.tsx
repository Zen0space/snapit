import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/config";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Snap-It. Contact the Rekabytes Enterprise team for questions, bug reports, or data requests.",
  alternates: { canonical: `${BASE_URL}/support` },
  robots: { index: true, follow: true },
};

const SUPPORT_EMAIL = "support@rekabytes.com";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
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
      <main className="mx-auto max-w-3xl px-5 py-14">
        {/* Heading */}
        <div className="mb-10 space-y-2">
          <h1 className="text-2xl font-bold text-white">Support</h1>
          <p className="text-sm text-white/50">
            We&apos;re here to help. Drop us an email and we&apos;ll get back to
            you as soon as possible.
          </p>
        </div>

        {/* Primary CTA card */}
        <div className="group relative mb-8">
          {/* Glow */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-sky-500/20 to-violet-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center space-y-5">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-violet-500/20 border border-white/10">
              <svg
                className="h-7 w-7 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-white">
                Email us directly
              </p>
              <p className="text-sm text-white/40">
                We aim to respond within{" "}
                <strong className="text-white/60">2 business days</strong>.
              </p>
            </div>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-violet-400 hover:shadow-sky-500/30 active:scale-[0.98]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>

        {/* Topic cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          {[
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ),
              title: "Bug Reports",
              description:
                "Something broken? Let us know exactly what happened and what browser you're using.",
            },
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              ),
              title: "Feature Requests",
              description:
                "Have an idea that would make Snap-It better? We'd love to hear it.",
            },
            {
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              ),
              title: "Privacy & Data",
              description:
                'To exercise PDPA rights — access, deletion, or data portability — email us with the subject "Data Request — Snap-It".',
            },
          ].map(({ icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2"
            >
              <svg
                className="h-5 w-5 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {icon}
              </svg>
              <p className="text-sm font-medium text-white/80">{title}</p>
              <p className="text-xs leading-relaxed text-white/40">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Divider + legal links */}
        <div className="h-px bg-white/5 mb-6" />
        <p className="text-xs text-white/30 text-center">
          For legal enquiries, see our{" "}
          <Link
            href="/privacy-policy"
            className="text-white/50 hover:text-white/70 transition-colors underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          ,{" "}
          <Link
            href="/terms-of-use"
            className="text-white/50 hover:text-white/70 transition-colors underline underline-offset-2"
          >
            Terms of Use
          </Link>
          , and{" "}
          <Link
            href="/cookie-policy"
            className="text-white/50 hover:text-white/70 transition-colors underline underline-offset-2"
          >
            Cookie Policy
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}
