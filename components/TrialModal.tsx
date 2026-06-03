"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  onClose
}: TrialModalProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] =
    useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] =
    useState<string | null>(null);

  if (!isOpen) return null;

  function handleSelectPlan(planId: string) {
    setSelectedPlan(planId);
    setTimeout(() => {
      router.push(
        `/auth?plan=${planId}&trial=true`
      );
      onClose();
    }, 150);
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
      <div style={{
        width: "100%",
        maxWidth: 960,
        margin: "auto",
      }}>
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
      </div>
    </div>
  );
}
