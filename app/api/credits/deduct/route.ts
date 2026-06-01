import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (body.amount !== 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const amount = 1;

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
