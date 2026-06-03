"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { firebaseAuth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { trackEvent } from "@/lib/gtag";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const trialParam = searchParams.get("trial");
  const postSignInPath = planParam
    ? `/dashboard?plan=${planParam}${trialParam === "true" ? "&trial=true" : ""}`
    : "/dashboard";
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  // True while we're waiting for a redirect result to resolve —
  // keeps the spinner up so the form never flashes after a redirect.
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  // On mount: resolve any pending redirect result from the fallback flow.
  // getRedirectResult() resolves in < 50 ms when nothing is pending.
  useEffect(() => {
    getRedirectResult(firebaseAuth())
      .then((result) => {
        if (result?.user) {
          router.replace(postSignInPath);
        }
      })
      .catch((err: { code?: string }) => {
        const code = err.code ?? "";
        if (
          code &&
          !code.includes("popup-closed") &&
          !code.includes("cancelled")
        ) {
          setError(`Sign-in failed (${code}). Please try again.`);
        }
      })
      .finally(() => setCheckingRedirect(false));
  }, [router]);

  // Redirect once auth resolves (fresh login or returning from redirect)
  useEffect(() => {
    if (!loading && user) router.replace(postSignInPath);
  }, [user, loading, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoogleSignIn = () => {
    // ─── CRITICAL ─────────────────────────────────────────────────────────
    // signInWithPopup MUST be the very first call — no setState, no await,
    // no async gaps before it. Browsers only allow window.open() inside a
    // synchronous user-gesture handler. Anything before it kills that trust.
    // ──────────────────────────────────────────────────────────────────────
    trackEvent("begin_signup", "auth", "google_signin");
    signInWithPopup(firebaseAuth(), googleProvider)
      .then(() => {
        trackEvent("sign_up", "auth", "google_signin_success");
        router.replace(postSignInPath);
      })
      .catch((err: { code?: string }) => {
        const code = err.code ?? "";

        if (code === "auth/popup-blocked") {
          // Browser blocked the popup — fall back to redirect flow.
          // This is common in Safari, Firefox strict mode, and some
          // corporate environments.
          setCheckingRedirect(true);
          signInWithRedirect(firebaseAuth(), googleProvider).catch(() => {
            setCheckingRedirect(false);
            setError(
              "Sign-in is unavailable. Please allow popups for this site, or try a different browser."
            );
          });
          return;
        }

        if (
          code === "auth/popup-closed-by-user" ||
          code === "auth/cancelled-popup-request"
        ) {
          // User dismissed — nothing to do.
          return;
        }

        setError(`Sign-in failed (${code || "unknown error"}). Please try again.`);
      });
  };

  if (loading || checkingRedirect) {
    return (
      <div
        style={{
          minHeight: "100vh", background: "#0A0A0B",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 20,
        }}
      >
        <span style={{
          fontFamily: "var(--font-serif)",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.015em",
          color: "#EDEDED",
          animation: "pulseGlow 1.8s ease-in-out infinite",
        }}>
          Local<span style={{ color: "var(--color-gold)", textShadow: "0 0 10px rgba(255, 230, 93, 0.5)" }}>Leads</span>
        </span>
        <div style={{
          width: 120,
          height: 3,
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: 999,
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            height: "100%",
            width: "50%",
            background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
            borderRadius: 999,
            animation: "glide 1.4s ease-in-out infinite",
            boxShadow: "0 0 8px var(--color-gold)"
          }} />
        </div>
        <style>{`
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1); }
          }
          @keyframes glide {
            0% { left: -50%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="auth-grid"
      style={{
        minHeight: "100vh", background: "#0A0A0B",
        display: "grid", gridTemplateColumns: "45% 55%",
      }}
    >
      {/* Left — editorial brand panel */}
      <div
        className="auth-panel-left"
        style={{
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "52px 56px",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: "120%", height: "50%",
            background: "radial-gradient(ellipse at center bottom, rgba(255,230,93,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <Link href="/" style={{ textDecoration: "none", position: "relative" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
            Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
          </span>
        </Link>

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <span style={{ display: "block", width: 24, height: 1, background: "var(--color-gold)" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              what you get
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#EDEDED", margin: "0 0 24px" }}>
            Find shops<br />
            with no website.<br />
            <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>Get paid!</span>
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#888", lineHeight: 1.68, margin: "0 0 32px", maxWidth: 320 }}>
            Get active phone numbers of shops straight from Google Maps. Only call shops that do not have a website yet!
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", border: "1px solid rgba(255,230,93,0.15)", background: "rgba(255,230,93,0.04)", borderRadius: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-gold)", display: "inline-block", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#888", margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: "#EDEDED" }}>847 people</strong> are using this to make money right now!
            </p>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#2A2A2A", position: "relative" }}>
          Built by Sahajta AI Solutions
        </p>
      </div>

      {/* Right — sign-in panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "52px 64px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#EDEDED", margin: "0 0 10px" }}>
              Welcome back!
            </h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#888", margin: 0 }}>
              Log in to find shop phone numbers.
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: 20, padding: "12px 16px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", fontFamily: "var(--font-sans)", fontSize: 13, color: "#F87171", lineHeight: 1.55 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              padding: "15px 20px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 30,
              background: "#0F0F0F",
              color: "#EDEDED",
              fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.2s ease, background 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div style={{ margin: "28px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }} />

          <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#444", lineHeight: 1.6, margin: "0 0 24px", textAlign: "center" }}>
            By logging in, you agree to our{" "}
            <a href="/terms" style={{ color: "#666", textDecoration: "underline" }}>Terms</a> and{" "}
            <a href="/privacy" style={{ color: "#666", textDecoration: "underline" }}>Privacy Policy</a>.
          </p>

          <p style={{ textAlign: "center", margin: 0 }}>
            <Link href="/" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#666", textDecoration: "none" }}>
              ← Go back home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
