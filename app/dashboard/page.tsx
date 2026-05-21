"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useLeadSearch } from "@/hooks/useLeadSearch";
import type { Lead } from "@/lib/types";

function ResultCard({ lead, index }: { lead: Lead; index: number }) {
  return (
    <div
      className="dash-result"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#0F0F0F",
        padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        animationDelay: `${Math.min(index * 80, 640)}ms`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontWeight: 600, color: "#EDEDED",
          fontSize: 14, margin: "0 0 5px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {lead.name}
        </p>
        <a
          href={lead.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            color: "#3A3A3A", fontSize: 11, textDecoration: "none",
            fontFamily: "var(--font-sans)", letterSpacing: "0.02em",
            transition: "color 0.2s ease",
          }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          View on Maps
        </a>
      </div>
      <a
        href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
        style={{
          flexShrink: 0, padding: "6px 12px",
          border: "1px solid rgba(34,197,94,0.22)",
          color: "#22C55E", fontSize: 12, fontWeight: 500,
          textDecoration: "none", fontFamily: "var(--font-sans)",
          letterSpacing: "0.02em",
          transition: "background 0.15s ease",
        }}
      >
        {lead.phone}
      </a>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userDoc, loading, refreshUserDoc } = useAuth();
  const {
    status,
    results,
    isSearching,
    phoneCount,
    error,
    performSearch,
    stopSearch,
    clearResults,
    exportCSV,
  } = useLeadSearch();

  const [bType, setBType] = useState("");
  const [city, setCity] = useState("");
  const [localities, setLocalities] = useState("");
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (results.length > 0) {
      resultsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [results.length]);

  useEffect(() => {
    if (!isSearching && results.length > 0) refreshUserDoc();
  }, [isSearching]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await signOut(firebaseAuth());
    router.replace("/");
  };

  const creditsLeft = userDoc
    ? Math.max(0, (userDoc.searchesLimit ?? 1) - (userDoc.searchesUsed ?? 0))
    : 0;
  const canSearch = creditsLeft > 0 && !isSearching;
  const isPaidPlan = userDoc?.plan === "starter" || userDoc?.plan === "pro";
  const maxLeads = isPaidPlan ? Infinity : 10;
  const handleSearch = () => performSearch(bType, city, localities, maxLeads);
  const hasResults = results.length > 0;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 20, height: 20, border: "1.5px solid #22C55E", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column" }}>

      {/* ── Minimal top bar ─────────────────────────────────────────────────── */}
      <div style={{
        height: 48, flexShrink: 0,
        padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "#333",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220,
        }}>
          {user?.email}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            href="/pricing"
            style={{
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              color: "#22C55E", textDecoration: "none", letterSpacing: "0.04em",
              transition: "opacity 0.2s ease",
            }}
          >
            Upgrade
          </Link>
          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 4, color: "#2E2E2E", display: "flex", alignItems: "center",
              transition: "color 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Content area ────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: hasResults ? "flex-start" : "center",
        padding: hasResults ? "44px 20px 100px" : "0 20px 80px",
      }}>

        {/* ── Floating search card ─────────────────────────────────────────── */}
        <div style={{
          width: "100%", maxWidth: 580,
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.55)",
          padding: "28px 28px 24px",
        }}>

          {/* Card header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
            <span style={{
              fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700,
              letterSpacing: "-0.01em", color: "#EDEDED",
            }}>
              Local<span style={{ color: "#22C55E" }}>Leads</span>
            </span>
            {/* Credits pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "4px 10px",
              border: "1px solid rgba(34,197,94,0.2)",
              background: "rgba(34,197,94,0.04)",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: creditsLeft > 0 ? "#22C55E" : "#333", display: "inline-block", flexShrink: 0 }} />
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
                color: creditsLeft > 0 ? "#22C55E" : "#444",
                letterSpacing: "0.02em",
              }}>
                {creditsLeft} search{creditsLeft !== 1 ? "es" : ""} left
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 700, lineHeight: 1.08,
            letterSpacing: "-0.025em", color: "#EDEDED",
            margin: "0 0 7px",
          }}>
            Find your next client.
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 13, color: "#444",
            margin: "0 0 24px", lineHeight: 1.5,
          }}>
            Enter a business type and city to begin.
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 22 }} />

          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div>
              <label style={{
                fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#3A3A3A", display: "block", marginBottom: 7,
              }}>
                Business Type
              </label>
              <input
                type="text"
                value={bType}
                onChange={(e) => setBType(e.target.value)}
                placeholder="e.g. CA firm, Travel agent"
                disabled={isSearching}
                className="input-dark"
                style={{ opacity: isSearching ? 0.45 : 1 }}
              />
            </div>
            <div>
              <label style={{
                fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#3A3A3A", display: "block", marginBottom: 7,
              }}>
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSearch && bType && city) handleSearch();
                }}
                placeholder="e.g. Jaipur"
                disabled={isSearching}
                className="input-dark"
                style={{ opacity: isSearching ? 0.45 : 1 }}
              />
            </div>
            <div>
              <label style={{
                fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#3A3A3A", display: "block", marginBottom: 7,
              }}>
                Localities{" "}
                <span style={{ color: "#2A2A2A", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
              </label>
              <textarea
                value={localities}
                onChange={(e) => setLocalities(e.target.value)}
                placeholder="e.g. Malviya Nagar, C-Scheme"
                disabled={isSearching}
                className="input-dark"
                style={{ resize: "none", minHeight: 80, opacity: isSearching ? 0.45 : 1 }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 16,
              padding: "11px 14px",
              border: "1px solid rgba(239,68,68,0.28)",
              background: "rgba(239,68,68,0.05)",
              fontFamily: "var(--font-sans)", fontSize: 12, color: "#F87171", lineHeight: 1.55,
            }}>
              {error}
              {error.toLowerCase().includes("limit") && (
                <>{" "}<Link href="/pricing" style={{ textDecoration: "underline", color: "#22C55E" }}>Upgrade now</Link></>
              )}
            </div>
          )}

          {/* Primary action */}
          <div style={{ marginTop: 18 }}>
            {canSearch ? (
              <button
                onClick={handleSearch}
                disabled={!bType || !city}
                className="btn-gold"
                style={{
                  width: "100%",
                  opacity: (!bType || !city) ? 0.35 : 1,
                  cursor: (!bType || !city) ? "not-allowed" : "pointer",
                }}
              >
                Search
              </button>
            ) : isSearching ? (
              <button
                onClick={stopSearch}
                style={{
                  width: "100%", padding: "14px 0",
                  border: "1px solid rgba(239,68,68,0.28)",
                  background: "transparent", color: "#F87171",
                  fontFamily: "var(--font-sans)", fontSize: 12,
                  fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "pointer", transition: "background 0.2s ease",
                }}
              >
                Stop Search
              </button>
            ) : (
              <Link
                href="/pricing"
                className="btn-gold"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Upgrade to Continue
              </Link>
            )}
          </div>

          {/* Status bar */}
          {(isSearching || status !== "Ready") && (
            <div style={{
              marginTop: 16, paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", gap: 9,
            }}>
              {isSearching && (
                <span
                  className="pulse-dot"
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#22C55E", display: "inline-block", flexShrink: 0,
                  }}
                />
              )}
              <span style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 11, color: "#3A3A3A", lineHeight: 1.5,
              }}>
                {status}
              </span>
            </div>
          )}
        </div>

        {/* ── Results ─────────────────────────────────────────────────────── */}
        {hasResults && (
          <div style={{ width: "100%", maxWidth: 580, marginTop: 20 }}>

            {/* Count row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 14, paddingLeft: 2,
            }}>
              <span style={{
                fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700,
                color: "#22C55E", letterSpacing: "-0.02em", lineHeight: 1,
              }}>
                {phoneCount}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555" }}>
                qualified contacts found
              </span>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {results.map((lead: Lead, i) => (
                <ResultCard key={`${lead.phone}-${i}`} lead={lead} index={i} />
              ))}
              <div ref={resultsEndRef} />
            </div>
          </div>
        )}

        {/* ── Export + clear ───────────────────────────────────────────────── */}
        {hasResults && !isSearching && (
          <div style={{ width: "100%", maxWidth: 580, marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {isPaidPlan ? (
              <button
                onClick={exportCSV}
                className="btn-ghost"
                style={{
                  width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV — {phoneCount} contacts
              </button>
            ) : (
              <Link
                href="/pricing"
                className="btn-ghost"
                style={{
                  width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: 0.35, textDecoration: "none",
                }}
                title="Upgrade to export"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Export CSV — upgrade to unlock
              </Link>
            )}
            <button
              onClick={clearResults}
              style={{
                width: "100%", padding: "10px 0",
                border: "none", background: "transparent",
                color: "#252525", fontFamily: "var(--font-sans)", fontSize: 11,
                fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "color 0.2s ease",
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dashFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-result {
          opacity: 0;
          animation: dashFadeUp 0.28s ease forwards;
        }
        .dash-result a:hover { opacity: 0.75; }
      `}</style>
    </div>
  );
}
