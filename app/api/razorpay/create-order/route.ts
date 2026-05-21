import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import Razorpay from "razorpay";
import { PLAN_PRICES } from "@/lib/types";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const { plan } = await req.json();

    if (!plan || !(plan in PLAN_PRICES)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount = PLAN_PRICES[plan] * 100; // Convert to paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `order_${uid}_${Date.now()}`,
      notes: { plan, uid },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
