import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import { createHmac } from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { PLAN_LIMITS, Plan } from "@/lib/types";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await req.json();

    // Verify Razorpay signature
    const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
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

    await adminDb().collection("users").doc(uid).update({
      plan,
      leadsUsed: 0,
      leadsLimit: PLAN_LIMITS[plan as Plan],
      planExpiresAt,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
