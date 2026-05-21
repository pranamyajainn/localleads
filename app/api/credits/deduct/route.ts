import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  let amount = 1;
  try {
    const body = await req.json();
    if (typeof body?.amount === "number" && body.amount > 0) {
      amount = body.amount;
    }
  } catch {
    // no body or non-JSON — use default of 1
  }

  const db = adminDb();
  const userRef = db.collection("users").doc(uid);

  try {
    let allowed = false;

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error("User not found");

      const data = snap.data()!;
      // Backward compat: support both pre-migration and new field names
      const used = data.leadsUsed ?? data.searchesUsed ?? 0;
      const limit = data.leadsLimit ?? data.searchesLimit ?? 20;

      if (used >= limit) {
        allowed = false;
        return;
      }

      tx.update(userRef, { leadsUsed: FieldValue.increment(amount) });
      allowed = true;
    });

    if (!allowed) {
      return NextResponse.json(
        { error: "Lead limit reached", message: "Lead limit reached. Upgrade to continue." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Credit deduction error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
