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

  // Hinglish and natural Indian search terms — Jaipur
  { keyword: "Jaipur mein website banana ka kaam", city: "Jaipur", persona: "arjun" },
  { keyword: "website banao paisa kamao Jaipur", city: "Jaipur", persona: "arjun" },
  { keyword: "Jaipur mein website banane wala freelancer", city: "Jaipur", persona: "arjun" },
  { keyword: "local shop website banana Jaipur", city: "Jaipur", persona: "arjun" },
  { keyword: "website banana kaise sikhe Jaipur", city: "Jaipur", persona: "arjun" },

  // Natural Indian English — how people actually type
  { keyword: "how to make website for local business in Jaipur", city: "Jaipur", persona: "arjun" },
  { keyword: "website making freelance work in Jaipur", city: "Jaipur", persona: "arjun" },
  { keyword: "how to make websites and earn money in India", city: "Jaipur", persona: "arjun" },
  { keyword: "website banana ke liye client kaise dhundhe", city: "Jaipur", persona: "arjun" },
  { keyword: "website banane ka business kaise shuru kare", city: "Indore", persona: "arjun" },

  // Kota — student audience
  { keyword: "Kota mein website banana ka kaam", city: "Kota", persona: "arjun" },
  { keyword: "website making side income Kota", city: "Kota", persona: "arjun" },
  { keyword: "after coaching website banana ka kaam Kota", city: "Kota", persona: "arjun" },

  // General Indian natural search
  { keyword: "ghar baithe website banao paise kamao", city: "Indore", persona: "arjun" },
  { keyword: "website banana ka business India", city: "Indore", persona: "arjun" },
  { keyword: "chhoti dukan ke liye website banana", city: "Jaipur", persona: "arjun" },
  { keyword: "bina degree website bana ke paisa kamao", city: "Lucknow", persona: "arjun" },
  { keyword: "website making se paise kaise kamaye", city: "Bhopal", persona: "arjun" },
  { keyword: "local business ko website kaise becho", city: "Jaipur", persona: "arjun" },
  { keyword: "restaurant ke liye website banana Jaipur", city: "Jaipur", persona: "general" },
  { keyword: "salon ke liye website banana India", city: "Indore", persona: "general" },
  { keyword: "doctor clinic website banana India", city: "Jaipur", persona: "general" },
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
  const hour = new Date().getUTCHours();
  const topicOffset = hour < 12 ? 0 : 16;
  const scheduledTopic = KEYWORD_TOPICS[
    (dayOfYear + topicOffset) % KEYWORD_TOPICS.length
  ];

  const trendingTopic = await getTrendingTopic();
  console.log("Topic source:", trendingTopic ? "trending" : "scheduled");

  const keyword = trendingTopic ?? scheduledTopic.keyword;
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
20. Include this exact line somewhere naturally: "Questions? Email hello@sahajta.com and someone will actually reply."`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Write a blog post targeting: "${keyword}".
City focus: ${scheduledTopic.city}.
Today's date: ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}.
Target reader: Indian web freelancer trying to find clients.

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
        "url": "https://localleads.sahajta.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "LocalLeads by Sahajta AI",
        "url": "https://localleads.sahajta.com"
      },
      "description": title.replace(/"/g, "'") + " — practical guide for Indian web freelancers.",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://localleads.sahajta.com/blog/${slug}`
      }
    }),
  });

  return NextResponse.json({
    message: "Blog post generated",
    slug,
    title,
    date,
    topicSource: trendingTopic ? "trending" : "scheduled",
  });
}
