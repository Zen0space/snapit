const GITHUB_REPO = "Zen0space/snapit";
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
}

export async function getReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(GITHUB_API_URL, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch releases: ${res.status}`);
  }

  const releases: GitHubRelease[] = await res.json();

  return releases.filter((release) => !release.draft);
}

export async function getLatestRelease(): Promise<GitHubRelease | null> {
  const releases = await getReleases();
  return releases.find((r) => !r.prerelease) ?? releases[0] ?? null;
}
