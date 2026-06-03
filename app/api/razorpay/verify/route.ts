import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import { createHmac } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { PLAN_LIMITS, Plan } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, plan } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not set");
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
    }

    // Subscription signature: HMAC-SHA256(payment_id + "|" + subscription_id)
    const expectedSignature = createHmac("sha256", secret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    if (!plan || !(plan in PLAN_LIMITS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planExpiresAt = Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await adminDb().collection("users").doc(uid).update({
      plan,
      leadsUsed: 0,
      leadsLimit: PLAN_LIMITS[plan as Plan],
      planExpiresAt,
      subscriptionId: razorpay_subscription_id,
      subscriptionStatus: "trialing",
      trialEndsAt: Timestamp.fromDate(trialEndsAt),
    });

    console.log("verify success", { uid, plan, subscriptionId: razorpay_subscription_id });

    return NextResponse.json({ success: true });
  } catch (err) {
    Sentry.captureException(err);
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
