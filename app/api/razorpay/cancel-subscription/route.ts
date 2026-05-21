import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const userDocRef = adminDb().collection("users").doc(uid);
    const userSnap = await userDocRef.get();
    const userData = userSnap.data();

    if (!userData?.subscriptionId) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // cancel_at_cycle_end = true so user keeps access until period ends
    await razorpay.subscriptions.cancel(userData.subscriptionId, true);

    await userDocRef.update({ subscriptionStatus: "cancelling" });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel subscription failed:", err);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
