import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
// Git SHA of the build, set by the Docker build arg APP_VERSION.
// CI reads it from the x-app-version header to tell when a deploy is live.
const appVersion = process.env.APP_VERSION || "dev";
const isDev = process.env.NODE_ENV === "development";

// Static pages cannot carry per-request nonces, so scripts and styles allow
// 'unsafe-inline' (next-themes and Next.js inject inline snippets). 'unsafe-eval'
// is only needed by React's dev tooling.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Turns off browser features the site never uses (OWASP Secure Headers
// Project list, minus entries browsers no longer recognise).
const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: permissionsPolicy },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          // OWASP Secure Headers Project recommendations. COEP is left out:
          // require-corp adds nothing for a site that loads no cross-origin
          // resources and would block any it adds later.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "x-app-version", value: appVersion },
        ],
      },
    ];
  },
};
export default withNextIntl(nextConfig);
