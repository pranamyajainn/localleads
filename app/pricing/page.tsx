"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { fireEvent } from "@/lib/metaPixel";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";

const PLANS = [
  {
    id: "free",
    name: "Free",
    display: "₹0",
    period: "forever",
    note: "Try it out, no credit card needed",
    leads: "Find 20 shops total (forever)",
    csv: false,
    support: false,
    onboarding: false,
    cta: "Get Started",
    featured: false,
  },
  {
    id: "starter",
    name: "Starter",
    display: "₹499",
    period: "/ month",
    note: "For people starting their design business",
    leads: "Find 500 shops / month",
    csv: true,
    support: false,
    onboarding: false,
    cta: "Get Starter",
    featured: false,
  },
  {
    id: "growth",
    name: "Growth",
    display: "₹999",
    period: "/ month",
    note: "Best plan · build 5 to 10 websites every month",
    leads: "Find 2,000 shops / month",
    csv: true,
    support: false,
    onboarding: false,
    cta: "Get Growth",
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    display: "₹2,499",
    period: "/ month",
    note: "For busy designers and small teams",
    leads: "Find 10,000 shops / month",
    csv: true,
    support: true,
    onboarding: false,
    cta: "Get Pro",
    featured: false,
  },
  {
    id: "agency",
    name: "Agency",
    display: "₹4,999",
    period: "/ month",
    note: "For big companies finding shops everywhere",
    leads: "Find 50,000 shops / month",
    csv: true,
    support: true,
    onboarding: true,
    cta: "Get Agency",
    featured: false,
  },
];

export default function PricingPage() {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();
  const { handleSelectPlan, paying, payError } = useRazorpayCheckout(user, router);

  useEffect(() => {
    fireEvent("ViewContent", { content_name: "Pricing Plans" });
  }, []);

  const currentPlan = userDoc?.plan;

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#EDEDED" }}>

      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 40px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,8,8,0.95)", backdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
            Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
          </span>
        </Link>
        <div>
          {user ? (
            <Link href="/dashboard" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555", textDecoration: "none", letterSpacing: "0.04em" }}>
              Dashboard →
            </Link>
          ) : (
            <Link href="/auth" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555", textDecoration: "none" }}>
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 100px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ width: 40, height: 1, background: "var(--color-gold)", margin: "0 auto 20px" }} />
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.03em", color: "#EDEDED",
            margin: "0 0 12px",
          }}>
            Only pay when we find a shop with no website!
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#888", margin: 0, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            You only pay for real shop phone numbers. No website = they need your help! No wasted money.
          </p>
        </div>

        {payError && (
          <div style={{
            marginBottom: 28, padding: "14px 20px",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.06)",
            borderRadius: 24,
            fontFamily: "var(--font-sans)", fontSize: 13, color: "#F87171", textAlign: "center",
          }}>
            {payError}
          </div>
        )}

        {/* Plans grid */}
        <div className="pricing-grid-5">
          {PLANS.map((plan) => {
            const isCurrent = !loading && currentPlan === plan.id;
            const isPayingThis = paying === plan.id;

            return (
              <div
                key={plan.id}
                className={plan.featured ? "price-card price-card-featured" : "price-card"}
              >
                {plan.featured && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    background: "var(--color-gold)", padding: "5px 0", textAlign: "center",
                    fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 800,
                    letterSpacing: "0.15em", color: "#080808", textTransform: "uppercase",
                    borderRadius: "22px 22px 0 0",
                  }}>
                    Best Plan
                  </div>
                )}

                <div style={{ marginBottom: 16, marginTop: plan.featured ? 22 : 0 }}>
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: plan.featured ? "var(--color-gold)" : "#666",
                    margin: "0 0 3px",
                  }}>
                    {plan.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#444", margin: 0, lineHeight: 1.5 }}>
                    {plan.note}
                  </p>
                </div>

                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: plan.featured ? 44 : 34,
                    fontWeight: plan.featured ? 400 : 300,
                    color: plan.featured ? "#EDEDED" : "#999",
                    lineHeight: 1,
                    display: "block",
                  }}>
                    {plan.display}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#444" }}>{plan.period}</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    plan.leads,
                    plan.csv ? "Download list to Excel/CSV" : null,
                    plan.support ? "Quick email support" : null,
                    plan.onboarding ? "Help with onboarding" : null,
                    "All cities",
                  ].filter(Boolean).map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, color: plan.featured ? "#EDEDED" : "#777" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div style={{
                    textAlign: "center", padding: "10px 0",
                    border: "1px solid rgba(255,230,93,0.3)",
                    borderRadius: 30,
                    fontFamily: "var(--font-sans)", fontSize: 10,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "var(--color-gold)",
                  }}>
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isPayingThis || !!paying}
                    className={plan.featured ? "btn-gold" : "btn-ghost"}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", opacity: (isPayingThis || !!paying) ? 0.5 : 1,
                      cursor: (isPayingThis || !!paying) ? "not-allowed" : "pointer",
                      fontSize: plan.featured ? 12 : 11,
                      borderRadius: 30,
                    }}
                  >
                    {isPayingThis && (
                      <span className="premium-dot-loader" style={{ marginRight: 8 }}>
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                    {plan.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#444", marginTop: 32, marginBottom: 4 }}>
          Need more?{" "}
          <a href="mailto:contact@sahajta.com" style={{ color: "var(--color-gold)", textDecoration: "none" }}>
            contact@sahajta.com
          </a>
        </p>

        <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2E2E", marginTop: 10 }}>
          Payments are safe and secure. Stop subscription anytime.
        </p>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "24px 40px", textAlign: "center",
        fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2E2E",
      }}>
        Built by Sahajta AI Solutions
      </footer>

      <style>{`
        .pricing-grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          align-items: stretch;
        }
        .price-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 24px 18px 20px;
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
        }
        .price-card-featured {
          background: rgba(255, 230, 93, 0.04);
          border: 2px solid var(--color-gold);
          padding: 36px 20px 24px;
          z-index: 2;
          border-radius: 24px;
        }

        @media (max-width: 900px) {
          .pricing-grid-5 {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 600px) {
          .pricing-grid-5 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
