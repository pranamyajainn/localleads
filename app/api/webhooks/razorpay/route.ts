import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { createHmac } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { PLAN_LIMITS, PLAN_PRICES, Plan } from "@/lib/types";
import { sendCAPIEvent } from "@/lib/metaCapi";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.error("RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event as string;
  const innerPayload = payload.payload as Record<string, unknown>;
  const subscriptionPayload = innerPayload?.subscription as Record<string, unknown> | undefined;
  const subscriptionEntity = subscriptionPayload?.entity as Record<string, unknown> | undefined;
  const subscriptionId = subscriptionEntity?.id as string | undefined;
  const paymentEntity = (innerPayload?.payment as Record<string, unknown> | undefined)?.entity as Record<string, unknown> | undefined;
  const paymentId = paymentEntity?.id as string | undefined;

  if (!subscriptionId) {
    return NextResponse.json({ ok: true });
  }

  try {
    const db = adminDb();
    const snap = await db.collection("users").where("subscriptionId", "==", subscriptionId).limit(1).get();
    if (snap.empty) {
      console.error("No user found for subscription:", subscriptionId);
      Sentry.captureMessage(
        `Webhook: no user found for subscriptionId ${subscriptionId}`,
        "error"
      );
      return NextResponse.json({ received: true });
    }

    const userDocRef = snap.docs[0].ref;

    if (event === "subscription.charged") {
      const planData = snap.docs[0].data();

      // Idempotency: skip if we already processed this exact charge
      if (paymentId && planData.lastChargeId === paymentId) {
        return NextResponse.json({ ok: true });
      }

      const plan = planData.plan as Plan;
      const planExpiresAt = Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );

      const updateData: Record<string, unknown> = {
        leadsUsed: 0,
        leadsLimit: PLAN_LIMITS[plan] ?? planData.leadsLimit,
        planExpiresAt,
        subscriptionStatus: "active",
        ...(paymentId ? { lastChargeId: paymentId } : {}),
      };

      // Recovery: subscription.charged only fires for active paid subscriptions.
      // If verify previously failed and plan is still "free", upgrade it now.
      if (planData.plan === "free") {
        updateData.plan = "starter";
        updateData.leadsLimit = PLAN_LIMITS.starter;
      }

      await userDocRef.update(updateData);

      // Server-side Purchase event via CAPI
      // eventId is deterministic on paymentId so Meta deduplicates correctly
      const userEmail = planData.email as string | undefined;
      const planAmountINR = (PLAN_PRICES[plan] ?? 0) / 100;
      sendCAPIEvent({
        eventName: "Purchase",
        eventId: `purchase_${paymentId ?? subscriptionId}`,
        eventSourceUrl: "https://localleads.sahajta.com/pricing",
        userData: { email: userEmail },
        customData: { value: planAmountINR, currency: "INR", content_name: plan },
      }).catch(() => {});
    } else if (event === "subscription.cancelled") {
      await userDocRef.update({
        subscriptionId: null,
        subscriptionStatus: null,
        plan: "free",
        leadsLimit: PLAN_LIMITS.free,
      });
    } else if (event === "subscription.halted") {
      await userDocRef.update({
        subscriptionStatus: "halted",
        plan: "free",
        leadsLimit: PLAN_LIMITS.free,
        leadsUsed: 0,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
