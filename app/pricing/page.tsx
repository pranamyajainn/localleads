"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    display: "₹0",
    period: "forever",
    note: "Try one search in your city",
    searches: "1 search / month",
    leads: "10 leads shown",
    csv: false,
    support: false,
    cta: "Get Started",
    featured: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: 499,
    display: "₹499",
    period: "/ month",
    note: "Most popular · first sale pays this back 20×",
    searches: "10 searches / month",
    leads: "Unlimited leads",
    csv: true,
    support: false,
    cta: "Get Starter — ₹499/mo",
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    display: "₹999",
    period: "/ month",
    note: "For freelancers closing 5+ websites/month",
    searches: "50 searches / month",
    leads: "Unlimited leads",
    csv: true,
    support: true,
    cta: "Get Pro",
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

  const handleSelectPlan = async (planId: string, price: number) => {
    if (planId === "free") {
      router.push("/auth");
      return;
    }
    if (!user) {
      router.push(`/auth?plan=${planId}`);
      return;
    }
    setPaying(planId);
    setPayError(null);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway.");
      const token = await user.getIdToken();
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      if (!orderRes.ok) throw new Error("Failed to create order.");
      const { order_id, amount, currency } = await orderRes.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount, currency,
        name: "LocalLeads",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        order_id,
        prefill: { email: user.email },
        theme: { color: "#22C55E" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
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

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 40px" }}>

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
            Choose your plan.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#555", margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            ₹499/month is ₹17/day. Your first website sale pays it back 20 times over.
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

        {/* Plans — Hick's Law: Starter is dominant */}
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", alignItems: "stretch" }}>
          {PLANS.map((plan, i) => {
            const isCurrent = !loading && currentPlan === plan.id;
            const isPayingThis = paying === plan.id;

            return (
              <div
                key={plan.id}
                className={plan.featured ? "pricing-card pricing-card-featured" : "pricing-card"}
                style={{
                  position: "relative",
                  display: "flex", flexDirection: "column",
                  padding: plan.featured ? "44px 32px" : "32px 24px",
                  background: plan.featured ? "rgba(34,197,94,0.04)" : "transparent",
                  border: plan.featured
                    ? "2px solid rgba(34,197,94,0.45)"
                    : "1px solid rgba(255,255,255,0.07)",
                  marginLeft: i === 1 ? -1 : 0,
                  marginRight: i === 1 ? -1 : 0,
                  zIndex: plan.featured ? 2 : 1,
                }}
              >
                {plan.featured && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    background: "#22C55E", padding: "6px 0", textAlign: "center",
                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.15em", color: "#080808", textTransform: "uppercase",
                  }}>
                    Most popular
                  </div>
                )}

                <div style={{ marginBottom: 20, marginTop: plan.featured ? 24 : 0 }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.featured ? "#22C55E" : "#444", margin: "0 0 4px" }}>
                    {plan.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: plan.featured ? "#555" : "#333", margin: 0 }}>
                    {plan.note}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: plan.featured ? 54 : 40,
                    fontWeight: plan.featured ? 400 : 300,
                    color: plan.featured ? "#EDEDED" : "#444",
                    lineHeight: 1,
                  }}>
                    {plan.display}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555" }}>{plan.period}</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[plan.searches, plan.leads, plan.csv ? "CSV export" : null, plan.support ? "Priority support" : null]
                    .filter(Boolean)
                    .map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 14, color: plan.featured ? "#EDEDED" : "#555" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        {f}
                      </li>
                    ))}
                  {!plan.csv && (
                    <li style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 14, color: "#2E2E2E" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      CSV export
                    </li>
                  )}
                </ul>

                {isCurrent ? (
                  <div style={{
                    textAlign: "center", padding: "12px 0",
                    border: "1px solid rgba(34,197,94,0.3)",
                    fontFamily: "var(--font-sans)", fontSize: 11,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#22C55E",
                  }}>
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.id, plan.price)}
                    disabled={isPayingThis || !!paying}
                    className={plan.featured ? "btn-gold" : "btn-ghost"}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", opacity: (isPayingThis || !!paying) ? 0.5 : 1,
                      cursor: (isPayingThis || !!paying) ? "not-allowed" : "pointer",
                      fontSize: plan.featured ? 13 : 12,
                    }}
                  >
                    {isPayingThis && (
                      <span style={{ width: 14, height: 14, border: "1.5px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    )}
                    {plan.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2E2E", marginTop: 32 }}>
          Payments are processed securely by Razorpay. Cancel anytime.
        </p>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "24px 40px",
        textAlign: "center",
        fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2E2E",
      }}>
        Built by Sahajta AI Solutions
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
