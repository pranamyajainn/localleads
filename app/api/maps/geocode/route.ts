import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";

const MAPS_BASE = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    input: query,
    inputtype: "textquery",
    fields: "geometry",
    key: process.env.GOOGLE_MAPS_API_KEY!,
  });

  try {
    const res = await fetch(`${MAPS_BASE}?${params}`);
    const data = await res.json();

    if (
      data.status !== "OK" ||
      !data.candidates?.[0]?.geometry?.location
    ) {
      return NextResponse.json({ location: null, status: data.status });
    }

    return NextResponse.json({
      location: data.candidates[0].geometry.location,
      status: data.status,
    });
  } catch {
    return NextResponse.json({ error: "Maps API request failed" }, { status: 502 });
  }
}
