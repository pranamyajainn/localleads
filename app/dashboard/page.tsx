"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useLeadSearch } from "@/hooks/useLeadSearch";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import type { Lead, SearchHistoryEntry } from "@/lib/types";

interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const UPGRADE_PLANS = [
  { id: "starter", name: "Starter", price: "₹499", leads: "500 leads / mo" },
  { id: "growth", name: "Growth", price: "₹999", leads: "2,000 leads / mo", featured: true },
  { id: "pro", name: "Pro", price: "₹2,499", leads: "10,000 leads / mo" },
  { id: "agency", name: "Agency", price: "₹4,999", leads: "50,000 leads / mo" },
];

const NEXT_PLAN: Record<string, string> = {
  free: "starter",
  starter: "growth",
  growth: "pro",
  pro: "agency",
};

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
          Google Maps
        </a>
      </div>
      <div className="lead-actions" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <span className="lead-phone">{lead.phone}</span>
        <a
          href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
          className="call-btn"
        >
          Call Owner
        </a>
      </div>
    </div>
  );
}

const ONBOARDING_STEPS = [
  {
    title: "1. What kind of shop?",
    description: "Start by choosing what kind of shops you want to target. Cafes, gyms, salons, or dentals are great targets because they always need more local customers!",
    visual: (
      <svg width="180" height="110" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="140" rx="16" fill="rgba(255, 230, 93, 0.03)" stroke="rgba(255, 230, 93, 0.15)" strokeWidth="1.5" />
        {/* Mock Search input */}
        <rect x="20" y="50" width="200" height="40" rx="20" fill="#0A0A0C" stroke="var(--color-gold)" strokeWidth="1.5" />
        <text x="36" y="74" fill="#EDEDED" fontFamily="var(--font-sans)" fontSize="12" fontWeight="600">salon</text>
        <circle cx="196" cy="70" r="12" fill="rgba(255, 230, 93, 0.15)" />
        <path d="M193 67l4 4 4-4" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
        {/* Helper labels */}
        <text x="20" y="32" fill="#71717A" fontFamily="var(--font-sans)" fontSize="9" fontWeight="700" letterSpacing="0.1em">STEP 1: ENTER BUSINESS TYPE</text>
      </svg>
    )
  },
  {
    title: "2. Which city & area?",
    description: "Type in the city you want to search (like Mumbai, Delhi, or Pune). You can also add specific areas (like Bandra or Connaught Place) to find shops right around the corner.",
    visual: (
      <svg width="180" height="110" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="140" rx="16" fill="rgba(255, 230, 93, 0.03)" stroke="rgba(255, 230, 93, 0.15)" strokeWidth="1.5" />
        {/* Map pin vector */}
        <circle cx="120" cy="65" r="28" fill="rgba(75, 92, 209, 0.15)" stroke="rgba(75, 92, 209, 0.3)" strokeWidth="1.5" />
        <path d="M120 45c-8.3 0-15 6.7-15 15 0 9 15 25 15 25s15-16 15-25c0-8.3-6.7-15-15-15zm0 20c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" fill="var(--color-gold)" />
        <text x="20" y="32" fill="#71717A" fontFamily="var(--font-sans)" fontSize="9" fontWeight="700" letterSpacing="0.1em">STEP 2: TARGET A LOCATION</text>
        <text x="120" y="115" textAnchor="middle" fill="#EDEDED" fontFamily="var(--font-sans)" fontSize="11" fontWeight="600">Mumbai, Maharashtra</text>
      </svg>
    )
  },
  {
    title: "3. Scan Google Maps!",
    description: "Set how many shop phone numbers you want, then click the gold search button. Our system will extract real-time details and filter out shops that do not have a website.",
    visual: (
      <svg width="180" height="110" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="140" rx="16" fill="rgba(255, 230, 93, 0.03)" stroke="rgba(255, 230, 93, 0.15)" strokeWidth="1.5" />
        {/* Radar/Radar Scan Visual */}
        <circle cx="120" cy="70" r="35" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="120" cy="70" r="20" fill="none" stroke="rgba(255,230,93,0.4)" strokeWidth="1.5" />
        <circle cx="120" cy="70" r="5" fill="var(--color-gold)" />
        <line x1="120" y1="35" x2="120" y2="105" stroke="rgba(255,230,93,0.2)" strokeWidth="1" />
        <line x1="85" y1="70" x2="155" y2="70" stroke="rgba(255,230,93,0.2)" strokeWidth="1" />
        <text x="20" y="32" fill="#71717A" fontFamily="var(--font-sans)" fontSize="9" fontWeight="700" letterSpacing="0.1em">STEP 3: RUN REAL-TIME MAPS SCAN</text>
      </svg>
    )
  },
  {
    title: "4. Save to Excel & Call!",
    description: "Export the list to Excel with a single click. Call the shop owners and offer them a simple website starting at ₹10,000 to double their customers. It's that easy!",
    visual: (
      <svg width="180" height="110" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="140" rx="16" fill="rgba(255, 230, 93, 0.03)" stroke="rgba(255, 230, 93, 0.15)" strokeWidth="1.5" />
        {/* Excel Card visual */}
        <rect x="80" y="45" width="80" height="50" rx="8" fill="#0A0A0C" stroke="var(--color-gold)" strokeWidth="1.5" />
        <rect x="92" y="57" width="56" height="6" rx="3" fill="var(--color-gold)" opacity="0.8" />
        <rect x="92" y="69" width="40" height="6" rx="3" fill="#A0A0AB" opacity="0.6" />
        <rect x="92" y="81" width="48" height="6" rx="3" fill="#A0A0AB" opacity="0.6" />
        <text x="20" y="32" fill="#71717A" fontFamily="var(--font-sans)" fontSize="9" fontWeight="700" letterSpacing="0.1em">STEP 4: SAVE EXCEL & GET CLIENTS</text>
      </svg>
    )
  }
];

function OnboardingCarousel({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const activeStep = ONBOARDING_STEPS[step];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6, 6, 8, 0.82)",
        backdropFilter: "blur(18px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        animation: "fadeUp 0.3s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 480,
        padding: "48px 36px 36px",
        background: "rgba(12, 12, 14, 0.98)",
        border: "1px solid rgba(255, 230, 93, 0.14)",
        borderRadius: 28,
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>

        {/* Red close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#E53935",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1,
            transition: "background 0.15s ease",
            boxShadow: "0 2px 8px rgba(229, 57, 53, 0.4)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#C62828"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#E53935"; }}
        >
          ✕
        </button>

        {/* Step label */}
        <div style={{ position: "absolute", top: 18, left: 20 }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: 9,
            fontWeight: 700,
            color: "var(--color-gold)",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}>
            Quick Guide ({step + 1}/{ONBOARDING_STEPS.length})
          </span>
        </div>

        {/* Visual */}
        <div style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          animation: "fadeUp 0.4s ease"
        }} key={step}>
          {activeStep.visual}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: 20,
          fontWeight: 600,
          color: "#EDEDED",
          margin: "0 0 10px",
          letterSpacing: "-0.01em",
          textAlign: "center"
        }}>
          {activeStep.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "#A0A0AB",
          maxWidth: 420,
          margin: "0 0 28px",
          lineHeight: 1.6,
          textAlign: "center",
          minHeight: 64
        }}>
          {activeStep.description}
        </p>

        {/* Navigation */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 16
        }}>
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{
              background: "none",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: step === 0 ? "#333" : "#888",
              borderRadius: 30,
              padding: "8px 16px",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              cursor: step === 0 ? "not-allowed" : "pointer",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={(e) => {
              if (step > 0) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            Back
          </button>

          <div style={{ display: "flex", gap: 6 }}>
            {ONBOARDING_STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: i === step ? 16 : 6,
                  height: 6,
                  borderRadius: 99,
                  background: i === step ? "var(--color-gold)" : "rgba(255, 255, 255, 0.15)",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              />
            ))}
          </div>

          {step < ONBOARDING_STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              style={{
                background: "rgba(255, 230, 93, 0.08)",
                border: "1px solid rgba(255, 230, 93, 0.18)",
                color: "var(--color-gold)",
                borderRadius: 30,
                padding: "8px 16px",
                fontSize: 11,
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 230, 93, 0.15)";
                e.currentTarget.style.borderColor = "var(--color-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 230, 93, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 230, 93, 0.18)";
              }}
            >
              Next ➜
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                const input = document.querySelector('input[placeholder=" "]') as HTMLInputElement;
                if (input) input.focus();
              }}
              style={{
                background: "var(--color-gold)",
                border: "none",
                color: "#000",
                borderRadius: 30,
                padding: "8px 16px",
                fontSize: 11,
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 0 10px rgba(255, 230, 93, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-gold-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-gold)";
              }}
            >
              Find Clients!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GhostCards() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, opacity: 0.7 }}>
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
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "#A0A0AB",
        textAlign: "center", marginTop: 18, letterSpacing: "0.02em",
      }}>
        Searching Google Maps in real-time. Please wait...
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
  const searchParams = useSearchParams();
  const paymentPending = searchParams.get("payment") === "pending";
  const { user, userDoc, loading, refreshUserDoc } = useAuth();
  const {
    status, results, isSearching, phoneCount, error,
    performSearch, stopSearch, clearResults, exportCSV,
  } = useLeadSearch();
  const { handleSelectPlan, paying, payError } = useRazorpayCheckout(user, router);

  const [bType, setBType] = useState("");
  const [city, setCity] = useState("");
  const [localities, setLocalities] = useState("");
  const [maxLeadsStr, setMaxLeadsStr] = useState("50");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("ll_guide_dismissed", "1");
  };
  const maxLeadsInitialized = useRef(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiParticlesRef = useRef<ConfettiParticle[]>([]);
  const confettiLoopRef = useRef<number | null>(null);

  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const colors = ["#ffe65d", "#fff094", "#4B5CD1", "#6A7BFF", "#EB8251", "#FFA478", "#FFFFFF"];

    // Left corner burst
    for (let i = 0; i < 60; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 14 + Math.random() * 18;
      confettiParticlesRef.current.push({
        x: 0,
        y: canvas.height,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      });
    }

    // Right corner burst
    for (let i = 0; i < 60; i++) {
      const angle = -3 * Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 14 + Math.random() * 18;
      confettiParticlesRef.current.push({
        x: canvas.width,
        y: canvas.height,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
      });
    }

    if (!confettiLoopRef.current) {
      const updateConfetti = () => {
        const activeCanvas = canvasRef.current;
        if (!activeCanvas) {
          confettiLoopRef.current = null;
          return;
        }
        const activeCtx = activeCanvas.getContext("2d");
        if (!activeCtx) {
          confettiLoopRef.current = null;
          return;
        }

        activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

        let hasParticles = false;
        const particles = confettiParticlesRef.current;

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.speedX;
          p.y += p.speedY;
          p.speedY += 0.4; // gravity
          p.speedX *= 0.98; // drag
          p.rotation += p.rotationSpeed;

          if (p.y > activeCanvas.height - 80 || p.x < 0 || p.x > activeCanvas.width) {
            p.opacity -= 0.02;
          }

          if (p.opacity <= 0) {
            particles.splice(i, 1);
          } else {
            hasParticles = true;
            activeCtx.save();
            activeCtx.translate(p.x, p.y);
            activeCtx.rotate((p.rotation * Math.PI) / 180);
            activeCtx.globalAlpha = p.opacity;
            activeCtx.fillStyle = p.color;
            activeCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            activeCtx.restore();
          }
        }

        if (hasParticles) {
          confettiLoopRef.current = requestAnimationFrame(updateConfetti);
        } else {
          activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
          confettiLoopRef.current = null;
        }
      };
      confettiLoopRef.current = requestAnimationFrame(updateConfetti);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("ll_guide_dismissed")) {
      setShowGuide(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (confettiLoopRef.current) {
        cancelAnimationFrame(confettiLoopRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

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

  useEffect(() => {
    if (!isSearching && results.length > 0 && user) {
      triggerConfetti();
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

  const leadsUsed = userDoc ? (userDoc.leadsUsed ?? 0) : 0;
  const leadsLimit = userDoc ? (userDoc.leadsLimit ?? 20) : 20;
  const leadsLeft = Math.max(0, leadsLimit - leadsUsed);

  useEffect(() => {
    if (!maxLeadsInitialized.current && leadsLeft > 0) {
      maxLeadsInitialized.current = true;
      setMaxLeadsStr(String(Math.min(50, leadsLeft)));
    }
  }, [leadsLeft]);

  const [cancelling, setCancelling] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [hideWall, setHideWall] = useState(false);

  const handleSignOut = async () => {
    await signOut(firebaseAuth());
    router.replace("/");
  };

  const handleCancelPlan = async () => {
    if (!user || cancelling) return;
    if (!confirm("Stop your subscription? You can still use it until the end of the month.")) return;
    setCancelling(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/razorpay/cancel-subscription", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) refreshUserDoc();
    } catch {
      // silent
    } finally {
      setCancelling(false);
    }
  };

  const usedPct = leadsLimit > 0 ? Math.min(100, Math.round((leadsUsed / leadsLimit) * 100)) : 100;
  const leadsPct = leadsLimit > 0 ? Math.round((leadsLeft / leadsLimit) * 100) : 0;

  const expiry = userDoc?.planExpiresAt;
  const daysRemaining = expiry && typeof expiry.toDate === "function"
    ? Math.max(0, Math.ceil((expiry.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const rawMaxLeads = parseInt(maxLeadsStr, 10) || 0;
  const maxLeads = rawMaxLeads > 0 ? Math.min(rawMaxLeads, leadsLeft) : 0;

  const hitLimit = !loading && userDoc !== null && leadsLeft === 0;
  const canSearch = leadsLeft > 0 && !isSearching && maxLeads > 0;
  const isPaidPlan = userDoc?.plan !== "free" && userDoc?.plan !== undefined;
  const planLabel = userDoc?.plan
    ? userDoc.plan.charAt(0).toUpperCase() + userDoc.plan.slice(1)
    : "Free";

  const nextPlan = userDoc?.plan ? NEXT_PLAN[userDoc.plan] : "starter";
  const nextPlanData = nextPlan ? UPGRADE_PLANS.find((p) => p.id === nextPlan) : undefined;

  const handleSearch = () => performSearch(bType, city, localities, maxLeads);
  const hasResults = results.length > 0;
  const creditsBarColor = leadsLeft > leadsLimit * 0.2 ? "#ffe65d" : leadsLeft > 0 ? "#F59E0B" : "#EF4444";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
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
    <div className="db-root">
      {/* Confetti Celebration Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* Quick Guide popup — shown on first visit, dismissed via localStorage */}
      {showGuide && <OnboardingCarousel onClose={handleCloseGuide} />}

      {/* Full-Screen Credit Limit Blocker Overlay */}
      {hitLimit && !hideWall && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6, 6, 8, 0.98)",
          backdropFilter: "blur(25px)",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          overflowY: "auto",
        }}>
          <button
            onClick={() => setHideWall(true)}
            style={{
              position: "absolute",
              top: 16, right: 16,
              background: "transparent",
              border: "none",
              color: "#444",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
              padding: 4,
            }}
            aria-label="Close"
          >
            ×
          </button>
          <div style={{
            maxWidth: 680,
            width: "100%",
            textAlign: "center",
            animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            {/* Gold Crown/Premium Icon */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255, 230, 93, 0.1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-gold)",
              marginBottom: 20,
              boxShadow: "0 0 30px rgba(255, 230, 93, 0.2)",
              border: "1px solid rgba(255, 230, 93, 0.3)"
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#EDEDED",
              margin: "0 0 12px"
            }}>
              Monthly Search Limit Reached!
            </h1>
            
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "#A0A0AB",
              maxWidth: 480,
              margin: "0 auto 36px",
              lineHeight: 1.6
            }}>
              {userDoc?.plan === "free"
                ? "Your free trial limit has been reached. Upgrade to one of our premium plans to unlock unlimited search tools and export capabilities."
                : "You have used all the credits allowed for your plan this month. Upgrade to the next tier to find more clients instantly!"}
            </p>

            {/* Pricing Grid */}
            <div className="wall-grid" style={{ marginBottom: 20 }}>
              {UPGRADE_PLANS.map((p) => (
                <div
                  key={p.id}
                  className={p.featured ? "wall-card wall-card-featured" : "wall-card"}
                  style={{
                    background: "#0A0A0C",
                    border: p.featured ? "2px solid var(--color-gold)" : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 24,
                    padding: "24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                  }}
                >
                  {p.featured && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      background: "var(--color-gold)", padding: "4px 0", textAlign: "center",
                      fontFamily: "var(--font-sans)", fontSize: 8, fontWeight: 800,
                      letterSpacing: "0.14em", color: "#0A0A0B", textTransform: "uppercase",
                      borderRadius: "22px 22px 0 0",
                    }}>
                      Recommended
                    </div>
                  )}
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: p.featured ? "var(--color-gold)" : "#71717A",
                    margin: p.featured ? "16px 0 6px" : "0 0 6px",
                  }}>
                    {p.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 400,
                    color: "#EDEDED",
                    margin: "0 0 4px", lineHeight: 1,
                  }}>
                    {p.price}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#888", margin: "0 0 18px" }}>
                    {p.leads}
                  </p>
                  <button
                    onClick={() => handleSelectPlan(p.id)}
                    disabled={paying === p.id || !!paying}
                    style={{
                      background: "var(--color-gold)",
                      color: "#000000",
                      fontWeight: 700,
                      borderRadius: 30,
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: 13,
                      border: "none",
                      cursor: (paying === p.id || !!paying) ? "not-allowed" : "pointer",
                      opacity: (paying === p.id || !!paying) ? 0.7 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {paying === p.id && (
                      <span className="premium-dot-loader" style={{ marginRight: 6 }}>
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                    Upgrade Pack
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleSignOut}
              style={{
                background: "none",
                border: "none",
                color: "#71717A",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
                margin: "20px 0"
              }}
            >
              Sign out to use another account
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <div className="mobile-bar">
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
          Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 10px",
          borderRadius: "20px",
          border: `1px solid ${leadsLeft > 0 ? "rgba(255,230,93,0.2)" : "rgba(239,68,68,0.2)"}`,
          background: leadsLeft > 0 ? "rgba(255,230,93,0.04)" : "rgba(239,68,68,0.04)",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: leadsLeft > 0 ? "var(--color-gold)" : "#EF4444", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: leadsLeft > 0 ? "var(--color-gold)" : "#EF4444", letterSpacing: "0.02em" }}>
            {leadsLeft} left
          </span>
        </div>
        {nextPlanData && (
          <button
            onClick={() => handleSelectPlan(nextPlan!)}
            disabled={!!paying}
            style={{
              background: "rgba(255,230,93,0.06)",
              border: "1px solid rgba(255,230,93,0.15)",
              color: "var(--color-gold)",
              borderRadius: 30,
              padding: "4px 12px",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              cursor: paying ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            ↑ {nextPlanData.name} {nextPlanData.price}
          </button>
        )}
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
              Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
            </span>
          </Link>

          {/* Plan label */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isPaidPlan ? "var(--color-gold)" : "#71717A"} strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: isPaidPlan ? "var(--color-gold)" : "#71717A",
            }}>
              {planLabel} plan
            </span>
          </div>

          {/* Leads used */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#A0A0AB" }}>
                Shops found this month
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: leadsLeft > 0 ? "#EDEDED" : "#EF4444" }}>
                {leadsUsed}<span style={{ color: "#555", fontWeight: 400 }}>/{leadsLimit}</span>
              </span>
            </div>
            <div style={{ height: 10, background: "rgba(255,255,255,0.03)", borderRadius: 999, overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }}>
              <div style={{
                height: "100%",
                width: `${usedPct}%`,
                background: creditsBarColor,
                borderRadius: 999,
                transition: "width 0.55s ease",
                boxShadow: creditsBarColor === "#ffe65d" ? "0 0 10px rgba(255, 230, 93, 0.5)" : creditsBarColor === "#F59E0B" ? "0 0 10px rgba(245, 158, 11, 0.5)" : "0 0 10px rgba(239, 68, 68, 0.5)",
              }} />
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "#888", margin: "8px 0 0", lineHeight: 1.5 }}>
              You can find {leadsLeft} more shops
              {daysRemaining !== null && (
                <span> · {daysRemaining} days left</span>
              )}
            </p>
          </div>

          {/* Upgrade CTA — hidden for Agency */}
          {nextPlanData && (
            <button
              onClick={() => setPendingPlan(nextPlan ?? "starter")}
              disabled={!!paying}
              className="premium-gradient-btn"
            >
              {isPaidPlan ? "Change plan" : "Upgrade plan"}
            </button>
          )}

          {/* Cancel plan */}
          {isPaidPlan && userDoc?.subscriptionStatus === "active" && (
            <button
              onClick={handleCancelPlan}
              disabled={cancelling}
              style={{
                background: "none", border: "none", padding: "12px 0 0",
                fontFamily: "var(--font-sans)", fontSize: 9,
                color: "#71717A", cursor: cancelling ? "not-allowed" : "pointer",
                textAlign: "left", letterSpacing: "0.08em", textTransform: "uppercase",
                opacity: cancelling ? 0.5 : 1,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
            >
              {cancelling ? "Stopping…" : "Stop subscription"}
            </button>
          )}
          {isPaidPlan && userDoc?.subscriptionStatus === "cancelling" && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, color: "#F59E0B", margin: "12px 0 0", letterSpacing: "0.05em" }}>
              Stops at the end of the month
            </p>
          )}
          {isPaidPlan && userDoc?.subscriptionStatus === "halted" && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 9, color: "#EF4444", margin: "12px 0 0", letterSpacing: "0.05em" }}>
              Payment failed — please update details
            </p>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,230,93,0.06)", margin: "28px 0" }} />

          {/* Account */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#71717A" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 9, color: "#71717A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Account
              </span>
            </div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 11, color: "#E4E4E7",
              margin: "2px 0 16px",
              paddingLeft: 18,
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
                color: "#71717A", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7,
                letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#EDEDED")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#71717A")}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>

          <div style={{ flex: 1 }} />

          <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "#555", margin: 0, lineHeight: 1.7 }}>
            Questions?{" "}
            <a href="mailto:contact@sahajta.com" style={{ color: "var(--color-gold)", textDecoration: "none", transition: "color 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#fff094")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-gold)")}>
              contact@sahajta.com
            </a>
          </p>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="db-main">
        <div className="radial-glow" />

        <div className="main-inner">

          {/* Dashboard Header Bar */}
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            gap: 16,
            flexWrap: "wrap"
          }}>
            <div>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                fontWeight: 700,
                color: "#71717A",
                letterSpacing: "0.14em",
                textTransform: "uppercase"
              }}>
                Workspace Dashboard
              </span>
            </div>
            
            {/* Upgrade CTA Pill */}
            {nextPlanData ? (
              <button
                onClick={() => handleSelectPlan(nextPlan!)}
                disabled={!!paying}
                style={{
                  background: "linear-gradient(135deg, rgba(255, 230, 93, 0.1), rgba(235, 130, 81, 0.1))",
                  border: "1px solid rgba(255, 230, 93, 0.3)",
                  color: "var(--color-gold)",
                  borderRadius: 30,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  cursor: paying ? "not-allowed" : "pointer",
                  letterSpacing: "0.05em",
                  boxShadow: "0 4px 12px rgba(255, 230, 93, 0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 230, 93, 0.2)";
                  e.currentTarget.style.borderColor = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 230, 93, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 230, 93, 0.3)";
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>UPGRADE TO {nextPlanData.name.toUpperCase()} NOW ➜</span>
              </button>
            ) : (
              <div style={{
                background: "rgba(255, 230, 93, 0.05)",
                border: "1px solid rgba(255, 230, 93, 0.15)",
                borderRadius: 30,
                padding: "8px 16px",
                fontSize: 11,
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                color: "var(--color-gold)",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-gold)" }} />
                <span>AGENCY PLAN ACTIVE ✨</span>
              </div>
            )}
          </header>

          {/* Bento Column Layout Wrapper */}
          <div className="search-grid-layout">

            {/* Left Column: Form & Results */}
            <div className="search-grid-main">

              {/* ── Usage progress bar ────────────────────────────────── */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: leadsLeft === 0 ? "#EF4444" : "#A0A0AB" }}>
                    You used {leadsUsed} of {leadsLimit} shops{isPaidPlan ? " this month" : ""}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#71717A" }}>
                    {planLabel} plan{daysRemaining !== null ? ` · ${daysRemaining} days left` : ""}
                  </span>
                </div>
                <div style={{ height: 10, background: "rgba(255,255,255,0.03)", borderRadius: 999, overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }}>
                  <div style={{
                    height: "100%",
                    width: `${usedPct}%`,
                    background: creditsBarColor,
                    borderRadius: 999,
                    transition: "width 0.55s ease",
                    boxShadow: creditsBarColor === "#ffe65d" ? "0 0 10px rgba(255, 230, 93, 0.5)" : creditsBarColor === "#F59E0B" ? "0 0 10px rgba(245, 158, 11, 0.5)" : "0 0 10px rgba(239, 68, 68, 0.5)",
                  }} />
                </div>
              </div>

              {/* ── UPI payment pending banner ─────────────────────────── */}
              {paymentPending && userDoc?.plan === "free" && (
                <div style={{
                  background: "rgba(234,179,8,0.08)",
                  border: "1px solid rgba(234,179,8,0.35)",
                  borderRadius: 8,
                  padding: "14px 20px",
                  margin: "0 0 16px",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  color: "#FBBF24",
                  lineHeight: 1.5,
                }}>
                  Payment received — your plan upgrade is being confirmed. This usually takes under a minute. Please refresh the page in a moment.
                  {" "}
                  <a href="mailto:hello@sahajta.com" style={{ color: "#FBBF24", fontWeight: 700 }}>
                    Contact us if it doesn't update.
                  </a>
                </div>
              )}

              {/* ── Payment error ──────────────────────────────────────── */}
              {payError && (
                <div style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 8,
                  padding: "14px 20px",
                  margin: "0 0 16px",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14, color: "#EF4444",
                  lineHeight: 1.5,
                }}>
                  {payError}
                  {" "}
                  <a
                    href="mailto:hello@sahajta.com"
                    style={{ color: "#EF4444", fontWeight: 700 }}
                  >
                    Email us to resolve this.
                  </a>
                </div>
              )}

              {/* ── Free plan persistent banner ────────────────────────── */}
              {userDoc?.plan === "free" && (
                <div style={{
                  background: "rgba(255,230,93,0.08)",
                  border: "1px solid rgba(255,230,93,0.2)",
                  borderRadius: 24,
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  gap: 12,
                  flexWrap: "wrap",
                }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--color-gold)" }}>
                    Free plan · you can find {leadsLimit} shops total
                  </span>
                  <button
                    onClick={() => handleSelectPlan("starter")}
                    disabled={!!paying}
                    style={{
                      background: "var(--color-gold)",
                      color: "#000",
                      fontWeight: 700,
                      borderRadius: 30,
                      padding: "8px 14px",
                      fontSize: 13,
                      border: "none",
                      cursor: paying ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-sans)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {paying === "starter" && (
                      <span className="premium-dot-loader" style={{ marginRight: 6 }}>
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                    Upgrade to find more! →
                  </button>
                </div>
              )}




                <div className={`search-zone${isSearching ? " search-scanning" : ""}`}>

                  <div style={{ marginBottom: 28 }}>
                    <h1 style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(26px, 3.5vw, 34px)",
                      fontWeight: 700, lineHeight: 1.05,
                      letterSpacing: "-0.03em", color: "#EDEDED",
                      margin: "0 0 7px",
                    }}>
                      Find local shops with no website!
                    </h1>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#A0A0AB", margin: 0, lineHeight: 1.5 }}>
                      {isSearching
                        ? `Looking on Google Maps — found ${phoneCount} shops with no website`
                        : "Type in what kind of shop and city to start."}
                    </p>
                  </div>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 26 }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="premium-input-wrap">
                      <input
                        type="text"
                        value={bType}
                        onChange={(e) => setBType(e.target.value)}
                        placeholder=" "
                        disabled={isSearching}
                        className="field-input-premium"
                        style={{ opacity: isSearching ? 0.45 : 1 }}
                      />
                      <svg className="premium-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <label className="field-label-premium">What kind of shop? (like salon or cafe)</label>
                    </div>
                    
                    <div className="premium-input-wrap">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && canSearch && bType && city) handleSearch();
                        }}
                        placeholder=" "
                        disabled={isSearching}
                        className="field-input-premium"
                        style={{ opacity: isSearching ? 0.45 : 1 }}
                      />
                      <svg className="premium-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <label className="field-label-premium">Which city? (like Mumbai)</label>
                    </div>
                    
                    <div className="premium-input-wrap">
                      <textarea
                        value={localities}
                        onChange={(e) => setLocalities(e.target.value)}
                        placeholder=" "
                        disabled={isSearching}
                        className="field-input-premium"
                        style={{ resize: "none", minHeight: 82, opacity: isSearching ? 0.45 : 1, paddingTop: 26 }}
                      />
                      <svg className="premium-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ top: 22, transform: "none" }}>
                        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                        <line x1="8" y1="2" x2="8" y2="18" />
                        <line x1="16" y1="6" x2="16" y2="22" />
                      </svg>
                      <label className="field-label-premium" style={{ top: 16 }}>
                        Area in the city <span style={{ textTransform: "none", letterSpacing: 0, color: "#71717A" }}>(optional)</span>
                      </label>
                    </div>
                    
                    <div className="premium-input-wrap">
                      <input
                        type="number"
                        value={maxLeadsStr}
                        onChange={(e) => setMaxLeadsStr(e.target.value)}
                        min={1}
                        max={leadsLeft}
                        placeholder=" "
                        disabled={isSearching}
                        className="field-input-premium"
                        style={{ opacity: isSearching ? 0.45 : 1 }}
                      />
                      <svg className="premium-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="9" y1="6" x2="20" y2="6" />
                        <line x1="9" y1="12" x2="20" y2="12" />
                        <line x1="9" y1="18" x2="20" y2="18" />
                        <circle cx="4" cy="6" r="1.5" />
                        <circle cx="4" cy="12" r="1.5" />
                        <circle cx="4" cy="18" r="1.5" />
                      </svg>
                      <label className="field-label-premium">
                        How many shop phone numbers do you want? <span style={{ textTransform: "none", letterSpacing: 0, color: "#71717A" }}>(max {leadsLeft})</span>
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div style={{
                      marginTop: 16, padding: "11px 14px",
                      border: "1px solid rgba(239,68,68,0.28)",
                      background: "rgba(239,68,68,0.05)",
                      borderRadius: 24,
                      fontFamily: "var(--font-sans)", fontSize: 12, color: "#F87171", lineHeight: 1.55,
                    }}>
                      {error}
                      {error.toLowerCase().includes("limit") && (
                        <>{" "}<button
                          onClick={() => handleSelectPlan(nextPlan || "starter")}
                          style={{ background: "none", border: "none", textDecoration: "underline", color: "var(--color-gold)", cursor: "pointer", padding: 0, font: "inherit", fontSize: "inherit" }}
                        >Upgrade now</button></>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: 20 }}>
                    {isSearching ? (
                      <button
                        onClick={stopSearch}
                        style={{
                          width: "100%", padding: "14px 0",
                          border: "1px solid rgba(239,68,68,0.28)",
                          borderRadius: 30,
                          background: "transparent", color: "#F87171",
                          fontFamily: "var(--font-sans)", fontSize: 12,
                          fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                          cursor: "pointer",
                        }}
                      >
                        Stop Search
                      </button>
                    ) : canSearch ? (
                      <button
                        onClick={handleSearch}
                        disabled={!bType || !city || maxLeads === 0}
                        className="btn-gold search-action"
                        style={{
                          width: "100%",
                          opacity: (!bType || !city || maxLeads === 0) ? 0.3 : 1,
                          cursor: (!bType || !city || maxLeads === 0) ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                      >
                        FIND CLIENTS NOW ➜
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(nextPlan || "starter")}
                        disabled={!!paying}
                        className="btn-gold"
                        style={{
                          width: "100%", textAlign: "center", display: "block",
                          cursor: paying ? "not-allowed" : "pointer",
                          opacity: paying ? 0.7 : 1,
                        }}
                      >
                        {paying ? "Processing…" : "Upgrade to Continue"}
                      </button>
                    )}
                  </div>

                  {(isSearching || (status !== "Ready" && status !== "Results cleared.")) && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                      {isSearching && (
                        <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-gold)", display: "inline-block", flexShrink: 0 }} />
                      )}
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#A0A0AB", lineHeight: 1.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {status}
                      </span>
                    </div>
                  )}
                </div>

              {/* Ghost cards skeleton loader only when actively searching */}
              {!hitLimit && !hasResults && isSearching && <GhostCards />}

              {/* Results */}
              {hasResults && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 700, color: "var(--color-gold)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {phoneCount}
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#A0A0AB" }}>
                      shops with no website
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
                      className="export-csv-btn"
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: "var(--color-gold)", color: "#000000", fontWeight: 700,
                        borderRadius: 30, border: "none", padding: "14px 0",
                        fontFamily: "var(--font-sans)", fontSize: 13,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Save list to Excel — {phoneCount} shops
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(nextPlan || "starter")}
                      disabled={!!paying}
                      className="locked-csv-btn"
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        background: "rgba(255,230,93,0.08)",
                        border: "1px solid rgba(255,230,93,0.2)",
                        color: "var(--color-gold)",
                        borderRadius: 30, fontWeight: 600,
                        padding: "14px 0",
                        fontFamily: "var(--font-sans)", fontSize: 13,
                        letterSpacing: "0.05em", textTransform: "uppercase",
                        cursor: paying ? "not-allowed" : "pointer",
                        opacity: paying ? 0.7 : 1,
                      }}
                      title="Upgrade to save"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Save list to Excel — upgrade to unlock
                    </button>
                  )}
                  <button
                    onClick={clearResults}
                    className="clear-btn"
                    style={{
                      width: "100%", padding: "10px 0",
                      border: "none", background: "transparent",
                      color: "#555", fontFamily: "var(--font-sans)", fontSize: 11,
                      fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Clear list
                  </button>
                </div>
              )}

              {/* ── Past Searches (collapsible) ─────────────────────── */}
              {searchHistory.length > 0 && (
                <div style={{ marginTop: 48 }}>
                  <button
                    onClick={() => setHistoryOpen((o) => !o)}
                    style={{
                      width: "100%", background: "none", border: "none", padding: 0,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
                    }}
                  >
                    <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#666", flexShrink: 0 }}>
                      Saved Searches
                      <svg
                        width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"
                        style={{ transition: "transform 0.2s ease", transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                    <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
                  </button>

                  {historyOpen && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {searchHistory.map((entry) => (
                        <div
                          key={entry.searchId}
                          style={{
                            background: "#0D0D0D",
                            border: "1px solid rgba(255,255,255,0.055)",
                            borderRadius: 24,
                            padding: "14px 18px",
                            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "#EDEDED", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {entry.businessType} · {entry.city}
                              {entry.localities && <span style={{ color: "#444" }}> · {entry.localities}</span>}
                            </p>
                            <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#666", margin: 0 }}>
                              {entry.leadsFound} shop{entry.leadsFound !== 1 ? "s" : ""} found
                              {entry.createdAt && (
                                <span style={{ color: "#444" }}>
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
                                borderRadius: 30,
                                padding: "5px 12px",
                                fontFamily: "var(--font-sans)", fontSize: 10,
                                fontWeight: 600, color: "#888",
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
                              Excel/CSV
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Visual Helper Block */}
            <div className="search-grid-visual">
              <div style={{
                background: "var(--color-blue)",
                borderRadius: 24,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFFFFF",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.74h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Quick Script
                  </span>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.25 }}>
                  What to say to shop owners:
                </h3>
                
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  background: "#0A0A0C",
                  padding: "20px 22px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,230,93,0.15)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)"
                }}>
                  <p style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
                    "Hello! I saw your shop on <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>Google Maps</span>. I noticed you <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>do not have a website</span> listed."
                  </p>
                  <p style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
                    "I build simple websites for local shops starting at <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>₹10,000</span>. Would you like me to make one for you?"
                  </p>
                </div>

                <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <img
                    src="/outreach-feature.png"
                    alt="Outreach Scan Visual"
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <style>{`
        /* ── Layout ───────────────────────────────────────────────── */
        .db-root {
          min-height: 100vh;
          background: #0A0A0B;
          display: flex;
          flex-direction: row;
        }

        /* ── Sidebar ──────────────────────────────────────────────── */
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          border-right: 1px solid rgba(255, 230, 93, 0.08);
          background: rgba(10, 10, 12, 0.95);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }

        /* ── Premium Gradient Button ──────────────────────────────── */
        .premium-gradient-btn {
          display: block;
          margin-top: 16px;
          padding: 10px 14px;
          background: linear-gradient(#0A0A0C, #0A0A0C) padding-box, linear-gradient(135deg, var(--color-gold), var(--color-coral)) border-box;
          border: 1px solid transparent;
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 700;
          color: var(--color-gold);
          text-align: center;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          width: 100%;
          border-radius: 30px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .premium-gradient-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 230, 93, 0.15);
        }
        .premium-gradient-btn:active {
          transform: translateY(0);
        }
        .premium-gradient-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* ── Premium Form Inputs ──────────────────────────────────── */
        .premium-input-wrap {
          position: relative;
          margin-bottom: 4px;
        }
        .premium-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #55555e;
          transition: color 0.15s ease;
          pointer-events: none;
          z-index: 2;
        }
        .field-input-premium {
          padding-left: 44px !important;
          padding-top: 26px !important;
          padding-bottom: 8px !important;
          background: #0A0A0C !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 20px !important;
          color: #EDEDED !important;
          font-family: var(--font-sans);
          font-size: 13px !important;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          width: 100%;
        }
        .field-input-premium:focus {
          border-color: var(--color-gold) !important;
          box-shadow: 0 0 12px rgba(255, 230, 93, 0.1) !important;
          background: #0D0D10 !important;
        }
        .field-input-premium:focus ~ .premium-input-icon {
          color: var(--color-gold);
        }
        .field-label-premium {
          position: absolute;
          top: 17px;
          left: 44px;
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #55555e;
          pointer-events: none;
          transition: top 0.15s ease, font-size 0.15s ease, color 0.15s ease, letter-spacing 0.15s ease, left 0.15s ease;
          z-index: 1;
        }
        .field-input-premium:focus ~ .field-label-premium,
        .field-input-premium:not(:placeholder-shown) ~ .field-label-premium {
          top: 6px;
          left: 16px;
          font-size: 8px;
          color: var(--color-gold);
          letter-spacing: 0.14em;
        }

        /* ── Mobile bar ───────────────────────────────────────────── */
        .mobile-bar { display: none; }

        /* ── Main ─────────────────────────────────────────────────── */
        .db-main { flex: 1; position: relative; min-height: 100vh; }
        .radial-glow {
          position: absolute; top: 0; left: 0; right: 0; height: 380px;
          background: radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,230,93,0.055) 0%, transparent 68%);
          pointer-events: none;
        }
        .main-inner {
          position: relative; z-index: 1;
          max-width: 1024px; margin: 0 auto;
          padding: 52px 32px 100px;
        }

        /* ── Bento Grid Layout ────────────────────────────────────── */
        .search-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (min-width: 900px) {
          .search-grid-layout {
            grid-template-columns: 1.2fr 1.1fr;
          }
          .search-grid-visual {
            display: block;
            position: sticky;
            top: 100px;
          }
        }

        @media (max-width: 899px) {
          .search-grid-visual {
            display: none;
          }
        }

        /* ── Upgrade wall ─────────────────────────────────────────── */
        .wall-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .wall-card {
          position: relative;
          background: #0D0D0D;
          padding: 18px 16px 16px;
          display: flex; flex-direction: column;
          transition: background 0.15s ease;
          cursor: default;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .wall-card:hover { background: #111; }
        .wall-card-featured {
          background: rgba(255,230,93,0.04);
          border: 2px solid var(--color-gold);
          border-radius: 24px;
        }
        .wall-card-featured:hover { background: rgba(255,230,93,0.07); }

        /* ── Search zone ──────────────────────────────────────────── */
        .search-zone {
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 32px 28px 28px;
          border-radius: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          transition: box-shadow 0.5s ease;
        }
        .search-scanning { animation: searchGlow 2.5s ease-in-out infinite; }
        @keyframes searchGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(255,230,93,0.07), 0 0 28px rgba(255,230,93,0.04); }
          50%       { box-shadow: 0 0 0 1px rgba(255,230,93,0.28), 0 0 52px rgba(255,230,93,0.09); }
        }

        /* ── Floating labels ──────────────────────────────────────── */
        .field-wrap { position: relative; }
        .field-label {
          position: absolute; top: 13px; left: 15px;
          font-family: var(--font-sans); font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: #71717A;
          pointer-events: none;
          transition: top 0.15s ease, font-size 0.15s ease, color 0.15s ease, letter-spacing 0.15s ease;
          z-index: 1;
        }
        .field-input { padding-top: 26px !important; padding-bottom: 8px !important; }
        .field-input:focus ~ .field-label,
        .field-input:not(:placeholder-shown) ~ .field-label {
          top: 5px; font-size: 8px; color: var(--color-gold); letter-spacing: 0.14em;
        }

        /* ── Ghost cards ──────────────────────────────────────────── */
        .ghost-card {
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
        }
        .ghost-line, .ghost-pill {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 2.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Result cards ─────────────────────────────────────────── */
        .result-card {
          border: 1px solid rgba(255,255,255,0.055);
          border-left: 2px solid transparent;
          background: #0D0D0D;
          padding: 16px 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          opacity: 0; animation: fadeUp 0.22s ease forwards;
          border-radius: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          transition: border-left-color 0.18s ease, border-color 0.15s ease, background 0.15s ease;
        }
        .result-card:hover {
          border-left-color: rgba(255,230,93,0.65);
          border-color: rgba(255,230,93,0.25);
          background: rgba(255,230,93,0.02);
        }
        .lead-name {
          font-family: var(--font-sans); font-size: 12px; font-weight: 500; color: #EDEDED;
          margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .maps-link {
          display: inline-flex; align-items: center; gap: 4px;
          color: #888; font-size: 10px; text-decoration: none;
          font-family: var(--font-sans); letter-spacing: 0.03em;
          transition: color 0.15s ease;
          min-height: 28px;
        }
        .maps-link:hover { color: #555; }
        .lead-phone {
          font-family: ui-monospace, "SF Mono", monospace;
          font-size: 14px; letter-spacing: 0.04em; color: #EDEDED; white-space: nowrap;
        }
        .call-btn {
          flex-shrink: 0; padding: 6px 14px;
          background: rgba(255,230,93,0.06); border: 1px solid rgba(255,230,93,0.18);
          color: var(--color-gold); font-size: 10px; font-weight: 700;
          text-decoration: none; font-family: var(--font-sans);
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: background 0.15s ease, border-color 0.15s ease;
          border-radius: 30px;
        }
        .call-btn:hover { background: rgba(255,230,93,0.13); border-color: rgba(255,230,93,0.35); }

        /* ── Animations ───────────────────────────────────────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        .pulse-dot { animation: pulse 1.4s ease-in-out infinite; }

        /* ── Hover / interaction states ───────────────────────────── */
        .search-action:not(:disabled):hover .arrow-icon { transform: translateX(3px); }
        .arrow-icon { transition: transform 0.18s ease; }
        .upgrade-cta:hover { background: rgba(255,230,93,0.1) !important; }
        .signout-btn:hover { color: #888 !important; }
        .clear-btn:hover { color: #777 !important; }
        .icon-btn:hover { color: #888 !important; }
        .history-dl-btn:hover { color: #888 !important; border-color: rgba(255,255,255,0.18) !important; }

        /* ── Mobile ───────────────────────────────────────────────── */
        @media (max-width: 767px) {
          .db-root { flex-direction: column; }
          .sidebar { display: none; }
          .mobile-bar {
            display: flex; height: 52px; padding: 0 14px;
            align-items: center; justify-content: space-between;
            border-bottom: 1px solid rgba(255, 230, 93, 0.08);
            background: rgba(10, 10, 12, 0.95);
            backdrop-filter: blur(20px);
            position: sticky; top: 0; z-index: 50; flex-shrink: 0;
            gap: 6px;
          }
          .db-main { min-height: auto; }
          .main-inner { padding: 28px 18px 80px; }
          .search-zone { padding: 22px 18px 20px; }
          .wall-grid { grid-template-columns: 1fr; }
          .wall-card button { min-height: 48px; }

          /* Prevent iOS zoom on input tap */
          .input-dark { font-size: 16px !important; }

          /* Stack result card on mobile */
          .result-card { flex-wrap: wrap; gap: 10px; }
          .lead-actions { width: 100%; flex-direction: column; gap: 6px; align-items: flex-start; }
          .lead-phone { display: block; }
          .call-btn {
            display: block; width: 100%; text-align: center;
            min-height: 44px; padding: 12px 14px; box-sizing: border-box;
          }

          /* Export / clear full-width on mobile */
          .export-csv-btn { min-height: 48px; }
          .locked-csv-btn { min-height: 48px; }
          .clear-btn { min-height: 44px; }
        }
      `}</style>

      {pendingPlan && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          zIndex: 9999, padding: 24,
        }}>
          <div style={{
            background: "#0D0D0D",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "36px 32px",
            maxWidth: 420, width: "100%",
          }}>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#22C55E", margin: "0 0 12px",
            }}>
              {pendingPlan === "starter" ? "Starter Plan" :
               pendingPlan === "growth" ? "Growth Plan" :
               pendingPlan === "pro" ? "Pro Plan" : "Agency Plan"}
            </p>
            <p style={{
              fontFamily: "var(--font-serif)",
              fontSize: 36, fontWeight: 700,
              color: "#EDEDED", margin: "0 0 4px",
              letterSpacing: "-0.02em",
            }}>
              {pendingPlan === "starter" ? "₹499" :
               pendingPlan === "growth" ? "₹999" :
               pendingPlan === "pro" ? "₹2,499" : "₹4,999"}
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14, color: "#555",
                fontWeight: 400,
              }}>/month</span>
            </p>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14, color: "#555",
              margin: "0 0 24px",
            }}>
              {pendingPlan === "starter" ? "500 leads/month" :
               pendingPlan === "growth" ? "2,000 leads/month" :
               pendingPlan === "pro" ? "10,000 leads/month" :
               "50,000 leads/month"}
              {" · "}Business name, phone, Google Maps link
              {" · "}Cancel anytime
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  const plan = pendingPlan;
                  setPendingPlan(null);
                  handleSelectPlan(plan);
                }}
                style={{
                  flex: 1, background: "#22C55E",
                  color: "#000", border: "none",
                  padding: "14px 0", borderRadius: 8,
                  fontFamily: "var(--font-sans)",
                  fontSize: 14, fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Pay {pendingPlan === "starter" ? "₹499" :
                     pendingPlan === "growth" ? "₹999" :
                     pendingPlan === "pro" ? "₹2,499" : "₹4,999"}
              </button>
              <button
                onClick={() => setPendingPlan(null)}
                style={{
                  flex: 1, background: "transparent",
                  color: "#555",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "14px 0", borderRadius: 8,
                  fontFamily: "var(--font-sans)",
                  fontSize: 14, fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
