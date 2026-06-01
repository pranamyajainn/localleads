import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";

const resend = new Resend(process.env.RESEND_API_KEY);

function daysSince(date: Date): number {
  return Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function plainEmail(to: string, subject: string, body: string) {
  const unsubUrl = `https://localleads.sahajta.com/unsubscribe?email=${encodeURIComponent(to)}`;
  const bodyWithUnsub = body.replace(
    "\n---\n",
    `\nTo unsubscribe: ${unsubUrl}\n\n---\n`
  );
  return resend.emails.send({
    from: "Pranamya from LocalLeads <hello@sahajta.com>",
    to,
    subject,
    text: bodyWithUnsub,
    headers: {
      "List-Unsubscribe": `<${unsubUrl}>, <mailto:hello@sahajta.com?subject=unsubscribe>`,
    },
  });
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const vercelCronHeader = request.headers.get("x-vercel-cron-signature");

  // Allow both: Vercel's automatic cron calls AND manual curl calls with Bearer token
  const isVercelCron = vercelCronHeader !== null;
  const isManualTrigger = authHeader === `Bearer ${cronSecret}`;

  if (!isVercelCron && !isManualTrigger) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
  const db = adminDb();
  const usersSnap = await db
    .collection("users")
    .where("plan", "==", "free")
    .get();

  const results: string[] = [];

  for (const doc of usersSnap.docs) {
    const user = doc.data();
    if (!user.email || !user.createdAt) continue;
    if (user.emailOptOut === true) continue;

    const createdAt = user.createdAt.toDate
      ? user.createdAt.toDate()
      : new Date(user.createdAt);

    const days = daysSince(createdAt);
    const leadsUsed = user.leadsUsed ?? 0;
    const leadsLimit = user.leadsLimit ?? 20;
    const leadsLeft = leadsLimit - leadsUsed;
    const hasSearched = leadsUsed > 0;
    const allUsed = leadsUsed >= leadsLimit;
    const emailsSent = user.emailsSent || [];

    // Day 2 — has not searched yet
    if (
      days >= 2 &&
      days < 5 &&
      !hasSearched &&
      !emailsSent.includes("nudge1")
    ) {
      await plainEmail(
        user.email,
        "still there?",
        `Hey,

I noticed you signed up for LocalLeads but haven't run a search yet.

Takes about 30 seconds. Type any business type, pick your city, hit find.

You get 20 leads free — no card needed. Real businesses, real phone numbers, live Google Maps links.

What city were you thinking of searching?

Try it here: https://localleads.sahajta.com/dashboard

Pranamya
LocalLeads

---
Don't want these emails? Reply with "stop" and I'll remove you.`
      );
      await db.collection("users").doc(doc.id).update({
        emailsSent: [...emailsSent, "nudge1"],
      });
      results.push(`nudge1 → ${user.email}`);
    }

    // Day 4 — searched but has leads left
    else if (
      days >= 4 &&
      days < 8 &&
      hasSearched &&
      !allUsed &&
      !emailsSent.includes("nudge2")
    ) {
      await plainEmail(
        user.email,
        `you have ${leadsLeft} leads left`,
        `Hey,

You ran a search on LocalLeads — good.

You still have ${leadsLeft} free leads sitting there.

Each lead is a business with no website and a live phone number. One call can close a ₹15,000 project.

Go through the rest of your list: https://localleads.sahajta.com/dashboard

Any questions? Just reply to this email. I actually read them.

Pranamya
LocalLeads

---
Don't want these emails? Reply with "stop" and I'll remove you.`
      );
      await db.collection("users").doc(doc.id).update({
        emailsSent: [...emailsSent, "nudge2"],
      });
      results.push(`nudge2 → ${user.email}`);
    }

    // Day 7 — all leads used, not upgraded
    else if (
      days >= 7 &&
      days < 12 &&
      allUsed &&
      !emailsSent.includes("upgrade1")
    ) {
      await plainEmail(
        user.email,
        "you used all 20 leads",
        `Hey,

You went through all 20 free leads on LocalLeads. That means you actually used it — which is good.

If even one of those turned into a call, you already know it works.

500 more leads is ₹499/month. That is less than a dinner out. One closed client pays for 2 years of the tool.

Get more leads here: https://localleads.sahajta.com/pricing

If you ran into any issues with the data or anything felt off, just reply and tell me. I want to fix it.

Pranamya
LocalLeads

---
Don't want these emails? Reply with "stop" and I'll remove you.`
      );
      await db.collection("users").doc(doc.id).update({
        emailsSent: [...emailsSent, "upgrade1"],
      });
      results.push(`upgrade1 → ${user.email}`);
    }

    // Day 14 — still free, no upgrade
    else if (
      days >= 14 &&
      days < 20 &&
      !emailsSent.includes("final")
    ) {
      await plainEmail(
        user.email,
        "honest question",
        `Hey,

It has been two weeks since you signed up for LocalLeads.

Honest question — what stopped you from pitching those leads?

Was it the data quality? The price? Just got busy?

I am asking because I want to fix whatever is broken. If the tool did not work for you, I want to know why.

Just reply to this email. Even one line helps.

If you are ready to try again with 500 leads: https://localleads.sahajta.com/pricing

Pranamya
LocalLeads

---
Don't want these emails? Reply with "stop" and I'll remove you.`
      );
      await db.collection("users").doc(doc.id).update({
        emailsSent: [...emailsSent, "final"],
      });
      results.push(`final → ${user.email}`);
    }
  }

  return NextResponse.json({
    message: "Sequence processed",
    sent: results.length,
    details: results,
  });
  } catch (err) {
    Sentry.captureException(err);
    console.error("Email sequence error:", err);
    return NextResponse.json({ error: "Sequence processing failed" }, { status: 500 });
  }
}
