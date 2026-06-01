import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  const db = adminDb();
  const userSnap = await db.collection("users").doc(uid).get();

  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const data = userSnap.data()!;
  return NextResponse.json({
    plan: data.plan ?? "free",
    leadsLimit: data.leadsLimit ?? 20,
    subscriptionStatus: data.subscriptionStatus ?? null,
  });
}
