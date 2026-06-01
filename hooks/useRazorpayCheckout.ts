"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { fireEvent } from "@/lib/metaPixel";
import { trackEvent } from "@/lib/gtag";

const PLAN_AMOUNTS_INR: Record<string, number> = {
  starter: 499,
  growth: 999,
  pro: 2499,
  agency: 4999,
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function pollForPlanUpdate(token: string, maxAttempts = 10): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const res = await fetch("/api/razorpay/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.plan && data.plan !== "free") return true;
      }
    } catch {
      // network error — keep polling
    }
  }
  return false;
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

export function useRazorpayCheckout(
  user: User | null,
  router: ReturnType<typeof useRouter>
) {
  const [paying, setPaying] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === "free") {
      router.push("/auth");
      return;
    }
    if (!user) {
      router.push(`/auth?plan=${planId}`);
      return;
    }

    trackEvent("begin_checkout", "payment", planId);
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

      const { subscription_id, key_id } = await subRes.json();

      if (!key_id) throw new Error("Payment configuration error. Please contact support.");

      const options = {
        key: key_id,
        subscription_id,
        name: "LocalLeads",
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan — Monthly`,
        prefill: { email: user.email },
        theme: { color: "#22C55E" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, plan: planId }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            trackEvent("purchase", "payment", planId, PLAN_AMOUNTS_INR[planId]);
            router.push("/payment/success");
          } catch {
            setPayError("Payment succeeded but verification failed. Please contact support.");
          }
        },
        modal: { ondismiss: () => setPaying(null) },
        callback_url: `${window.location.origin}/api/razorpay/verify-redirect`,
        redirect: false,
      };

      await fireEvent(
        "InitiateCheckout",
        { value: PLAN_AMOUNTS_INR[planId] || 0, currency: "INR", content_name: planId },
        { email: user.email || undefined }
      );

      const rzp = new window.Razorpay(options);
      rzp.open();

      // Background poll: catches UPI flows where Android kills the JS callback
      pollForPlanUpdate(token).then((upgraded) => {
        if (upgraded) window.location.href = "/payment/success";
      });
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Payment failed.");
      setPaying(null);
    }
  };

  return { handleSelectPlan, paying, payError };
}
