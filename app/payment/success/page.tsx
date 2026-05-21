"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.replace("/dashboard");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>

      {/* Green ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 52 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
            Local<span style={{ color: "#22C55E" }}>Leads</span>
          </span>
        </Link>

        {/* Success icon */}
        <div style={{
          width: 72, height: 72,
          border: "1.5px solid rgba(34,197,94,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
          background: "rgba(34,197,94,0.06)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Thin line */}
        <div style={{ width: 40, height: 1, background: "#22C55E", margin: "0 auto 28px" }} />

        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 700, lineHeight: 1.05,
          letterSpacing: "-0.025em", color: "#EDEDED",
          margin: "0 0 12px",
        }}>
          Plan activated.
        </h1>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#666", margin: "0 0 8px", lineHeight: 1.65 }}>
          Your subscription is now active. Welcome to LocalLeads.
        </p>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#3A3A3A", margin: "0 0 44px" }}>
          Redirecting to your dashboard in{" "}
          <span style={{ color: "#22C55E", fontWeight: 600 }}>{countdown}</span> second{countdown !== 1 ? "s" : ""}...
        </p>

        <Link href="/dashboard" className="btn-gold" style={{ display: "inline-block" }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
