import { adminDb } from "@/lib/firebaseAdmin";
import { remark } from "remark";
import html from "remark-html";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  city: string;
  keyword: string;
  content: string;
  readingTime?: string;
  wordCount?: number;
  schemaMarkup?: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const db = adminDb();
    const snapshot = await db
      .collection("blog_posts")
      .orderBy("date", "desc")
      .limit(50)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        slug: data.slug || doc.id,
        title: data.title || "",
        date: data.date || "",
        description: data.description || "",
        city: data.city || "",
        keyword: data.keyword || "",
        content: data.content || "",
        readingTime: data.readingTime,
        wordCount: data.wordCount,
        schemaMarkup: data.schemaMarkup,
      };
    });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = adminDb();
    const doc = await db.collection("blog_posts").doc(slug).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    const post: BlogPost = {
      slug: data.slug || doc.id,
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      city: data.city || "",
      keyword: data.keyword || "",
      content: data.content || "",
      readingTime: data.readingTime,
      wordCount: data.wordCount,
      schemaMarkup: data.schemaMarkup,
    };

    const processed = await remark().use(html).process(post.content);
    return { ...post, content: processed.toString() };
  } catch {
    return null;
  }
}
