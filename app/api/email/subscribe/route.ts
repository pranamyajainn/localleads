import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
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

---
Don't want these? Reply with "stop".`,
      headers: {
        "List-Unsubscribe": "<mailto:hello@sahajta.com?subject=unsubscribe>",
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
