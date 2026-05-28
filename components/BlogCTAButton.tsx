"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/gtag";

export function BlogCTAButton() {
  return (
    <Link
      href="/auth"
      className="blog-cta-btn"
      onClick={() => trackEvent("blog_cta_click", "blog", "scan_free_shops")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "var(--color-gold)",
        color: "#0A0A0B",
        padding: "13px 26px",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: 700,
        textDecoration: "none",
        borderRadius: 30,
        transition: "background-color 0.2s ease, transform 0.15s ease",
      }}
    >
      Scan 20 free shops now
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  );
}
