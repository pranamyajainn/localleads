import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;
  const db = adminDb();
  const userRef = db.collection("users").doc(uid);

  try {
    let allowed = false;

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error("User not found");

      const data = snap.data()!;
      const used = data.searchesUsed ?? 0;
      const limit = data.searchesLimit ?? 1;

      if (used >= limit) {
        allowed = false;
        return;
      }

      tx.update(userRef, { searchesUsed: FieldValue.increment(1) });
      allowed = true;
    });

    if (!allowed) {
      return NextResponse.json(
        { error: "Search limit reached", message: "Search limit reached. Upgrade to continue." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Credit deduction error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
