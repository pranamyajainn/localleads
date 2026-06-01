import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { adminDb } from "@/lib/firebaseAdmin";

const MAPS_BASE = "https://maps.googleapis.com/maps/api/place/details/json";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  const db = adminDb();
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }

  const userData = userSnap.data()!;
  const leadsUsed = userData.leadsUsed ?? userData.searchesUsed ?? 0;
  const leadsLimit = userData.leadsLimit ?? userData.searchesLimit ?? 20;

  if (leadsUsed >= leadsLimit) {
    return NextResponse.json({ error: "Lead limit reached" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "name,formatted_phone_number,url,website",
    key: process.env.GOOGLE_MAPS_API_KEY!,
  });

  try {
    const res = await fetch(`${MAPS_BASE}?${params}`);
    const data = await res.json();

    if (data.status !== "OK" || !data.result) {
      return NextResponse.json({ result: null, status: data.status });
    }

    const p = data.result;
    return NextResponse.json({
      result: {
        name: p.name || null,
        phone: p.formatted_phone_number || null,
        website: p.website || null,
        mapsUrl: p.url || `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      },
      status: data.status,
    });
  } catch {
    return NextResponse.json({ error: "Maps API request failed" }, { status: 502 });
  }
}
