import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limit: 5 subscribes per IP per hour
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 5;

  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= maxRequests) return true;

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const db = adminDb();
    const normalized = email.toLowerCase().trim();

    const existing = await db
      .collection("newsletter_subscribers")
      .doc(normalized)
      .get();

    if (existing.exists) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    await db
      .collection("newsletter_subscribers")
      .doc(normalized)
      .set({
        email: normalized,
        subscribedAt: new Date(),
        active: true,
        source: "blog_page",
      });

    await resend.emails.send({
      from: "Pranamya from LocalLeads <hello@sahajta.com>",
      to: normalized,
      subject: "you are in",
      text: `Hey,

You just subscribed to the LocalLeads blog.

Every few days you will get a short, practical post about finding web design clients in India. Real tactics. Real rupee numbers. No fluff.

The next post lands tomorrow morning.

If you ever want to stop getting these, just reply "stop" and I will remove you.

Pranamya
LocalLeads — localleads.sahajta.com

To unsubscribe: https://localleads.sahajta.com/unsubscribe?email=${encodeURIComponent(normalized)}

---
Don't want these? Reply with "stop".`,
      headers: {
        "List-Unsubscribe": `<https://localleads.sahajta.com/unsubscribe?email=${encodeURIComponent(normalized)}>, <mailto:hello@sahajta.com?subject=unsubscribe>`,
      },
    });

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
