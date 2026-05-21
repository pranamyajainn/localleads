import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";

const MAPS_BASE = "https://maps.googleapis.com/maps/api/place/textsearch/json";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query");
  const pagetoken = searchParams.get("pagetoken");

  if (!query && !pagetoken) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const params = new URLSearchParams({ key: process.env.GOOGLE_MAPS_API_KEY! });
  if (query) params.set("query", query);
  if (pagetoken) params.set("pagetoken", pagetoken);

  try {
    const res = await fetch(`${MAPS_BASE}?${params}`);
    const data = await res.json();

    return NextResponse.json({
      results: (data.results || []).map((p: { place_id: string; name: string }) => ({
        place_id: p.place_id,
        name: p.name,
      })),
      next_page_token: data.next_page_token || null,
      status: data.status,
    });
  } catch {
    return NextResponse.json({ error: "Maps API request failed" }, { status: 502 });
  }
}
