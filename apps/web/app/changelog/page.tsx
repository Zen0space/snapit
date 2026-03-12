import { Metadata } from "next";
import Link from "next/link";
import { getReleases, GitHubRelease } from "@/lib/github";

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

function ReleaseCard({ release }: { release: GitHubRelease }) {
  return (
    <article className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {release.name || release.tag_name}
          </h2>
          <time className="text-sm text-white/40">
            {formatDate(release.published_at)}
          </time>
        </div>
        <div className="flex items-center gap-2">
          {release.prerelease && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              Pre-release
            </span>
          )}
          <a
            href={release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <ReleaseBody body={release.body} />
      </div>
    </article>
  );
}

function ReleaseBody({ body }: { body: string }) {
  if (!body) return null;

  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3
          key={index}
          className="text-lg font-medium text-white/90 mt-4 mb-2 first:mt-0 first:mb-2"
        >
          {trimmed.replace("## ", "")}
        </h3>,
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h4
          key={index}
          className="text-base font-medium text-white/80 mt-3 mb-1"
        >
          {trimmed.replace("### ", "")}
        </h4>,
      );
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <li key={index} className="text-white/70 ml-4">
          {parseInline(trimmed.slice(2))}
        </li>,
      );
    } else if (trimmed.startsWith("* ")) {
      elements.push(
        <li key={index} className="text-white/70 ml-4">
          {parseInline(trimmed.slice(2))}
        </li>,
      );
    } else if (trimmed.match(/^\*\*Full Changelog\*\*/)) {
      const linkMatch = trimmed.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        elements.push(
          <p key={index} className="text-white/50 text-sm mt-4">
            <a
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              {linkMatch[1]}
            </a>
          </p>,
        );
      }
    } else if (trimmed) {
      elements.push(
        <p key={index} className="text-white/70 my-1">
          {parseInline(trimmed)}
        </p>,
      );
    }
  });

  return <>{elements}</>;
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
          className="px-1 py-0.5 rounded bg-white/10 text-white/80 font-mono text-xs"
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
          className="text-sky-400 hover:text-sky-300 underline"
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-white/10 bg-[#0f0f0f]">
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
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            GitHub Releases
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Changelog</h1>
          <p className="text-white/50">
            All the latest updates and improvements to Snap-It.
          </p>
        </header>

        {releases.length === 0 ? (
          <div className="text-center py-16 text-white/40">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
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
            <p>No releases yet. Check back soon!</p>
            <a
              href="https://github.com/Zen0space/snapit/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sky-400 hover:text-sky-300"
            >
              View releases on GitHub
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {releases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
