import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyToken } from "@/lib/apiAuth";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (auth instanceof NextResponse) return auth;

  const { uid } = auth;

  try {
    const db = adminDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userSnap.data()?.welcomeEmailSent) {
      return NextResponse.json({ skipped: true });
    }

    const firebaseUser = await adminAuth().getUser(uid);
    const displayName = firebaseUser.displayName ?? "";
    const firstName = displayName.split(" ")[0] || firebaseUser.email?.split("@")[0] || "there";
    const email = firebaseUser.email!;

    await resend.emails.send({
      from: "Pranamya from LocalLeads <hello@sahajta.com>",
      to: email,
      subject: "You're in. Here's how to get your first lead.",
      text: `Hey ${firstName},

Welcome to LocalLeads.

You have 20 free leads ready. No card needed.

To get started:
1. Go to your dashboard
2. Type any business — restaurant, salon, clinic
3. Pick your city
4. Hit find

That is it. Real businesses. Real phone numbers. Every lead has a Google Maps link so you can verify before you call.

Dashboard: https://localleads.sahajta.com/dashboard

Any questions? Just reply to this email.

Pranamya
LocalLeads

---
Don't want these emails? Reply with "stop" and I'll remove you.`,
      headers: {
        "List-Unsubscribe": "<mailto:hello@sahajta.com?subject=unsubscribe>",
      },
    });

    await userRef.update({ welcomeEmailSent: true, emailsSent: ["welcome"] });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
