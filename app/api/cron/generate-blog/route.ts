import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { adminDb } from "@/lib/firebaseAdmin";
import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";

async function notifySubscribers(
  db: ReturnType<typeof adminDb>,
  title: string,
  slug: string,
  description: string
) {
  try {
    const subscribersSnap = await db
      .collection("newsletter_subscribers")
      .where("active", "==", true)
      .limit(200)
      .get();

    if (subscribersSnap.empty) return;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const postUrl = `https://localleads.sahajta.com/blog/${slug}`;

    const emailList = subscribersSnap.docs
      .map((doc) => doc.data().email)
      .filter(Boolean) as string[];

    // Send in batches of 10 concurrently
    const BATCH_SIZE = 10;
    for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
      const batch = emailList.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((email) =>
          resend.emails.send({
            from: "Pranamya from LocalLeads <hello@sahajta.com>",
            to: email,
            subject: title,
            text: `Hey,

New post on the LocalLeads blog:

${title}

${description}

Read it here: ${postUrl}

To unsubscribe: https://localleads.sahajta.com/unsubscribe?email=${encodeURIComponent(email)}

---
Or reply with "stop".`,
            headers: {
              "List-Unsubscribe": `<https://localleads.sahajta.com/unsubscribe?email=${encodeURIComponent(email)}>, <mailto:hello@sahajta.com?subject=unsubscribe>`,
            },
          }).catch((err) => {
            console.error(`Failed to send to ${email}:`, err);
          })
        )
      );
    }

    console.log(`Notified ${emailList.length} subscribers`);
  } catch (error) {
    console.error("Subscriber notification error:", error);
  }
}

// ── Pillar-Cluster Content Architecture ───────────────────────────────────────

const CONTENT_CLUSTERS = [
  {
    pillar: {
      keyword: "Jaipur mein freelance web design se paisa kaise kamaye",
      city: "Jaipur",
      isPillar: true,
      pillarSlug: "jaipur-web-design-freelancing-guide",
    },
    clusters: [
      { keyword: "Jaipur ke restaurants jinhe website chahiye 2026", city: "Jaipur", persona: "arjun" },
      { keyword: "website banana ka rate kya hona chahiye Jaipur mein", city: "Jaipur", persona: "arjun" },
      { keyword: "Malviya Nagar Jaipur mein clients kaise dhundhe", city: "Jaipur", persona: "arjun" },
      { keyword: "Jaipur cold calling script website pitch karna", city: "Jaipur", persona: "arjun" },
      { keyword: "Vaishali Nagar businesses without website Jaipur", city: "Jaipur", persona: "arjun" },
      { keyword: "Jaipur freelancer ka pehla client kaise aaya", city: "Jaipur", persona: "rohit" },
      { keyword: "C-Scheme Jaipur local business website leads", city: "Jaipur", persona: "arjun" },
      { keyword: "Jaipur mein kitne businesses ke paas website nahi hai", city: "Jaipur", persona: "general" },
      { keyword: "how to find web design clients in Mansarovar Jaipur", city: "Jaipur", persona: "arjun" },
      { keyword: "Jaipur salon spa website banana ka kaam", city: "Jaipur", persona: "arjun" },
    ],
  },
  {
    pillar: {
      keyword: "Kota mein website banana ka business kaise shuru kare",
      city: "Kota",
      isPillar: true,
      pillarSlug: "kota-website-business-guide",
    },
    clusters: [
      { keyword: "Kota coaching institutes jinhe website chahiye", city: "Kota", persona: "arjun" },
      { keyword: "Talwandi Kota mein website banana clients", city: "Kota", persona: "arjun" },
      { keyword: "Kota mein freelancing kaise shuru kare after college", city: "Kota", persona: "arjun" },
      { keyword: "Kota ke local businesses without website list", city: "Kota", persona: "arjun" },
      { keyword: "Vigyan Nagar Kota web design clients kaise mile", city: "Kota", persona: "arjun" },
      { keyword: "website banana side income Kota students", city: "Kota", persona: "arjun" },
    ],
  },
  {
    pillar: {
      keyword: "Indore mein web design freelancing se consistent income kaise banaye",
      city: "Indore",
      isPillar: true,
      pillarSlug: "indore-web-design-freelancing-guide",
    },
    clusters: [
      { keyword: "Vijay Nagar Indore businesses without website", city: "Indore", persona: "arjun" },
      { keyword: "Indore mein website banane wale freelancer ko client kaise milta hai", city: "Indore", persona: "arjun" },
      { keyword: "Palasia Indore web design leads kaise nikale", city: "Indore", persona: "arjun" },
      { keyword: "Indore restaurants cafes website banana", city: "Indore", persona: "arjun" },
      { keyword: "AB Road Indore local business website pitch", city: "Indore", persona: "arjun" },
      { keyword: "Indore mein kitna milta hai website banana ka kaam", city: "Indore", persona: "rohit" },
    ],
  },
  {
    pillar: {
      keyword: "Lucknow mein website design ka freelance kaam kaise kare",
      city: "Lucknow",
      isPillar: true,
      pillarSlug: "lucknow-freelance-web-design-guide",
    },
    clusters: [
      { keyword: "Gomti Nagar Lucknow businesses without website", city: "Lucknow", persona: "arjun" },
      { keyword: "Hazratganj Lucknow local business website leads", city: "Lucknow", persona: "arjun" },
      { keyword: "Lucknow mein website banao paisa kamao", city: "Lucknow", persona: "arjun" },
      { keyword: "Alambagh Lucknow web design clients kaise dhundhe", city: "Lucknow", persona: "arjun" },
    ],
  },
  {
    pillar: {
      keyword: "Pune agency ke liye local business leads kaise generate kare",
      city: "Pune",
      isPillar: true,
      pillarSlug: "pune-agency-lead-generation-guide",
    },
    clusters: [
      { keyword: "Baner Pune businesses without website list", city: "Pune", persona: "vikram" },
      { keyword: "Kothrud Pune local business web design leads", city: "Pune", persona: "vikram" },
      { keyword: "Pune agency BD pipeline kaise banaye", city: "Pune", persona: "vikram" },
      { keyword: "Wakad Pune businesses jinhe website chahiye", city: "Pune", persona: "vikram" },
    ],
  },
];

type TopicEntry = {
  keyword: string;
  city: string;
  persona: string;
  pillarSlug: string;
  isPillar?: boolean;
};

// Flatten: pillar first, then all cluster posts, for each city group
const allTopics: TopicEntry[] = [];
for (const cluster of CONTENT_CLUSTERS) {
  allTopics.push({
    keyword: cluster.pillar.keyword,
    city: cluster.pillar.city,
    isPillar: cluster.pillar.isPillar,
    pillarSlug: cluster.pillar.pillarSlug,
    persona: "general",
  });
  for (const post of cluster.clusters) {
    allTopics.push({
      keyword: post.keyword,
      city: post.city,
      persona: post.persona,
      pillarSlug: cluster.pillar.pillarSlug,
    });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-").slice(0, 60);
}

async function getTrendingTopic(): Promise<string | null> {
  try {
    const response = await fetch(
      "https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN",
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const text = await response.text();

    const titles = [...text.matchAll(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/g)]
      .map((m) => m[1])
      .slice(0, 20);

    const relevantKeywords = [
      "freelance", "website", "web design", "web developer",
      "digital marketing", "business", "startup", "income",
      "work from home", "side income", "entrepreneur",
    ];

    const relevant = titles.find((title) =>
      relevantKeywords.some((kw) => title.toLowerCase().includes(kw))
    );

    if (relevant) {
      return `${relevant} for web designers in India`;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Route Handler ─────────────────────────────────────────────────────────────

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
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const date = new Date().toISOString().split("T")[0];

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const hour = new Date().getUTCHours();
    const topicOffset = hour < 12 ? 0 : Math.floor(allTopics.length / 2);
    const scheduledTopic = allTopics[(dayOfYear + topicOffset) % allTopics.length];

    const trendingTopic = await getTrendingTopic();
    console.log("Topic source:", trendingTopic ? "trending" : "scheduled");

    const keyword = trendingTopic ?? scheduledTopic.keyword;

    const POST_FORMATS = [
      {
        name: "story",
        instruction: `Write this as a real story. Open with a specific scene — a person in ${scheduledTopic.city} doing something frustrating related to finding clients. Give the person a name. Make it feel like you witnessed this. Then reveal the insight or solution halfway through. No listicles. Pure narrative with one lesson at the end.`,
      },
      {
        name: "numbers",
        instruction: `This post is data-driven. Lead with a surprising, specific number about ${scheduledTopic.city} — businesses, population, how many lack websites, rupee amounts. Every claim should have a number attached to it. 'Most businesses' becomes '7 out of 10 businesses in ${scheduledTopic.city}'. Make the reader feel like they are reading research, not an opinion piece.`,
      },
      {
        name: "mistake",
        instruction: `This post is about a specific mistake that ${scheduledTopic.city} freelancers make. Open with the mistake directly — no buildup. Explain exactly why it happens, what it costs, and what to do instead. Be harsh. Take a strong position. Do not hedge or say 'it depends'.`,
      },
      {
        name: "script",
        instruction: `This post is a practical script or template. The entire value is something the reader can copy and use today in ${scheduledTopic.city}. A cold call script. A WhatsApp message template. A pitch for a specific business type. Explain when to use it, why each line works, and what to say if the person says no. Keep the intro very short — get to the script fast.`,
      },
      {
        name: "myth",
        instruction: `This post busts a specific myth that ${scheduledTopic.city} freelancers believe. State the myth in the title or first line. Then systematically take it apart with specific examples from ${scheduledTopic.city}. End with what is actually true and what to do instead. Be direct and slightly provocative.`,
      },
      {
        name: "comparison",
        instruction: `This post compares two approaches to the same problem — the way most ${scheduledTopic.city} freelancers do it vs a better way. Use a clear before/after or old way/new way structure. Include real rupee numbers for both approaches. The reader should finish knowing exactly which approach to switch to and why.`,
      },
    ];

    const formatIndex = (dayOfYear + (hour < 12 ? 0 : 3)) % POST_FORMATS.length;
    const todaysFormat = POST_FORMATS[formatIndex];

    const timeSlot = hour < 12 ? "am" : "pm";
    const slug = slugify(keyword) + "-" + timeSlot;

    const db = adminDb();
    const existing = await db.collection("blog_posts").doc(slug).get();
    if (existing.exists) {
      return NextResponse.json({ message: "Already generated today" });
    }

    const systemPrompt = `You are a friendly Indian freelancer who made it work. You write for other Indian freelancers who are struggling. Your writing style is simple. Very simple. Like you are talking to a 12-year-old.

SIMPLE ENGLISH RULES — follow every single one:
1. Use short words. Say "use" not "utilize". Say "help" not "leverage". Say "get" not "obtain".
1b. Use the words people actually use in India. Say "website banana" or "website banao" when writing for Hindi-speaking readers. Say "make a website" not "design a website". Say "earn money" not "generate revenue". Say "get clients" not "acquire customers". Say "local shop" or "dukan" not "SMB" or "small business enterprise". Say "call karke pitch karo" for the Hindi audience posts. Match the language of the keyword — if the keyword has Hindi words, the post should mix Hindi and English naturally the way your reader actually talks.
2. Keep sentences short. Maximum 15 words per sentence most of the time.
3. Write like you talk. Casual. Friendly. Real.
4. If a 12-year-old would not understand a word, replace it with a simpler word.
5. Never use em dashes.
6. Never write "In conclusion", "To summarize", "It is worth noting", "Furthermore", "Moreover", "Additionally", "Delve", "Leverage", "Utilize", "Comprehensive", "In today's digital landscape".
7. Mix short and long sentences. Very short. Then one that explains it a bit more. Short again.
8. Use real rupee numbers. Like ₹499, ₹15,000, ₹28,000. Make it feel real.
9. Use real Indian city names. Real business types.
10. Use contractions always: don't, can't, you're, it's, won't, they're.
11. No bullet lists unless truly needed. Write in paragraphs.
12. Have one strong opinion. Take a side. Be direct.
13. Mention LocalLeads (localleads.sahajta.com) once or twice as a tool you have seen people use. Not as an ad. Like a friend recommending it.
14. Every post must give one thing the reader can DO TODAY. A real script. A real price. A real step.
15. The reader should feel they got so much value that they want to bookmark the post.
16. Never write a conclusion paragraph. End on the most useful line.
17. Write 1200 to 1500 words. Not more. Not less.
18. Use H1 for title. H2 for sections. Short section titles.
19. Write the current date naturally in the article. Example: "As of May 2026, most salons in Jaipur..."
20. Include this exact line somewhere naturally: "Questions? Email hello@sahajta.com and someone will actually reply."
21. You are writing as Pranamya, a Bangalore-based AI founder who grew up understanding the struggles of tier 2 city freelancers. Write from this perspective. First person where natural. Not corporate.
22. Every post must include ONE real data point or number that feels researched. Example: 'There are over 4,000 restaurants in Jaipur according to Google Maps. Less than 30% have a working website.' Make up a plausible, specific number like this. It makes the post feel researched and authoritative.
23. Every post must link to the pillar page of its cluster using markdown: '[Complete guide to web design freelancing in ${scheduledTopic.city}](https://localleads.sahajta.com/blog/${scheduledTopic.pillarSlug})' Include this naturally somewhere in the middle of the post.
24. Every post must have a 'Related Articles' section at the very end before the sign-off. Format it as:
## Aur padhne ke liye
- Link to 2 other posts from the same city cluster
Use these placeholder links for now:
[Jaipur mein cold calling script](https://localleads.sahajta.com/blog)
[Jaipur ke restaurants ko website kaise becho](https://localleads.sahajta.com/blog)
25. The meta description (first 155 characters of the post body, before the first H2) must naturally contain the target keyword.
26. The H1 title MUST start with the city name or contain it within the first 3 words.
Good: 'Jaipur mein website banana: 2026 guide'
Good: 'Kota freelancers ke liye client dhundne ka tarika'
Bad: 'How to find clients as a web designer in India'
Bad: 'Website banana ka business kaise shuru kare'
The city must be the very first thing Google reads in your title. Non-negotiable.
27. Every post must feel like a DIFFERENT type of article. You will be told which format to use in the user prompt. Follow it exactly.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `FORMAT FOR THIS POST: ${todaysFormat.name}
${todaysFormat.instruction}

This format overrides default structure. Follow it. The post should feel unmistakably like a '${todaysFormat.name}' post, not a generic blog post that happens to mention ${scheduledTopic.city}.

Write a blog post targeting: "${keyword}".
City focus: ${scheduledTopic.city}.
Today's date: ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}.
Target reader: Indian web freelancer trying to find clients.

The H1 title must start with '${scheduledTopic.city}' or have it within the first 3 words. Put the city first. Always.

This post is part of the '${scheduledTopic.city} web design freelancing' content cluster.
The pillar page for this cluster is at:
https://localleads.sahajta.com/blog/${scheduledTopic.pillarSlug}

Link to it naturally once in the article body.
Include a 'Aur padhne ke liye' section at the end.

The post must:
- Use Grade 3 English. Short words. Short sentences.
- Include today's date naturally in the article body
- Give one specific script or action they can do today
- Mention LocalLeads once as a tool recommendation
- Include "Questions? Email hello@sahajta.com and someone will actually reply." naturally in the post
- 1200-1500 words exactly
- H1 title first line, then H2 sections

Naturally link to these LocalLeads pages where relevant (use markdown links):
- [LocalLeads](https://localleads.sahajta.com) when mentioning the tool
- [free trial](https://localleads.sahajta.com/auth) when mentioning trying it free
- [pricing](https://localleads.sahajta.com/pricing) when mentioning ₹499 or cost

If the keyword contains Hindi or Hinglish words, write the post in Hinglish — mix Hindi and English the way a 22-year-old in Jaipur would actually talk. Example: "Yaar, 5 ghante Google Maps pe waste mat karo. LocalLeads try karo — 10 minute mein 500 leads nikal." If the keyword is fully in English, write in simple English only.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content || "";
    const lines = content.split("\n");
    const title = lines[0].replace(/^#+\s*/, "").trim();
    const body = lines.slice(1).join("\n").trim();

    const wordCount = body.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    const readingTime = `${readingTimeMinutes} min read`;

    const postDescription = `${title.replace(/"/g, "'")} — practical guide for Indian web freelancers.`;

    await db.collection("blog_posts").doc(slug).set({
      title: title.replace(/"/g, "'"),
      date,
      slug,
      keyword,
      city: scheduledTopic.city,
      persona: scheduledTopic.persona,
      pillarSlug: scheduledTopic.pillarSlug,
      isPillar: scheduledTopic.isPillar || false,
      description: postDescription,
      content: body,
      createdAt: new Date(),
      wordCount,
      readingTime,
      schemaMarkup: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title.replace(/"/g, "'"),
        "datePublished": date,
        "dateModified": date,
        "author": {
          "@type": "Organization",
          "name": "LocalLeads",
          "url": "https://localleads.sahajta.com",
        },
        "publisher": {
          "@type": "Organization",
          "name": "LocalLeads by Sahajta AI",
          "url": "https://localleads.sahajta.com",
        },
        "description": postDescription,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://localleads.sahajta.com/blog/${slug}`,
        },
      }),
    });

    // Fire and forget — don't await
    // Notification failure must not fail blog creation
    notifySubscribers(db, title.replace(/"/g, "'"), slug, postDescription)
      .catch((err) => {
        console.error("Subscriber notification failed:", err);
      });

    return NextResponse.json({
      message: "Blog post generated",
      slug,
      title,
      date,
      topicSource: trendingTopic ? "trending" : "scheduled",
      pillarSlug: scheduledTopic.pillarSlug,
      isPillar: scheduledTopic.isPillar || false,
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error("Blog generation failed:", err);
    return NextResponse.json({ error: "Blog generation failed" }, { status: 500 });
  }
}
