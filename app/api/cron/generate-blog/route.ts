import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { adminDb } from "@/lib/firebaseAdmin";

const KEYWORD_TOPICS = [
  { keyword: "how to find clients as a web designer in India", city: "Indore", persona: "arjun" },
  { keyword: "how to cold call local businesses for website projects", city: "Jaipur", persona: "arjun" },
  { keyword: "how to make money web design India without experience", city: "Lucknow", persona: "arjun" },
  { keyword: "how to get first web design client India", city: "Bhopal", persona: "arjun" },
  { keyword: "how to find businesses without website near me India", city: "Nagpur", persona: "arjun" },
  { keyword: "how much to charge for website in India", city: "Surat", persona: "arjun" },
  { keyword: "freelance web design income India tier 2 city", city: "Coimbatore", persona: "arjun" },
  { keyword: "how to pitch website to local business India", city: "Patna", persona: "arjun" },
  { keyword: "google maps lead generation for freelancers India", city: "Varanasi", persona: "arjun" },
  { keyword: "how to escape job and become freelancer India", city: "Indore", persona: "arjun" },
  { keyword: "how to get web design clients while working full time", city: "Kochi", persona: "priya" },
  { keyword: "how to build freelance pipeline alongside day job India", city: "Chennai", persona: "priya" },
  { keyword: "how to quit job and freelance web design India", city: "Bangalore", persona: "priya" },
  { keyword: "finding local business leads for web design India", city: "Hyderabad", persona: "priya" },
  { keyword: "how to charge premium for websites in South India", city: "Kochi", persona: "priya" },
  { keyword: "web design outreach that doesn't feel like spam", city: "Chennai", persona: "priya" },
  { keyword: "why am I not getting web design clients India", city: "Jaipur", persona: "rohit" },
  { keyword: "how to get consistent clients as web designer India", city: "Jaipur", persona: "rohit" },
  { keyword: "freelancing not working what to do India", city: "Jaipur", persona: "rohit" },
  { keyword: "how to find no website businesses to pitch India", city: "Jaipur", persona: "rohit" },
  { keyword: "how to scale digital agency India", city: "Pune", persona: "vikram" },
  { keyword: "lead generation for digital agencies India", city: "Pune", persona: "vikram" },
  { keyword: "how to build client pipeline for web agency India", city: "Bangalore", persona: "vikram" },
  { keyword: "outbound sales for web design agency India", city: "Hyderabad", persona: "vikram" },
  { keyword: "best cities for web design freelancing India", city: "Mumbai", persona: "general" },
  { keyword: "how many businesses in India don't have a website", city: "Delhi", persona: "general" },
  { keyword: "website pricing guide India 2025", city: "Mumbai", persona: "general" },
  { keyword: "cold outreach script for website sales India", city: "Delhi", persona: "general" },
  { keyword: "how to sell websites to restaurants India", city: "Bangalore", persona: "general" },
  { keyword: "how to sell websites to CA firms India", city: "Mumbai", persona: "general" },
  { keyword: "how to sell websites to salons India", city: "Pune", persona: "general" },
  { keyword: "how to sell websites to gyms India", city: "Hyderabad", persona: "general" },
];

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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const date = new Date().toISOString().split("T")[0];

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const scheduledTopic = KEYWORD_TOPICS[dayOfYear % KEYWORD_TOPICS.length];

  const trendingTopic = await getTrendingTopic();
  console.log("Topic source:", trendingTopic ? "trending" : "scheduled");

  const keyword = trendingTopic ?? scheduledTopic.keyword;
  const slug = slugify(keyword);

  const db = adminDb();
  const existing = await db.collection("blog_posts").doc(slug).get();
  if (existing.exists) {
    return NextResponse.json({ message: "Already generated today" });
  }

  const systemPrompt = `You are a no-nonsense Indian freelancing expert who has been in the web design trenches for years. You write for other Indian freelancers — mostly guys in tier 2 cities like Indore, Jaipur, Lucknow who are trying to make freelancing work.

STRICT WRITING RULES — follow every single one:
1. Never use em dashes. Not once.
2. Never start a sentence with "In conclusion", "To summarize", "It's worth noting", "Delve", "Leverage", "Utilize", "Furthermore", "Moreover", "Additionally"
3. Vary sentence length constantly. Mix very short sentences with longer ones. Two words. Then a longer explanation that goes into detail. Then short again.
4. Use real rupee numbers. Real city names. Real business types in India.
5. Write like you are talking to a friend who is struggling. Conversational. Honest.
6. Include one strong opinion that takes a clear side. Don't be neutral.
7. Use contractions: don't, can't, won't, you're, it's
8. No bullet point lists unless absolutely necessary. Write in paragraphs.
9. Mention LocalLeads naturally once or twice as a tool you've seen people use — not as an advertisement.
10. Each post must have a specific, actionable section where the reader learns something real.
11. Write 1200-1500 words.
12. Format: H1 title, then sections with H2 subheadings.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Write a blog post targeting: "${keyword}". City focus: ${scheduledTopic.city}. Include a LocalLeads mention naturally.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const content = completion.choices[0].message.content || "";
  const lines = content.split("\n");
  const title = lines[0].replace(/^#+\s*/, "").trim();
  const body = lines.slice(1).join("\n").trim();

  await db.collection("blog_posts").doc(slug).set({
    title: title.replace(/"/g, "'"),
    date,
    slug,
    keyword,
    city: scheduledTopic.city,
    persona: scheduledTopic.persona,
    description: `${title.replace(/"/g, "'")} — practical guide for Indian web freelancers.`,
    content: body,
    createdAt: new Date(),
  });

  return NextResponse.json({
    message: "Blog post generated",
    slug,
    title,
    date,
    topicSource: trendingTopic ? "trending" : "scheduled",
  });
}
