import Link from "next/link";

const LINKS = [
  {
    heading: "Product",
    items: [{ label: "Changelog", href: "/changelog" }],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
  {
    heading: "Help",
    items: [{ label: "Support", href: "/support" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-16">
      <div className="mx-auto max-w-3xl px-5 py-10">
        {/* Link columns */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          {LINKS.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/25">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-white/[0.05] mb-6" />
        <div className="flex items-center justify-between">
          {/* Logo + name */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-white/40 transition-opacity hover:opacity-70"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-violet-500">
              <svg
                className="h-3.5 w-3.5 text-white"
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

          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Rekabytes Enterprise. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
