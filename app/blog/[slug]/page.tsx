import { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | LocalLeads Blog`,
    description: post.description,
    alternates: { canonical: `https://localleads.sahajta.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://localleads.sahajta.com/blog/${post.slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#EDEDED" }}>
      <nav style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#EDEDED", textDecoration: "none" }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </Link>
        <Link href="/auth" style={{ background: "#22C55E", color: "#000", padding: "10px 20px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
          Try Free
        </Link>
      </nav>

      <article style={{ padding: "60px 40px 80px", maxWidth: 680, margin: "0 auto" }}>
        <Link href="/blog" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#333", textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
          ← Back to blog
        </Link>

        <p style={{
          fontFamily: "sans-serif", fontSize: 11,
          fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "#22C55E",
          margin: "0 0 16px",
        }}>
          {post.city} · {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(26px, 4vw, 42px)",
          fontWeight: 700, color: "#EDEDED",
          margin: "0 0 40px", lineHeight: 1.2,
          letterSpacing: "-0.025em",
        }}>
          {post.title}
        </h1>

        <div
          style={{ fontFamily: "sans-serif", fontSize: 17, lineHeight: 1.8, color: "#888" }}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div style={{
          marginTop: 60,
          padding: "28px 32px",
          border: "1px solid rgba(34,197,94,0.25)",
          background: "rgba(34,197,94,0.04)",
        }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, color: "#22C55E", margin: "0 0 8px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Found this useful?
          </p>
          <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#666", lineHeight: 1.7, margin: "0 0 16px" }}>
            LocalLeads finds businesses in your city with no website — business name, live phone number, Google Maps link. 20 free leads, no card needed.
          </p>
          <Link href="/auth" style={{ display: "inline-block", background: "#22C55E", color: "#000", padding: "12px 24px", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Get 20 Free Leads →
          </Link>
        </div>
      </article>

      <footer style={{
        padding: "24px 40px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: "#EDEDED" }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </span>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#2E2E2E" }}>
          © 2026 Sahajta AI Solutions Pvt. Ltd.
        </span>
      </footer>
    </main>
  );
}
