"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { fireEvent } from "@/lib/metaPixel";

const PLAN_AMOUNTS_INR: Record<string, number> = {
  starter: 499,
  growth: 999,
  pro: 2499,
  agency: 4999,
};

const PLANS = [
  {
    id: "free",
    name: "Free",
    display: "₹0",
    period: "forever",
    note: "Try LocalLeads, no card needed",
    leads: "20 leads lifetime",
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
    note: "For freelancers just starting out",
    leads: "500 leads / month",
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
    note: "Most popular · closes 5–10 sites/month",
    leads: "2,000 leads / month",
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
    note: "For full-time freelancers & small agencies",
    leads: "10,000 leads / month",
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
    note: "For agencies running multi-city campaigns",
    leads: "50,000 leads / month",
    csv: true,
    support: true,
    onboarding: true,
    cta: "Get Agency",
    featured: false,
  },
];

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PricingPage() {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();
  const [paying, setPaying] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    fireEvent("ViewContent", { content_name: "Pricing Plans" });
  }, []);

  const handleSelectPlan = async (planId: string) => {
    if (planId === "free") {
      router.push("/auth");
      return;
    }
    if (!user) {
      router.push(`/auth?plan=${planId}`);
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setPayError("Payment configuration error. Please contact support.");
      return;
    }

    setPaying(planId);
    setPayError(null);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway.");

      const token = await user.getIdToken();
      const subRes = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      if (!subRes.ok) {
        const errBody = await subRes.text().catch(() => "(unreadable)");
        console.error("Subscription creation failed:", subRes.status, errBody);
        throw new Error("Failed to create subscription.");
      }

      const { subscription_id } = await subRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id,
        name: "LocalLeads",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan — Monthly`,
        prefill: { email: user.email },
        theme: { color: "#22C55E" },
        handler: async (response: { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, plan: planId }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            router.push("/payment/success");
          } catch {
            setPayError("Payment succeeded but verification failed. Please contact support.");
          }
        },
        modal: { ondismiss: () => setPaying(null) },
      };

      await fireEvent(
        "InitiateCheckout",
        { value: PLAN_AMOUNTS_INR[planId] || 0, currency: "INR", content_name: planId },
        { email: user.email || undefined }
      );

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Payment failed.");
      setPaying(null);
    }
  };

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
            Local<span style={{ color: "#22C55E" }}>Leads</span>
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
          <div style={{ width: 40, height: 1, background: "#22C55E", margin: "0 auto 20px" }} />
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.03em", color: "#EDEDED",
            margin: "0 0 12px",
          }}>
            Pay per lead, not per search.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#555", margin: 0, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            Every plan charges you only for leads that qualify — businesses with a phone number and no website. Zero waste.
          </p>
        </div>

        {payError && (
          <div style={{
            marginBottom: 28, padding: "14px 20px",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.06)",
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
                    background: "#22C55E", padding: "5px 0", textAlign: "center",
                    fontFamily: "var(--font-sans)", fontSize: 9, fontWeight: 800,
                    letterSpacing: "0.15em", color: "#080808", textTransform: "uppercase",
                  }}>
                    Most popular
                  </div>
                )}

                <div style={{ marginBottom: 16, marginTop: plan.featured ? 22 : 0 }}>
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: plan.featured ? "#22C55E" : "#666",
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
                    plan.csv ? "CSV export" : null,
                    plan.support ? "Priority support" : null,
                    plan.onboarding ? "Dedicated onboarding" : null,
                    "All cities",
                  ].filter(Boolean).map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 12, color: plan.featured ? "#EDEDED" : "#777" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div style={{
                    textAlign: "center", padding: "10px 0",
                    border: "1px solid rgba(34,197,94,0.3)",
                    fontFamily: "var(--font-sans)", fontSize: 10,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#22C55E",
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
                    }}
                  >
                    {isPayingThis && (
                      <span style={{ width: 12, height: 12, border: "1.5px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    )}
                    {plan.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "#444", marginTop: 32, marginBottom: 4 }}>
          Need a custom volume plan?{" "}
          <a href="mailto:contact@sahajta.com" style={{ color: "#22C55E", textDecoration: "none" }}>
            contact@sahajta.com
          </a>
        </p>

        <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2E2E", marginTop: 10 }}>
          Payments processed securely by Razorpay. Cancel anytime.
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
        @keyframes spin { to { transform: rotate(360deg); } }

        .pricing-grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          align-items: stretch;
        }
        .price-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 24px 18px 20px;
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.1);
          margin-left: -1px;
        }
        .price-card-featured {
          background: rgba(34,197,94,0.04);
          border: 2px solid rgba(34,197,94,0.45);
          padding: 36px 20px 24px;
          z-index: 2;
          margin-left: -1px;
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
          .price-card, .price-card-featured {
            margin-left: 0;
            margin-top: -1px;
          }
        }
      `}</style>
    </div>
  );
}
