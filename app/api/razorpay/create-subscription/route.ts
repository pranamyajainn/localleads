import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import Razorpay from "razorpay";

const PLAN_ENV_KEYS: Record<string, string> = {
  starter: "RAZORPAY_PLAN_STARTER",
  growth: "RAZORPAY_PLAN_GROWTH",
  pro: "RAZORPAY_PLAN_PRO",
  agency: "RAZORPAY_PLAN_AGENCY",
};

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { plan } = await req.json();
    const planEnvKey = PLAN_ENV_KEYS[plan];

    if (!planEnvKey) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planId = process.env[planEnvKey];
    if (!planId || planId.startsWith("plan_placeholder")) {
      return NextResponse.json({ error: "Plan not configured" }, { status: 500 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
    });

    return NextResponse.json({ subscription_id: subscription.id });
  } catch (err) {
    const rzpErr = err as { error?: { description?: string; code?: string }; message?: string };
    const detail = rzpErr?.error?.description || rzpErr?.error?.code || rzpErr?.message || JSON.stringify(err);
    console.error("Razorpay subscription creation failed:", JSON.stringify(err));
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
