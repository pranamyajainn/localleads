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
      from: "LocalLeads <hello@sahajta.com>",
      to: email,
      replyTo: "contact@sahajta.com",
      subject: "You're in. Here's how to get your first lead.",
      html: `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;line-height:1.7;font-size:15px">
  <p>Hi ${firstName},</p>
  <p>Welcome to LocalLeads.</p>
  <p>You have 1 free search waiting. Here is exactly what to do with it:</p>
  <ol style="padding-left:20px;margin:0 0 20px">
    <li>Go to your dashboard</li>
    <li>Type a business type — start with "restaurants" or "salons"</li>
    <li>Enter your city and one or two localities you know</li>
    <li>Hit search</li>
  </ol>
  <p>You will see businesses with a live phone number and no website. Pick one. Call them today.</p>
  <p><strong>The pitch:</strong> "I found you on Google Maps — you have no website, I build them starting at &#8377;10,000. Interested?"</p>
  <p>One call can pay for months of LocalLeads.</p>
  <p>If you get stuck, reply to this email. We read every message.</p>
  <p style="margin-top:32px">— The LocalLeads team<br><span style="color:#888;font-size:13px">Built by Sahajta AI Solutions</span></p>
</body>
</html>`,
    });

    await userRef.update({ welcomeEmailSent: true });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
