/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Prevent the admin panel from being embedded in an iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't send the Referer header when navigating away
  { key: "Referrer-Policy", value: "no-referrer" },
  // Disable browser features not needed in an admin panel
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Enforce HTTPS for 1 year (applied in production only via middleware/CDN,
  // but safe to set here for when the app is served over HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Strict CSP: only allow resources from self; no inline scripts or styles.
  // Recharts injects inline styles — we permit style-src 'unsafe-inline' for that.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  transpilePackages: ["@snap-it/types"],
  async headers() {
    return [
      {
        // Apply to every route in the admin app
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
