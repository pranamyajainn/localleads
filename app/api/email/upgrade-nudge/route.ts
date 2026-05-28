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

    if (userSnap.data()?.upgradeEmailSent) {
      return NextResponse.json({ skipped: true });
    }

    const firebaseUser = await adminAuth().getUser(uid);
    const displayName = firebaseUser.displayName ?? "";
    const firstName = displayName.split(" ")[0] || firebaseUser.email?.split("@")[0] || "there";
    const email = firebaseUser.email!;

    await resend.emails.send({
      from: "Pranamya from LocalLeads <hello@sahajta.com>",
      to: email,
      subject: "You used your free leads — here is what comes next",
      text: `Hey ${firstName},

You just used your 20 free leads on LocalLeads.

If you found even one business to call, that is proof the product works for you.

The Starter plan gives you 500 leads a month for ₹499. That is ₹17 a day. One website sale pays it back 20 times over.

Get more leads here: https://localleads.sahajta.com/pricing

Any questions? Just reply to this email. I actually read them.

Pranamya
LocalLeads

To unsubscribe: https://localleads.sahajta.com/unsubscribe?email=${encodeURIComponent(email)}

---
Don't want these emails? Reply with "stop" and I'll remove you.`,
      headers: {
        "List-Unsubscribe": `<https://localleads.sahajta.com/unsubscribe?email=${encodeURIComponent(email)}>, <mailto:hello@sahajta.com?subject=unsubscribe>`,
      },
    });

    await userRef.update({ upgradeEmailSent: true });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Upgrade nudge email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
