"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 499,
    leads: "500",
    period: "month",
    highlight: false,
    features: [
      "500 verified leads/month",
      "Business name + phone number",
      "Live Google Maps link per lead",
      "Any Indian city, any category",
      "CSV export",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 999,
    leads: "2,000",
    period: "month",
    highlight: true,
    badge: "MOST POPULAR",
    features: [
      "2,000 verified leads/month",
      "Business name + phone number",
      "Live Google Maps link per lead",
      "Any Indian city, any category",
      "CSV export",
      "Priority data freshness",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 2499,
    leads: "10,000",
    period: "month",
    highlight: false,
    features: [
      "10,000 verified leads/month",
      "Business name + phone number",
      "Live Google Maps link per lead",
      "Any Indian city, any category",
      "CSV export",
      "Priority data freshness",
      "Agency-ready volume",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: 4999,
    leads: "50,000",
    period: "month",
    highlight: false,
    features: [
      "50,000 verified leads/month",
      "Business name + phone number",
      "Live Google Maps link per lead",
      "Any Indian city, any category",
      "CSV export",
      "Priority data freshness",
      "Agency-ready volume",
      "Multi-city campaigns",
    ],
  },
];

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({
  isOpen,
  onClose,
}: TrialModalProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] =
    useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] =
    useState<string | null>(null);
  const [step, setStep] = useState<
    "plans" | "signin" | "loading"
  >("plans");
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] =
    useState<string | null>(null);
  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(
      firebaseAuth(),
      (u) => setCurrentUser(u)
    );
    return unsub;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("plans");
        setSelectedPlan(null);
        setAuthError(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSelectPlan(planId: string) {
    setSelectedPlan(planId);
    if (currentUser) {
      setStep("loading");
      router.push(
        `/dashboard?plan=${planId}&trial=true`
      );
      setTimeout(onClose, 300);
    } else {
      setStep("signin");
    }
  }

  async function handleGoogleSignIn() {
    if (signingIn || !selectedPlan) return;
    setSigningIn(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(
        firebaseAuth(),
        provider
      );
      setStep("loading");
      router.push(
        `/dashboard?plan=${selectedPlan}&trial=true`
      );
      setTimeout(onClose, 300);
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code !== "auth/popup-closed-by-user") {
        setAuthError(
          "Sign-in failed. Please try again."
        );
      }
      setStep("signin");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "20px 16px",
        overflowY: "auto",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: "100%",
        maxWidth: step === "plans" ? 960 : 480,
        margin: "auto",
      }}>

        {step === "plans" && (
          <>
            {/* Header */}
            <div style={{
              textAlign: "center",
              marginBottom: 32,
              position: "relative",
            }}>
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  background: "transparent",
                  border: "none",
                  color: "#444",
                  fontSize: 28,
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "0 4px",
                }}
              >
                ×
              </button>

              {/* Trial badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 999,
                padding: "6px 16px",
                marginBottom: 20,
              }}>
                <div style={{
                  width: 7, height: 7,
                  borderRadius: "50%",
                  background: "#22C55E",
                  boxShadow: "0 0 8px #22C55E",
                }} />
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#22C55E",
                }}>
                  7-Day Free Trial — No charge today
                </span>
              </div>

              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 700,
                color: "#EDEDED",
                margin: "0 0 12px",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}>
                Start free. Cancel before 7 days.
                <br />
                <span style={{ color: "#22C55E" }}>
                  Pay nothing.
                </span>
              </h2>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                color: "#555",
                margin: 0,
              }}>
                Your card is saved but not charged today.
                Cancel anytime before day 7 and you
                owe nothing.
              </p>
            </div>

            {/* Plans grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
              marginBottom: 24,
            }}>
              {PLANS.map((plan) => {
                const isSelected =
                  selectedPlan === plan.id;
                const isHovered =
                  hoveredPlan === plan.id;
                const isActive =
                  isSelected || isHovered ||
                  plan.highlight;

                return (
                  <div
                    key={plan.id}
                    onClick={() =>
                      handleSelectPlan(plan.id)}
                    onMouseEnter={() =>
                      setHoveredPlan(plan.id)}
                    onMouseLeave={() =>
                      setHoveredPlan(null)}
                    style={{
                      position: "relative",
                      background: plan.highlight
                        ? "rgba(34,197,94,0.06)"
                        : "#0D0D0D",
                      border: plan.highlight || isHovered
                        ? "1.5px solid #22C55E"
                        : "1.5px solid rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      padding: "24px 20px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      transform: isHovered
                        ? "translateY(-3px)"
                        : "none",
                      boxShadow: plan.highlight
                        ? "0 0 32px rgba(34,197,94,0.12)"
                        : isHovered
                        ? "0 8px 32px rgba(0,0,0,0.4)"
                        : "none",
                    }}
                  >
                    {/* Popular badge */}
                    {"badge" in plan && plan.badge && (
                      <div style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#22C55E",
                        color: "#000",
                        fontFamily: "var(--font-sans)",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        padding: "3px 12px",
                        borderRadius: 999,
                        whiteSpace: "nowrap",
                      }}>
                        {plan.badge}
                      </div>
                    )}

                    {/* Plan name */}
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: plan.highlight
                        ? "#22C55E"
                        : "#555",
                      margin: "0 0 8px",
                    }}>
                      {plan.name}
                    </p>

                    {/* Price */}
                    <div style={{
                      marginBottom: 4,
                    }}>
                      <span style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 32,
                        fontWeight: 700,
                        color: "#EDEDED",
                        letterSpacing: "-0.02em",
                      }}>
                        ₹{plan.price.toLocaleString()}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        color: "#444",
                      }}>
                        /month after trial
                      </span>
                    </div>

                    {/* Leads */}
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "#22C55E",
                      fontWeight: 600,
                      margin: "0 0 16px",
                    }}>
                      {plan.leads} leads/month
                    </p>

                    {/* Features */}
                    <div style={{
                      marginBottom: 20,
                    }}>
                      {plan.features.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            marginBottom: 6,
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#22C55E"
                            strokeWidth="2.5"
                            style={{
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 12,
                            color: "#666",
                            lineHeight: 1.4,
                          }}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      style={{
                        width: "100%",
                        background: plan.highlight
                          ? "#22C55E"
                          : isHovered
                          ? "#22C55E"
                          : "rgba(255,255,255,0.05)",
                        color: plan.highlight || isHovered
                          ? "#000"
                          : "#EDEDED",
                        border: plan.highlight || isHovered
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        padding: "11px 0",
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        letterSpacing: "0.03em",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan.id);
                      }}
                    >
                      Start 7-Day Free Trial
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Trust signals */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}>
              {[
                "No charge for 7 days",
                "Cancel anytime — one click",
                "₹5 auth charge refunded instantly",
                "Google Maps verified data",
              ].map((signal, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "#444",
                  }}>
                    {signal}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "signin" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: "40px 24px",
            textAlign: "center",
            maxWidth: 420,
            margin: "0 auto",
          }}>
            <button
              onClick={() => setStep("plans")}
              style={{
                alignSelf: "flex-start",
                background: "transparent",
                border: "none",
                color: "#444",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
              }}
            >
              ← Back
            </button>

            <div style={{
              width: 56, height: 56,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="24" height="24"
                viewBox="0 0 24 24" fill="none"
                stroke="#22C55E" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            <div>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#22C55E",
                margin: "0 0 8px",
              }}>
                {selectedPlan === "starter" ? "Starter" :
                 selectedPlan === "growth" ? "Growth" :
                 selectedPlan === "pro" ? "Pro" : "Agency"} Plan Selected
              </p>
              <h3 style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                fontWeight: 700,
                color: "#EDEDED",
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}>
                One last step
              </h3>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                color: "#555",
                margin: 0,
                lineHeight: 1.6,
              }}>
                Sign in to create your account.
                Then enter your card details to
                start your 7-day free trial.
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              style={{
                width: "100%",
                maxWidth: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                background: signingIn
                  ? "rgba(255,255,255,0.05)"
                  : "#fff",
                color: "#1a1a1a",
                border: "none",
                borderRadius: 10,
                padding: "14px 24px",
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 600,
                cursor: signingIn ? "wait" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {signingIn ? (
                <span style={{ color: "#555" }}>
                  Signing in...
                </span>
              ) : (
                <>
                  <svg width="20" height="20"
                    viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {authError && (
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "#EF4444",
                margin: 0,
              }}>
                {authError}
              </p>
            )}

            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              color: "#333",
              margin: 0,
              lineHeight: 1.6,
            }}>
              No charge today. ₹5 auth hold refunded
              instantly. Cancel anytime before day 7.
            </p>
          </div>
        )}

        {step === "loading" && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "80px 24px",
          }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: "50%",
              border: "3px solid rgba(34,197,94,0.2)",
              borderTopColor: "#22C55E",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              color: "#555",
              margin: 0,
            }}>
              Setting up your trial...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
