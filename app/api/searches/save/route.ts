import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  try {
    const { businessType, city, localities, leadsFound, leads } = await req.json();

    const db = adminDb();
    const searchesRef = db.collection("users").doc(uid).collection("searches");

    await searchesRef.add({
      businessType,
      city,
      localities: localities || "",
      leadsFound,
      leads,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ saved: true });
  } catch (err) {
    console.error("Search save error:", err);
    return NextResponse.json({ error: "Failed to save search" }, { status: 500 });
  }
}
