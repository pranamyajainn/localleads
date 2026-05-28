import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Proxy Firebase Auth handler through our own origin so the OAuth flow is
  // same-origin with the app. Without this, authDomain points cross-site to
  // *.firebaseapp.com and Chrome/Safari's third-party-storage blocking breaks
  // both signInWithRedirect and the popup handshake.
  // See: https://firebase.google.com/docs/auth/web/redirect-best-practices
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://local-leads-244de.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "sahajta",
  project: "localleads",
  silent: true,
  widenClientFileUpload: true,
  sourcemaps: {
    filesToDeleteAfterUpload: [".next/static/**/*.map"],
  },
  webpack: {
    treeshake: { removeDebugLogging: true },
    automaticVercelMonitors: false,
  },
});
