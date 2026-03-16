import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/config";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Rekabytes Enterprise collects, uses, and protects your data when you use Snap-It. Governed by Malaysia's Personal Data Protection Act 2010 (Akta 709).",
  alternates: { canonical: `${BASE_URL}/privacy-policy` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "March 2026";
const EFFECTIVE_DATE = "March 2026";
const CONTROLLER_EMAIL = "support@rekabytes.com";

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3 scroll-mt-20">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-white/60">
        {children}
      </div>
    </section>
  );
}

function Principle({
  number,
  name,
  children,
}: {
  number: number;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 text-[10px] font-bold text-white">
          {number}
        </span>
        <p className="text-sm font-semibold text-white">{name}</p>
      </div>
      <p className="text-sm text-white/50 pl-7">{children}</p>
    </div>
  );
}

function Right({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-violet-500" />
      <div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="text-sm text-white/50">{children}</p>
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
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
      <main className="mx-auto max-w-3xl px-5 py-14 space-y-10">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          <p className="text-sm text-white/30">
            Last updated: {LAST_UPDATED} &nbsp;&middot;&nbsp; Effective date:{" "}
            {EFFECTIVE_DATE}
          </p>
        </div>

        {/* Governing law badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5">
          <svg
            className="h-3.5 w-3.5 text-sky-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
          <span className="text-xs font-medium text-sky-300">
            Governed by Malaysia — Personal Data Protection Act 2010 (Akta 709)
          </span>
        </div>

        {/* Intro */}
        <p className="text-sm leading-relaxed text-white/60">
          This Privacy Policy explains how Rekabytes Enterprise
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), the
          operator of Snap-It (snapit.rekabytes.com), collects, uses, stores,
          and protects information when you use the service. We are committed to
          complying with the{" "}
          <strong className="text-white/80">
            Personal Data Protection Act 2010 (Akta 709)
          </strong>{" "}
          and its 2024 amendments.
        </p>

        <div className="h-px bg-white/5" />

        {/* 1. Data Controller */}
        <Section id="controller" title="1. Data Controller">
          <p>The data controller responsible for your personal data is:</p>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
            <p className="font-semibold text-white/80">Rekabytes Enterprise</p>
            <p className="text-white/50">Operator of Snap-It</p>
            <p>
              Contact:{" "}
              <a
                href={`mailto:${CONTROLLER_EMAIL}`}
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                {CONTROLLER_EMAIL}
              </a>
            </p>
          </div>
          <p>
            You may contact us at any time to exercise your rights or ask
            questions about this policy.
          </p>
        </Section>

        {/* 2. Scope */}
        <Section id="scope" title="2. Scope of This Policy">
          <p>
            This policy applies to all visitors of Snap-It. Snap-It is a free,
            browser-based screenshot beautifier that requires no account or
            login. All image processing occurs locally in your browser — your
            image files are{" "}
            <strong className="text-white/80">
              never uploaded to our servers
            </strong>
            .
          </p>
          <p>
            The only data we collect is anonymous usage analytics, described
            below, and only when you have given consent.
          </p>
        </Section>

        {/* 3. What We Collect */}
        <Section id="data-collected" title="3. Data We Collect">
          <p>
            Subject to your consent, we may record the following anonymous data
            points when you interact with Snap-It:
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
                    Source
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
                    "Malaysia / Selangor",
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
            <strong className="text-white/80">Sensitive personal data</strong>{" "}
            as defined under the PDPA (e.g., health information, biometric data,
            political opinions, religious beliefs) is never collected.
          </p>
          <p>
            <strong className="text-white/80">
              Your image files are never sent to our servers.
            </strong>{" "}
            All editing and rendering happens entirely within your browser using
            the HTML Canvas API.
          </p>
        </Section>

        {/* 4. What We Never Collect */}
        <Section id="not-collected" title="4. What We Never Collect">
          <ul className="space-y-2">
            {[
              "Your name, email address, or any account credentials",
              "Your IP address (used transiently for geo-lookup only — immediately discarded and never written to our database)",
              "The content or pixels of your screenshots or uploaded images",
              "Payment or billing information",
              "Precise location (only country and region are inferred, never GPS coordinates)",
              "Sensitive personal data (health, biometric, political, or religious information)",
              "Cross-site tracking identifiers",
              "Cookies (we use localStorage — see our Cookie Policy)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
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
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 5. Legal basis */}
        <Section id="legal-basis" title="5. Legal Basis for Processing">
          <p>
            Under the PDPA 2010 (General Principle, Section 6), personal data
            may only be processed with the{" "}
            <strong className="text-white/80">
              consent of the data subject
            </strong>{" "}
            or under a permitted exception. We rely exclusively on your{" "}
            <strong className="text-white/80">
              freely given, explicit consent
            </strong>{" "}
            as our legal basis.
          </p>
          <p>
            When you first visit Snap-It you are shown a cookie/consent banner.
            No analytics data is recorded until you actively choose &ldquo;Allow
            All&rdquo; or &ldquo;Necessary Only&rdquo;. If you close the banner
            without choosing, no data is collected.
          </p>
          <p>
            You may withdraw consent at any time by clearing your browser&apos;s
            localStorage (the banner will re-appear and all future analytics
            will be suppressed). See also the{" "}
            <Link
              href="/cookie-policy"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Cookie Policy
            </Link>{" "}
            for full details on consent levels.
          </p>
        </Section>

        {/* 6. 7 PDPA Principles */}
        <Section
          id="pdpa-principles"
          title="6. The Seven PDPA Principles — Our Compliance"
        >
          <p>
            The PDPA 2010 requires data users to comply with seven data
            protection principles. Here is how Snap-It addresses each one:
          </p>
          <div className="space-y-3 mt-2">
            <Principle number={1} name="General Principle (Consent)">
              Analytics data is collected only after you grant explicit consent
              via the cookie banner. No analytics are fired before a consent
              decision is made.
            </Principle>
            <Principle number={2} name="Notice and Choice Principle">
              We notify you of the purposes of collection (improving Snap-It)
              via the cookie banner, this Privacy Policy, and our Cookie Policy.
              You have a clear choice between &ldquo;Necessary Only&rdquo; and
              &ldquo;Allow All&rdquo;.
            </Principle>
            <Principle number={3} name="Disclosure Principle">
              Your data is never disclosed to third parties. We use no
              third-party analytics, advertising, or tracking services. All data
              stays on our own servers.
            </Principle>
            <Principle number={4} name="Security Principle">
              We take practical steps to protect data: IP addresses are
              discarded immediately after geo-lookup, data is stored on
              server-side infrastructure accessible only to us, and our codebase
              undergoes regular review. Data processors (if any) are
              contractually required to comply with this principle.
            </Principle>
            <Principle number={5} name="Retention Principle">
              Data is automatically deleted on a rolling basis: general events
              after 3 months, core events and consent records after 12 months.
              An automated cleanup job runs every 24 hours.
            </Principle>
            <Principle number={6} name="Data Integrity Principle">
              We collect only what is necessary for our stated purpose. No
              editing, linking, or enrichment of the anonymous data is
              performed.
            </Principle>
            <Principle number={7} name="Access Principle">
              You have the right to access and correct data associated with your
              anonymous visitor ID. Contact us at{" "}
              <a
                href={`mailto:${CONTROLLER_EMAIL}`}
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                {CONTROLLER_EMAIL}
              </a>
              .
            </Principle>
          </div>
        </Section>

        {/* 7. Purposes */}
        <Section id="purposes" title="7. Purposes of Processing">
          <p>We use anonymous analytics data solely to:</p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>Understand which features and export formats are most used</li>
            <li>
              Detect drops in upload or export success rates that may indicate
              bugs
            </li>
            <li>
              Make informed decisions about which features to build or improve
            </li>
            <li>
              Share anonymised aggregate statistics publicly (e.g. &ldquo;10,000
              exports this month&rdquo; — these totals cannot identify any
              individual)
            </li>
          </ul>
          <p>
            We do <strong className="text-white/80">not</strong> use the data
            for advertising, profiling, direct marketing, or any automated
            decision-making.
          </p>
        </Section>

        {/* 8. Third parties */}
        <Section id="third-parties" title="8. Third-Party Sharing">
          <p>
            <strong className="text-white/80">None.</strong> We do not sell,
            rent, share, or transfer your data to any third party for any
            purpose. We use no third-party analytics tools (no Google Analytics,
            Meta Pixel, Hotjar, Mixpanel, or similar services). All data goes
            directly to our own servers and stays there.
          </p>
        </Section>

        {/* 9. Cross-border */}
        <Section id="cross-border" title="9. Cross-Border Data Transfer">
          <p>
            No cross-border transfer of your data takes place. Our servers are
            operated by Rekabytes Enterprise and are not located in or
            transferred to foreign jurisdictions outside Malaysia. Accordingly,
            the cross-border transfer provisions of the PDPA 2010 and the 2024
            Amending Act (effective April 1, 2025) do not apply.
          </p>
        </Section>

        {/* 10. Retention */}
        <Section id="retention" title="10. Data Retention">
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
                  <th className="px-4 py-2.5 text-left font-semibold text-white/40 uppercase tracking-wider">
                    Deleted automatically
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  [
                    "General events (bg_changed, copied, shadow_toggled)",
                    "3 months",
                    "Yes — daily cleanup job",
                  ],
                  [
                    "Core events (image_uploaded, exported)",
                    "12 months",
                    "Yes — daily cleanup job",
                  ],
                  [
                    "Consent records (visitor ID + consent level)",
                    "12 months",
                    "Yes — daily cleanup job",
                  ],
                ].map(([type, period, auto]) => (
                  <tr key={type} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-white/60">{type}</td>
                    <td className="px-4 py-2.5 font-medium text-white/80">
                      {period}
                    </td>
                    <td className="px-4 py-2.5 text-white/50">{auto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Upon the expiry of the retention period, data is permanently deleted
            from our database. You may also request early deletion — see Section
            11 below.
          </p>
        </Section>

        {/* 11. Data Subject Rights */}
        <Section id="rights" title="11. Your Rights Under PDPA 2010">
          <p>
            Under the Personal Data Protection Act 2010 (Akta 709) and its 2024
            amendments, you have the following rights:
          </p>
          <div className="space-y-4 mt-2">
            <Right title="Right of Access (Section 30, PDPA 2010)">
              You may request a copy of any data we hold that is associated with
              your anonymous visitor ID.
            </Right>
            <Right title="Right of Correction (Section 34, PDPA 2010)">
              You may request that inaccurate data associated with your visitor
              ID be corrected.
            </Right>
            <Right title="Right to Withdraw Consent (Section 38, PDPA 2010)">
              You may withdraw consent at any time. Clearing your browser&apos;s
              localStorage removes your consent preference — the cookie banner
              will re-appear and no further analytics will be recorded.
            </Right>
            <Right title="Right to Object / Restrict Processing">
              You may object to the processing of your data for any of the
              stated purposes by contacting us at the email address below.
            </Right>
            <Right title="Right to Data Portability (Amending Act, effective June 1, 2025)">
              Upon request, we will provide a copy of data linked to your
              visitor ID in a machine-readable format.
            </Right>
            <Right title="Right to Erasure">
              You may request deletion of your data at any time, prior to the
              automatic retention cutoff. We will process your request within 30
              calendar days.
            </Right>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-white/60">
              To exercise any of these rights, email{" "}
              <a
                href={`mailto:${CONTROLLER_EMAIL}`}
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                {CONTROLLER_EMAIL}
              </a>{" "}
              with the subject line{" "}
              <em className="text-white/50">Data Request — Snap-It</em>. Include
              your anonymous visitor ID if available (found in your
              browser&apos;s localStorage under the key{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono text-white/60">
                snap_visitor_id
              </code>
              ). We aim to respond within{" "}
              <strong className="text-white/80">30 calendar days</strong>.
            </p>
          </div>
        </Section>

        {/* 12. Breach notification */}
        <Section id="breach" title="12. Data Breach Notification">
          <p>
            In the event of a personal data breach, we will comply with the
            mandatory breach notification obligations under the{" "}
            <strong className="text-white/80">
              Personal Data Protection (Amendment) Act 2024
            </strong>
            , which comes into force on{" "}
            <strong className="text-white/80">June 1, 2025</strong>:
          </p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>
              Notify the Personal Data Protection Commissioner as soon as
              reasonably possible after becoming aware of the breach
            </li>
            <li>
              Notify affected data subjects without unnecessary delay where the
              breach causes or is likely to cause significant harm
            </li>
          </ul>
          <p>
            Given that we collect only anonymous, non-sensitive data with no
            PII, the risk of harm from any breach is minimal. However, we
            maintain this obligation in good faith.
          </p>
        </Section>

        {/* 13. Security */}
        <Section id="security" title="13. Security Measures">
          <p>
            In accordance with the Security Principle under the PDPA 2010, we
            take the following practical steps to protect your data:
          </p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>
              IP addresses are discarded immediately after geo-lookup and are
              never written to our database
            </li>
            <li>
              All data is stored on servers operated and controlled solely by
              Rekabytes Enterprise
            </li>
            <li>
              Access to admin dashboards and backend systems is protected by
              authentication
            </li>
            <li>
              Automated retention jobs ensure data is not kept beyond the stated
              periods
            </li>
            <li>
              No sensitive or personally identifiable information is collected
            </li>
          </ul>
        </Section>

        {/* 14. Minors */}
        <Section id="minors" title="14. Children and Minors">
          <p>
            Snap-It is intended for users aged 13 and above. We do not knowingly
            collect data from children under 13. If you are a parent or guardian
            and believe your child under 13 has used Snap-It, please contact us
            at{" "}
            <a
              href={`mailto:${CONTROLLER_EMAIL}`}
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              {CONTROLLER_EMAIL}
            </a>{" "}
            and we will take appropriate steps.
          </p>
          <p>
            Under the PDPA 2010, where consent is required from a data subject
            under the age of 18, consent must be obtained from the parent,
            guardian, or person with parental responsibility.
          </p>
        </Section>

        {/* 15. Governing law */}
        <Section id="governing-law" title="15. Governing Law">
          <p>
            This Privacy Policy and any data processing carried out by Rekabytes
            Enterprise is governed by the laws of Malaysia, specifically the{" "}
            <strong className="text-white/80">
              Personal Data Protection Act 2010 (Akta 709)
            </strong>{" "}
            and the{" "}
            <strong className="text-white/80">
              Personal Data Protection (Amendment) Act 2024
            </strong>
            . Any dispute arising in connection with this policy shall be
            subject to the jurisdiction of the courts of Malaysia.
          </p>
        </Section>

        {/* 16. Changes */}
        <Section id="changes" title="16. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material
            changes will be reflected by an updated date at the top of this
            page. Continued use of Snap-It after changes are posted constitutes
            acceptance of the revised policy. For significant changes, we may
            also reset the consent banner so you can review and reconfirm your
            preferences.
          </p>
        </Section>

        {/* 17. Related policies */}
        <Section id="related" title="17. Related Documents">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/cookie-policy"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <p className="text-sm font-medium text-white/80">Cookie Policy</p>
              <p className="text-xs text-white/40 mt-0.5">
                Detailed breakdown of analytics events, consent levels, and
                localStorage usage
              </p>
            </Link>
            <Link
              href="/terms-of-use"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <p className="text-sm font-medium text-white/80">Terms of Use</p>
              <p className="text-xs text-white/40 mt-0.5">
                Permitted use, intellectual property, disclaimer, and limitation
                of liability
              </p>
            </Link>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
