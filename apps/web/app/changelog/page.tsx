import { Metadata } from "next";
import Link from "next/link";
import { getReleases, GitHubRelease } from "@/lib/github";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release notes and updates for Snap-It",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

const categoryConfig: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  "whats new": { icon: "✨", color: "text-emerald-400", label: "What's New" },
  features: { icon: "✨", color: "text-emerald-400", label: "Features" },
  "new features": { icon: "✨", color: "text-emerald-400", label: "Features" },
  fixes: { icon: "🐛", color: "text-red-400", label: "Fixes" },
  "bug fixes": { icon: "🐛", color: "text-red-400", label: "Bug Fixes" },
  improvements: { icon: "⚡", color: "text-amber-400", label: "Improvements" },
  enhancements: { icon: "⚡", color: "text-amber-400", label: "Improvements" },
  documentation: { icon: "📝", color: "text-blue-400", label: "Documentation" },
  docs: { icon: "📝", color: "text-blue-400", label: "Documentation" },
  "breaking changes": {
    icon: "💥",
    color: "text-orange-400",
    label: "Breaking Changes",
  },
  performance: { icon: "🚀", color: "text-purple-400", label: "Performance" },
  default: { icon: "📦", color: "text-white/60", label: "Changes" },
};

type CategoryConfig = { icon: string; color: string; label: string };

type Section = {
  config: CategoryConfig;
  items: string[];
};

function getCategoryConfig(header: string) {
  // Remove emojis and special characters, then normalize
  const normalized = header
    .toLowerCase()
    .replace(
      /[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu,
      "",
    ) // Remove all emojis
    .replace(/[:\-']/g, "") // Remove colons, dashes, and apostrophes
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
  return categoryConfig[normalized] || categoryConfig.default;
}

function ReleaseCard({
  release,
  isFirst,
}: {
  release: GitHubRelease;
  isFirst: boolean;
}) {
  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

      <div className="absolute left-0 top-1 -translate-x-1/2">
        <div
          className={`w-2 h-2 rounded-full ${isFirst ? "bg-gradient-to-r from-sky-400 to-violet-400 ring-4 ring-sky-400/20" : "bg-white/30"}`}
        />
      </div>

      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <article className="relative backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                {release.tag_name}
              </span>
              {release.prerelease && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  PRE-RELEASE
                </span>
              )}
              {isFirst && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LATEST
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/40">
                  {getRelativeDate(release.published_at)}
                </p>
                <p className="text-[10px] text-white/25">
                  {formatDate(release.published_at)}
                </p>
              </div>
              <a
                href={release.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                title="View on GitHub"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          <ReleaseBody body={release.body} />
        </article>
      </div>
    </div>
  );
}

function ReleaseBody({ body }: { body: string }) {
  if (!body) {
    return (
      <p className="text-white/40 text-sm italic">
        No release notes available.
      </p>
    );
  }

  const lines = body.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  const pushCurrentSection = () => {
    if (currentSection && currentSection.items.length > 0) {
      sections.push(currentSection);
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      pushCurrentSection();
      currentSection = {
        config: getCategoryConfig(trimmed.replace("## ", "")),
        items: [],
      };
    } else if (trimmed.startsWith("### ")) {
      pushCurrentSection();
      currentSection = {
        config: getCategoryConfig(trimmed.replace("### ", "")),
        items: [],
      };
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!currentSection) {
        currentSection = { config: categoryConfig.default, items: [] };
      }
      currentSection.items.push(trimmed.slice(2));
    }
  }

  pushCurrentSection();

  if (sections.length === 0) {
    return (
      <div className="space-y-2">
        {lines
          .filter((l) => l.trim())
          .map((line, i) => (
            <p key={i} className="text-white/70 text-sm">
              {parseInline(line.trim())}
            </p>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {sections.map((section, idx) => (
        <div key={idx}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{section.config.icon}</span>
            <h3 className={`text-sm font-semibold ${section.config.color}`}>
              {section.config.label}
            </h3>
          </div>
          <ul className="space-y-2">
            {section.items.map((item, itemIdx) => (
              <li
                key={itemIdx}
                className="flex items-start gap-2 text-sm text-white/70"
              >
                <span className="text-white/30 mt-1.5">•</span>
                <span className="leading-relaxed">{parseInline(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    const matches = [
      boldMatch && {
        type: "bold" as const,
        match: boldMatch,
        index: boldMatch.index!,
      },
      codeMatch && {
        type: "code" as const,
        match: codeMatch,
        index: codeMatch.index!,
      },
      linkMatch && {
        type: "link" as const,
        match: linkMatch,
        index: linkMatch.index!,
      },
    ].filter(Boolean) as {
      type: string;
      match: RegExpMatchArray;
      index: number;
    }[];

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const first = matches.sort((a, b) => a.index - b.index)[0];

    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index));
    }

    if (first.type === "bold") {
      parts.push(
        <strong key={key++} className="font-semibold text-white/90">
          {first.match[1]}
        </strong>,
      );
      remaining = remaining.slice(first.index + first.match[0].length);
    } else if (first.type === "code") {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-white/10 text-sky-300/90 font-mono text-xs"
        >
          {first.match[1]}
        </code>,
      );
      remaining = remaining.slice(first.index + first.match[0].length);
    } else if (first.type === "link") {
      parts.push(
        <a
          key={key++}
          href={first.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
        >
          {first.match[1]}
        </a>,
      );
      remaining = remaining.slice(first.index + first.match[0].length);
    }
  }

  return parts;
}

export default async function ChangelogPage() {
  let releases: GitHubRelease[] = [];

  try {
    releases = await getReleases();
  } catch (error) {
    console.error("Failed to fetch releases:", error);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <nav className="relative border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
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
            <span className="font-semibold">Snap-It</span>
          </Link>
          <a
            href="https://github.com/Zen0space/snapit/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </nav>

      <main className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <header className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/20 to-violet-500/20 text-white/80 border border-white/10">
              What&apos;s New
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Changelog
            </span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            All the latest features, improvements, and fixes to Snap-It.
          </p>
        </header>

        {releases.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-white/40 mb-2">No releases yet</p>
            <p className="text-white/25 text-sm mb-6">
              Check back soon for updates!
            </p>
            <a
              href="https://github.com/Zen0space/snapit/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              View releases on GitHub
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        ) : (
          <div className="relative">
            {releases.map((release, index) => (
              <ReleaseCard
                key={release.id}
                release={release}
                isFirst={index === 0}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
