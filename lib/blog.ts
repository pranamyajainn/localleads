import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  city: string;
  keyword: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  return files.map((filename) => {
    const filepath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filepath, "utf8");
    const { data, content } = matter(raw);

    return {
      slug: data.slug || filename.replace(".md", ""),
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      city: data.city || "",
      keyword: data.keyword || "",
      content,
    };
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  const processed = await remark().use(html).process(post.content);
  return { ...post, content: processed.toString() };
}
