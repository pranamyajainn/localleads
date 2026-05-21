"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useLeadSearch } from "@/hooks/useLeadSearch";
import type { Lead, SearchHistoryEntry } from "@/lib/types";

function ResultCard({ lead, index }: { lead: Lead; index: number }) {
  return (
    <div
      className="result-card"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="lead-name">{lead.name}</p>
        <a
          href={lead.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="maps-link"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Maps
        </a>
      </div>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <span className="lead-phone">{lead.phone}</span>
        <a
          href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
          className="call-btn"
        >
          Call
        </a>
      </div>
    </div>
  );
}

function GhostCards() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, opacity: 0.42 }}>
        {[68, 50, 80].map((w, i) => (
          <div
            key={i}
            className="ghost-card"
            style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div className="ghost-line" style={{ width: `${w}%`, height: 11 }} />
              <div className="ghost-line" style={{ width: "26%", height: 8 }} />
            </div>
            <div className="ghost-pill" style={{ width: 46, height: 28 }} />
          </div>
        ))}
      </div>
      <p style={{
        fontFamily: "var(--font-sans)", fontSize: 12, color: "#222",
        textAlign: "center", marginTop: 18, letterSpacing: "0.02em",
      }}>
        Enter a business type above to reveal real contacts.
      </p>
    </div>
  );
}

function exportHistoryCSV(entry: SearchHistoryEntry) {
  let csv = "Company Name,Phone Number,Google Maps Link\n";
  entry.leads.forEach((lead) => {
    csv += `"${lead.name.replace(/"/g, '""')}","${lead.phone}","${lead.mapsUrl}"\n`;
  });
  const bom = "﻿";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads_${entry.businessType}_${entry.city}_${entry.searchId.slice(0, 6)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userDoc, loading, refreshUserDoc } = useAuth();
  const {
    status, results, isSearching, phoneCount, error,
    performSearch, stopSearch, clearResults, exportCSV,
  } = useLeadSearch();

  const [bType, setBType] = useState("");
  const [city, setCity] = useState("");
  const [localities, setLocalities] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  // Load search history
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(firebaseDb(), "users", user.uid, "searches"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    getDocs(q).then((snap) => {
      setSearchHistory(snap.docs.map((d) => ({ searchId: d.id, ...d.data() })) as SearchHistoryEntry[]);
    }).catch(() => {});
  }, [user]);

  // Refresh user doc + history after search finishes
  useEffect(() => {
    if (!isSearching && results.length > 0 && user) {
      refreshUserDoc();
      const q = query(
        collection(firebaseDb(), "users", user.uid, "searches"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      getDocs(q).then((snap) => {
        setSearchHistory(snap.docs.map((d) => ({ searchId: d.id, ...d.data() })) as SearchHistoryEntry[]);
      }).catch(() => {});
    }
  }, [isSearching]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (results.length > 0) {
      resultsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [results.length]);

  const handleSignOut = async () => {
    await signOut(firebaseAuth());
    router.replace("/");
  };

  const leadsUsed = userDoc ? (userDoc.leadsUsed ?? 0) : 0;
  const leadsLimit = userDoc ? (userDoc.leadsLimit ?? 20) : 20;
  const leadsLeft = Math.max(0, leadsLimit - leadsUsed);
  const leadsPct = leadsLimit > 0 ? Math.round((leadsLeft / leadsLimit) * 100) : 0;

  const daysRemaining = userDoc?.planExpiresAt
    ? Math.max(0, Math.ceil((userDoc.planExpiresAt.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const canSearch = leadsLeft > 0 && !isSearching;
  const isPaidPlan = userDoc?.plan !== "free" && userDoc?.plan !== undefined;
  const planLabel = userDoc?.plan
    ? userDoc.plan.charAt(0).toUpperCase() + userDoc.plan.slice(1)
    : "Free";

  const handleSearch = () => performSearch(bType, city, localities);
  const hasResults = results.length > 0;
  const creditsBarColor = leadsLeft > leadsLimit * 0.2 ? "#22C55E" : leadsLeft > 0 ? "#F59E0B" : "#1E1E1E";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 20, height: 20, border: "1.5px solid #22C55E", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="db-root">

      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <div className="mobile-bar">
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 10px",
          border: "1px solid rgba(34,197,94,0.2)",
          background: "rgba(34,197,94,0.04)",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: leadsLeft > 0 ? "#22C55E" : "#333", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: leadsLeft > 0 ? "#22C55E" : "#444", letterSpacing: "0.02em" }}>
            {leadsLeft} leads
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="icon-btn"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#444", display: "flex", alignItems: "center" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      {/* ── Desktop sidebar ────────────────────────────────────────── */}
      <aside className="sidebar">
        <div style={{ flex: 1, padding: "28px 22px 24px", display: "flex", flexDirection: "column" }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", marginBottom: 36, display: "block" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 700, letterSpacing: "-0.015em", color: "#EDEDED" }}>
              Local<span style={{ color: "#22C55E" }}>Leads</span>
            </span>
          </Link>

          {/* Plan label */}
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: isPaidPlan ? "#22C55E" : "#3A3A3A",
            marginBottom: 12,
          }}>
            {planLabel} plan
          </span>

          {/* Leads used */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#444" }}>
                {isPaidPlan ? "Leads this month" : "Leads (lifetime)"}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: leadsLeft > 0 ? "#EDEDED" : "#333" }}>
                {leadsUsed}<span style={{ color: "#2A2A2A", fontWeight: 400 }}>/{leadsLimit}</span>
              </span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${leadsPct}%`,
                background: creditsBarColor,
                borderRadius: 2,
                transition: "width 0.55s ease",
              }} />
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "#2A2A2A", margin: "6px 0 0", lineHeight: 1.5 }}>
              {leadsLeft} leads left
              {daysRemaining !== null && (
                <span> · {daysRemaining}d remaining</span>
              )}
            </p>
          </div>

          {/* Upgrade CTA */}
          <Link
            href="/pricing"
            className="upgrade-cta"
            style={{
              display: "block", marginTop: 16,
              padding: "9px 12px",
              background: "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.18)",
              fontFamily: "var(--font-sans)", fontSize: 10,
              fontWeight: 700, color: "#22C55E",
              textDecoration: "none", textAlign: "center",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            {isPaidPlan ? "Change plan" : "Upgrade plan"}
          </Link>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "28px 0" }} />

          {/* Account */}
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, color: "#2A2A2A", margin: "0 0 6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Account
            </p>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 11, color: "#444",
              margin: "0 0 16px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.email}
            </p>
            <button
              onClick={handleSignOut}
              className="signout-btn"
              style={{
                background: "none", border: "none", padding: 0,
                fontFamily: "var(--font-sans)", fontSize: 10,
                color: "#2E2E2E", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>

          <div style={{ flex: 1 }} />

          <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "#1E1E1E", margin: 0, lineHeight: 1.7 }}>
            Questions?{" "}
            <a href="mailto:contact@sahajta.com" style={{ color: "#2A2A2A", textDecoration: "none" }}>
              contact@sahajta.com
            </a>
          </p>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="db-main">
        <div className="radial-glow" />

        <div className="main-inner">

          {/* Search zone */}
          <div className={`search-zone${isSearching ? " search-scanning" : ""}`}>

            <div style={{ marginBottom: 28 }}>
              <h1 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 3.5vw, 34px)",
                fontWeight: 700, lineHeight: 1.05,
                letterSpacing: "-0.03em", color: "#EDEDED",
                margin: "0 0 7px",
              }}>
                Find your next client.
              </h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>
                {isSearching
                  ? `Scanning Google Maps — ${phoneCount} lead${phoneCount !== 1 ? "s" : ""} found so far`
                  : "Enter a business type and city to begin."}
              </p>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 26 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-wrap">
                <input
                  type="text"
                  value={bType}
                  onChange={(e) => setBType(e.target.value)}
                  placeholder=" "
                  disabled={isSearching}
                  className="field-input input-dark"
                  style={{ opacity: isSearching ? 0.45 : 1 }}
                />
                <label className="field-label">Business Type</label>
              </div>
              <div className="field-wrap">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSearch && bType && city) handleSearch();
                  }}
                  placeholder=" "
                  disabled={isSearching}
                  className="field-input input-dark"
                  style={{ opacity: isSearching ? 0.45 : 1 }}
                />
                <label className="field-label">City</label>
              </div>
              <div className="field-wrap">
                <textarea
                  value={localities}
                  onChange={(e) => setLocalities(e.target.value)}
                  placeholder=" "
                  disabled={isSearching}
                  className="field-input input-dark"
                  style={{ resize: "none", minHeight: 82, opacity: isSearching ? 0.45 : 1 }}
                />
                <label className="field-label">
                  Localities <span style={{ textTransform: "none", letterSpacing: 0, color: "#2A2A2A" }}>(optional)</span>
                </label>
              </div>
            </div>

            {error && (
              <div style={{
                marginTop: 16, padding: "11px 14px",
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

            <div style={{ marginTop: 20 }}>
              {canSearch ? (
                <button
                  onClick={handleSearch}
                  disabled={!bType || !city}
                  className="btn-gold search-action"
                  style={{
                    width: "100%",
                    opacity: (!bType || !city) ? 0.3 : 1,
                    cursor: (!bType || !city) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  Find leads
                  <svg className="arrow-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
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
                    cursor: "pointer",
                  }}
                >
                  Stop Search
                </button>
              ) : (
                <Link href="/pricing" className="btn-gold" style={{ width: "100%", textAlign: "center", display: "block" }}>
                  Upgrade to Continue
                </Link>
              )}
            </div>

            {(isSearching || (status !== "Ready" && status !== "Results cleared.")) && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                {isSearching && (
                  <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", flexShrink: 0 }} />
                )}
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#3A3A3A", lineHeight: 1.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {status}
                </span>
              </div>
            )}
          </div>

          {/* Ghost cards */}
          {!hasResults && !isSearching && <GhostCards />}

          {/* Results */}
          {hasResults && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 700, color: "#22C55E", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {phoneCount}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555" }}>
                  qualified leads
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {results.map((lead: Lead, i) => (
                  <ResultCard key={`${lead.phone}-${i}`} lead={lead} index={i} />
                ))}
                <div ref={resultsEndRef} />
              </div>
            </div>
          )}

          {/* Export + clear */}
          {hasResults && !isSearching && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {isPaidPlan ? (
                <button
                  onClick={exportCSV}
                  className="btn-ghost"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export CSV — {phoneCount} leads
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="btn-ghost"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0.35, textDecoration: "none" }}
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
                className="clear-btn"
                style={{
                  width: "100%", padding: "10px 0",
                  border: "none", background: "transparent",
                  color: "#252525", fontFamily: "var(--font-sans)", fontSize: 11,
                  fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* ── Search History ──────────────────────────────────────── */}
          {searchHistory.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2E2E2E", flexShrink: 0 }}>
                  Search History
                </span>
                <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {searchHistory.map((entry) => (
                  <div
                    key={entry.searchId}
                    style={{
                      background: "#0D0D0D",
                      border: "1px solid rgba(255,255,255,0.055)",
                      padding: "14px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "#777", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {entry.businessType} · {entry.city}
                        {entry.localities && <span style={{ color: "#444" }}> · {entry.localities}</span>}
                      </p>
                      <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#333", margin: 0 }}>
                        {entry.leadsFound} lead{entry.leadsFound !== 1 ? "s" : ""}
                        {entry.createdAt && (
                          <span style={{ color: "#252525" }}>
                            {" · "}
                            {new Date(
                              typeof entry.createdAt === "object" && "toDate" in entry.createdAt
                                ? entry.createdAt.toDate()
                                : entry.createdAt
                            ).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </p>
                    </div>
                    {isPaidPlan && entry.leads?.length > 0 && (
                      <button
                        onClick={() => exportHistoryCSV(entry)}
                        style={{
                          flexShrink: 0,
                          background: "none",
                          border: "1px solid rgba(255,255,255,0.08)",
                          padding: "5px 12px",
                          fontFamily: "var(--font-sans)", fontSize: 10,
                          fontWeight: 600, color: "#444",
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 6,
                          transition: "border-color 0.15s ease, color 0.15s ease",
                        }}
                        className="history-dl-btn"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        CSV
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        /* ── Layout ───────────────────────────────────────────────── */
        .db-root {
          min-height: 100vh;
          background: #080808;
          display: flex;
          flex-direction: row;
        }

        /* ── Sidebar ──────────────────────────────────────────────── */
        .sidebar {
          width: 224px;
          flex-shrink: 0;
          border-right: 1px solid rgba(255,255,255,0.05);
          background: rgba(6,6,6,0.97);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* ── Mobile bar ───────────────────────────────────────────── */
        .mobile-bar { display: none; }

        /* ── Main ─────────────────────────────────────────────────── */
        .db-main { flex: 1; position: relative; min-height: 100vh; }
        .radial-glow {
          position: absolute; top: 0; left: 0; right: 0; height: 380px;
          background: radial-gradient(ellipse 70% 55% at 50% 0%, rgba(34,197,94,0.055) 0%, transparent 68%);
          pointer-events: none;
        }
        .main-inner {
          position: relative; z-index: 1;
          max-width: 580px; margin: 0 auto;
          padding: 52px 32px 100px;
        }

        /* ── Search zone ──────────────────────────────────────────── */
        .search-zone {
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 32px 28px 28px;
          transition: box-shadow 0.5s ease;
        }
        .search-scanning { animation: searchGlow 2.5s ease-in-out infinite; }
        @keyframes searchGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(34,197,94,0.07), 0 0 28px rgba(34,197,94,0.04); }
          50%       { box-shadow: 0 0 0 1px rgba(34,197,94,0.28), 0 0 52px rgba(34,197,94,0.09); }
        }

        /* ── Floating labels ──────────────────────────────────────── */
        .field-wrap { position: relative; }
        .field-label {
          position: absolute; top: 13px; left: 15px;
          font-family: var(--font-sans); font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #3A3A3A;
          pointer-events: none;
          transition: top 0.15s ease, font-size 0.15s ease, color 0.15s ease, letter-spacing 0.15s ease;
          z-index: 1;
        }
        .field-input { padding-top: 26px !important; padding-bottom: 8px !important; }
        .field-input:focus ~ .field-label,
        .field-input:not(:placeholder-shown) ~ .field-label {
          top: 5px; font-size: 8px; color: #22C55E; letter-spacing: 0.14em;
        }

        /* ── Ghost cards ──────────────────────────────────────────── */
        .ghost-card { background: #0D0D0D; border: 1px solid rgba(255,255,255,0.04); }
        .ghost-line, .ghost-pill {
          background: linear-gradient(90deg, #111 25%, #191919 50%, #111 75%);
          background-size: 200% 100%;
          animation: shimmer 2.4s ease-in-out infinite; border-radius: 2px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Result cards ─────────────────────────────────────────── */
        .result-card {
          border: 1px solid rgba(255,255,255,0.055); border-left: 2px solid transparent;
          background: #0D0D0D; padding: 16px 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          opacity: 0; animation: fadeUp 0.22s ease forwards;
          transition: border-left-color 0.18s ease, background 0.18s ease;
        }
        .result-card:hover { border-left-color: rgba(34,197,94,0.65); background: #0F0F0F; }
        .lead-name {
          font-family: var(--font-sans); font-size: 12px; font-weight: 500; color: #5A5A5A;
          margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .maps-link {
          display: inline-flex; align-items: center; gap: 4px;
          color: #282828; font-size: 10px; text-decoration: none;
          font-family: var(--font-sans); letter-spacing: 0.03em;
          transition: color 0.15s ease;
        }
        .maps-link:hover { color: #555; }
        .lead-phone {
          font-family: ui-monospace, "SF Mono", monospace;
          font-size: 14px; letter-spacing: 0.04em; color: #EDEDED; white-space: nowrap;
        }
        .call-btn {
          flex-shrink: 0; padding: 6px 14px;
          background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.18);
          color: #22C55E; font-size: 10px; font-weight: 700;
          text-decoration: none; font-family: var(--font-sans);
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .call-btn:hover { background: rgba(34,197,94,0.13); border-color: rgba(34,197,94,0.35); }

        /* ── Animations ───────────────────────────────────────────── */
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        .pulse-dot { animation: pulse 1.4s ease-in-out infinite; }

        /* ── Hover states ─────────────────────────────────────────── */
        .search-action:not(:disabled):hover .arrow-icon { transform: translateX(3px); }
        .arrow-icon { transition: transform 0.18s ease; }
        .upgrade-cta:hover { background: rgba(34,197,94,0.1) !important; }
        .signout-btn:hover { color: #555 !important; }
        .clear-btn:hover { color: #444 !important; }
        .icon-btn:hover { color: #888 !important; }
        .history-dl-btn:hover { color: #888 !important; border-color: rgba(255,255,255,0.18) !important; }

        /* ── Mobile ───────────────────────────────────────────────── */
        @media (max-width: 767px) {
          .db-root { flex-direction: column; }
          .sidebar { display: none; }
          .mobile-bar {
            display: flex; height: 52px; padding: 0 18px;
            align-items: center; justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            background: rgba(6,6,6,0.97);
            position: sticky; top: 0; z-index: 50; flex-shrink: 0;
          }
          .db-main { min-height: auto; }
          .main-inner { padding: 28px 18px 80px; }
          .search-zone { padding: 22px 18px 20px; }
        }
      `}</style>
    </div>
  );
}
