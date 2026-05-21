import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/apiAuth";
import { sendCAPIEvent } from "@/lib/metaCapi";

export async function POST(req: NextRequest) {
  // Verify token if present — unauthenticated events (e.g. ViewContent) are still allowed
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const auth = await verifyToken(req);
    if (auth instanceof NextResponse) return auth;
  }

  try {
    const { eventName, eventId, eventSourceUrl, email, phone } = await req.json();

    const clientIpAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? undefined;
    const clientUserAgent = req.headers.get("user-agent") ?? undefined;

    await sendCAPIEvent({
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || "https://localleads.sahajta.com",
      userData: { email, phone, clientIpAddress, clientUserAgent },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Meta event error:", err);
    return NextResponse.json({ error: "Failed to send event" }, { status: 500 });
  }
}
