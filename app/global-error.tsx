"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body style={{
        background: "#080808",
        color: "#EDEDED",
        fontFamily: "sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: 16,
        textAlign: "center",
        padding: 40,
        margin: 0,
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Something broke.
        </h2>
        <p style={{ color: "#555", fontSize: 15, margin: 0 }}>
          We have been notified and will fix it.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#22C55E",
            color: "#000",
            border: "none",
            padding: "12px 24px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
