import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/lib/config";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for Snap-It, the free online screenshot beautifier operated by Rekabytes Enterprise. Governed by the laws of Malaysia.",
  alternates: { canonical: `${BASE_URL}/terms-of-use` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "March 2026";
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

export default function TermsOfUsePage() {
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
          <h1 className="text-2xl font-bold text-white">Terms of Use</h1>
          <p className="text-sm text-white/30">Last updated: {LAST_UPDATED}</p>
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
            Governed by the laws of Malaysia
          </span>
        </div>

        {/* Intro */}
        <p className="text-sm leading-relaxed text-white/60">
          These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use
          of Snap-It (snapit.rekabytes.com), a free online screenshot beautifier
          and editor operated by{" "}
          <strong className="text-white/80">Rekabytes Enterprise</strong>{" "}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By using
          Snap-It you agree to be bound by these Terms. If you do not agree,
          please do not use the service.
        </p>

        <div className="h-px bg-white/5" />

        {/* 1. Service Description */}
        <Section id="service" title="1. About the Service">
          <p>
            Snap-It is a free, browser-based tool that allows you to add
            decorative backgrounds, shadows, and formatting to screenshots and
            images, and export the result as a PNG file.
          </p>
          <p>
            <strong className="text-white/80">
              All image processing happens entirely in your browser.
            </strong>{" "}
            Your image files are never transmitted to or stored on our servers.
            No account, login, or subscription is required to use Snap-It.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue the service
            (or any part thereof) at any time without prior notice.
          </p>
        </Section>

        {/* 2. Eligibility */}
        <Section id="eligibility" title="2. Eligibility">
          <p>
            You must be at least{" "}
            <strong className="text-white/80">13 years of age</strong> to use
            Snap-It. If you are between the ages of 13 and 18, you represent
            that you have obtained the consent of a parent or legal guardian to
            use the service and to be bound by these Terms.
          </p>
          <p>
            By using Snap-It you represent and warrant that you meet the
            eligibility requirements above.
          </p>
        </Section>

        {/* 3. Permitted Use */}
        <Section id="permitted-use" title="3. Permitted Use">
          <p>
            Subject to these Terms, we grant you a limited, non-exclusive,
            non-transferable, revocable licence to access and use Snap-It for
            your personal or professional screenshot editing purposes.
          </p>
          <p>You may use Snap-It to:</p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>Upload, edit, and export screenshots and images</li>
            <li>Share your exported images for any lawful purpose</li>
            <li>
              Use Snap-It for personal, commercial, or professional projects
            </li>
          </ul>
        </Section>

        {/* 4. Prohibited Activities */}
        <Section id="prohibited" title="4. Prohibited Activities">
          <p>
            You agree not to use Snap-It for any unlawful, harmful, or abusive
            purpose. Without limiting the foregoing, you must not:
          </p>
          <ul className="space-y-1.5">
            {[
              "Use the service to process, create, or distribute any image that is illegal, obscene, defamatory, threatening, harassing, abusive, or otherwise objectionable",
              "Reverse-engineer, decompile, disassemble, or attempt to derive the source code of Snap-It",
              "Use automated bots, scrapers, or scripts to access or interact with the service",
              "Attempt to gain unauthorised access to our servers, systems, or backend infrastructure",
              "Misrepresent your identity or affiliation with any person or entity",
              "Use Snap-It in any manner that could damage, disable, overburden, or impair the service",
              "Circumvent, disable, or interfere with security features of the service",
              "Upload or process images to which you do not hold the necessary rights or permissions",
              "Use Snap-It to violate any applicable law, regulation, or third-party rights",
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

        {/* 5. IP */}
        <Section id="ip" title="5. Intellectual Property">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5">
              <p className="text-sm font-medium text-white/80">Your Images</p>
              <p>
                You retain full ownership of all images and screenshots you
                upload or process using Snap-It. We claim no rights over your
                content. Your files are never stored on our servers — they exist
                only in your browser session.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5">
              <p className="text-sm font-medium text-white/80">
                Snap-It Platform
              </p>
              <p>
                All rights in the Snap-It user interface, design, source code,
                visual assets, trademarks, and branding (&ldquo;Platform
                Content&rdquo;) are owned by or licensed to Rekabytes
                Enterprise. Nothing in these Terms grants you any ownership or
                licence in the Platform Content other than the limited access
                licence in Section 3.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5">
              <p className="text-sm font-medium text-white/80">
                Third-Party Content
              </p>
              <p>
                You are responsible for ensuring you have the necessary rights
                or permissions for any image you process using Snap-It. We
                accept no liability for any infringement of third-party
                intellectual property rights arising from your use of the
                service.
              </p>
            </div>
          </div>
        </Section>

        {/* 6. Privacy */}
        <Section id="privacy" title="6. Privacy and Data Protection">
          <p>
            Your use of Snap-It is also governed by our{" "}
            <Link
              href="/privacy-policy"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/cookie-policy"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Cookie Policy
            </Link>
            , which are incorporated into these Terms by reference. We process
            anonymous analytics data in accordance with the{" "}
            <strong className="text-white/80">
              Personal Data Protection Act 2010 (Akta 709)
            </strong>
            . See our Privacy Policy for full details.
          </p>
        </Section>

        {/* 7. Disclaimer */}
        <Section id="disclaimer" title="7. Disclaimer of Warranties">
          <p>
            Snap-It is provided on an{" "}
            <strong className="text-white/80">&ldquo;as is&rdquo;</strong> and{" "}
            <strong className="text-white/80">
              &ldquo;as available&rdquo;
            </strong>{" "}
            basis without warranties of any kind, whether express, implied, or
            statutory.
          </p>
          <p>
            To the fullest extent permitted by applicable law, Rekabytes
            Enterprise disclaims all warranties, including but not limited to:
          </p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>
              Warranties of merchantability, fitness for a particular purpose,
              and non-infringement
            </li>
            <li>
              That the service will be uninterrupted, error-free, or free from
              viruses or other harmful components
            </li>
            <li>That any errors or defects will be corrected</li>
            <li>
              That the service will meet your requirements or produce any
              particular result
            </li>
          </ul>
        </Section>

        {/* 8. Limitation of Liability */}
        <Section id="liability" title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by the laws of Malaysia, Rekabytes
            Enterprise and its owners, employees, and agents shall not be liable
            for:
          </p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>
              Any indirect, incidental, special, consequential, or punitive
              damages
            </li>
            <li>Loss of data, revenue, profits, goodwill, or business</li>
            <li>
              Damages arising from your use of or inability to use Snap-It
            </li>
            <li>
              Any loss or damage to images or files resulting from your use of
              the service
            </li>
          </ul>
          <p>
            Our total aggregate liability to you, if any, shall not exceed{" "}
            <strong className="text-white/80">
              MYR 100 (one hundred Ringgit Malaysia)
            </strong>
            .
          </p>
          <p>
            Some jurisdictions do not allow the exclusion or limitation of
            liability for certain types of damages, so some of the above
            limitations may not apply to you.
          </p>
        </Section>

        {/* 9. Indemnification */}
        <Section id="indemnification" title="9. Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless Rekabytes
            Enterprise and its owners, employees, and agents from and against
            any claims, damages, losses, costs, and expenses (including
            reasonable legal fees) arising out of or relating to:
          </p>
          <ul className="space-y-1.5 list-disc list-inside marker:text-white/20">
            <li>Your use of Snap-It</li>
            <li>Your violation of these Terms</li>
            <li>
              Your violation of any applicable law or third-party right,
              including intellectual property rights
            </li>
            <li>Any images you process through the service</li>
          </ul>
        </Section>

        {/* 10. Termination */}
        <Section id="termination" title="10. Termination and Suspension">
          <p>
            We reserve the right to restrict, suspend, or terminate your access
            to Snap-It at any time, without prior notice, if we reasonably
            believe you have violated these Terms or any applicable law.
          </p>
          <p>
            As Snap-It requires no account, termination means we may block
            access from your IP address or take other technical measures to
            prevent misuse.
          </p>
        </Section>

        {/* 11. Third-party links */}
        <Section id="links" title="11. Third-Party Links">
          <p>
            Snap-It may contain links to third-party websites, such as the
            GitHub repository for release notes. These links are provided for
            your convenience only. We have no control over the content or
            practices of third-party sites and accept no responsibility or
            liability for them. Visiting third-party sites is at your own risk.
          </p>
        </Section>

        {/* 12. Governing Law */}
        <Section id="governing-law" title="12. Governing Law and Jurisdiction">
          <p>
            These Terms are governed by and construed in accordance with the
            laws of <strong className="text-white/80">Malaysia</strong>. Any
            dispute, controversy, or claim arising out of or relating to these
            Terms, or the breach, termination, or invalidity thereof, shall be
            subject to the exclusive jurisdiction of the courts of Malaysia.
          </p>
          <p>
            If you are located in another jurisdiction, local laws may also
            apply to the extent required by applicable mandatory law.
          </p>
        </Section>

        {/* 13. Changes */}
        <Section id="changes" title="13. Changes to These Terms">
          <p>
            We may update these Terms from time to time. When we do, we will
            update the &ldquo;Last updated&rdquo; date at the top of this page.
            Material changes will be notified by prominent notice on the site or
            by other reasonable means.
          </p>
          <p>
            Your continued use of Snap-It after any changes constitutes your
            acceptance of the new Terms. If you do not agree to the updated
            Terms, you must stop using the service.
          </p>
        </Section>

        {/* 14. Contact */}
        <Section id="contact" title="14. Contact">
          <p>If you have any questions about these Terms, please contact us:</p>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
            <p className="font-semibold text-white/80">Rekabytes Enterprise</p>
            <p className="text-white/50">Operator of Snap-It</p>
            <p>
              <a
                href={`mailto:${CONTROLLER_EMAIL}`}
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                {CONTROLLER_EMAIL}
              </a>
            </p>
          </div>
        </Section>

        {/* Related */}
        <div className="h-px bg-white/5" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/privacy-policy"
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-medium text-white/80">Privacy Policy</p>
            <p className="text-xs text-white/40 mt-0.5">
              How we collect and protect your data under PDPA 2010
            </p>
          </Link>
          <Link
            href="/cookie-policy"
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-medium text-white/80">Cookie Policy</p>
            <p className="text-xs text-white/40 mt-0.5">
              Analytics events, consent levels, and your choices
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
