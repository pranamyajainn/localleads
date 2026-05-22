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
      from: "LocalLeads <hello@sahajta.com>",
      to: email,
      replyTo: "contact@sahajta.com",
      subject: "You used your free leads — here is what comes next",
      html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;line-height:1.7;font-size:15px">
  <div style="margin-bottom: 24px;">
    <img src="https://localleads.sahajta.com/favicon.png" alt="LocalLeads" width="48" height="48" style="display: block;" />
  </div>
  <p>Hi ${firstName},</p>
  <p>You just used your 20 free leads on LocalLeads.</p>
  <p>If you found even one business to call, that is proof the product works for you.</p>
  <p>The Starter plan gives you 500 leads a month for &#8377;499 — that is &#8377;17 a day. One website sale pays it back 20 times over.</p>
  <p><strong>What you get with Starter:</strong></p>
  <ul style="padding-left:20px;margin:0 0 20px">
    <li>500 leads per month — find businesses in any Indian city, export to CSV, cancel anytime.</li>
  </ul>
  <p>
    <a href="https://localleads.sahajta.com/pricing" style="display:inline-block;background:#22C55E;color:#fff;text-decoration:none;padding:12px 24px;font-weight:700;font-size:14px">
      Upgrade to Starter — &#8377;499/mo
    </a>
  </p>
  <p style="color:#888;font-size:13px">Or reply to this email if you have questions. We read every message.</p>
  <p style="margin-top:32px">— The LocalLeads team<br><span style="color:#888;font-size:13px">Built by Sahajta AI Solutions</span></p>
</body>
</html>`,
    });

    await userRef.update({ upgradeEmailSent: true });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Upgrade nudge email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
