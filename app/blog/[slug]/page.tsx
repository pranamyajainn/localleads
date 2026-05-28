import { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { BlogCTAButton } from "@/components/BlogCTAButton";

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

  // Helper to calculate reading time
  const getReadingTime = (content: string): string => {
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.max(3, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  // Load other posts for the recommended section
  const allPosts = await getAllPosts();
  const recommendedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <main className="blog-glow-container" style={{ minHeight: "100vh", color: "#EDEDED" }}>
      {post.schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.schemaMarkup }}
        />
      )}

      {/* ── Synced Nav ─────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky", top: 0, left: 0, right: 0, zIndex: 100,
          height: 80,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,11,0.92)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", color: "#EDEDED" }}>
            Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/blog" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 500 }}>Blog</Link>
          <Link
            href="/auth"
            style={{
              background: "var(--color-gold)", color: "#0A0A0B",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
              padding: "10px 22px", borderRadius: 30, textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            Start a free trial
          </Link>
        </div>
      </nav>

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <article style={{ padding: "60px 24px 80px", maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Back Link */}
        <Link href="/blog" className="blog-back-link" style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "#888",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 36,
        }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to blog
        </Link>

        {/* Article Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 10,
            fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--color-gold)",
            background: "rgba(255, 230, 93, 0.08)",
            padding: "3px 8px", borderRadius: 8,
          }}>
            {post.city}
          </span>
          <span style={{ color: "#555", fontSize: 12 }}>•</span>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 12,
            color: "#666", fontWeight: 500
          }}>
            {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span style={{ color: "#555", fontSize: 12 }}>•</span>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 12,
            color: "#666", display: "inline-flex", alignItems: "center", gap: 4
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {getReadingTime(post.content)}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 4.5vw, 44px)",
          fontWeight: 700, color: "#EDEDED",
          margin: "0 0 32px", lineHeight: 1.15,
          letterSpacing: "-0.025em",
        }}>
          {post.title}
        </h1>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 40 }} />

        {/* HTML Rich Body Content */}
        <div
          style={{ fontFamily: "var(--font-sans)", fontSize: 17, lineHeight: 1.8, color: "#9E9E9E" }}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── Bottom Call-To-Action Box ────────────────────────────────────── */}
        <div style={{
          marginTop: 64,
          padding: "44px 36px",
          border: "1px solid rgba(255,230,93,0.22)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.015) 0%, rgba(255, 230, 93, 0.01) 100%)",
          borderRadius: 28,
          backdropFilter: "blur(16px)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ 
              fontFamily: "var(--font-sans)", 
              fontSize: 10, 
              fontWeight: 800, 
              color: "var(--color-gold)", 
              margin: "0 0 8px", 
              letterSpacing: "0.12em", 
              textTransform: "uppercase",
              display: "inline-block"
            }}>
              GROW YOUR FREELANCE BUSINESS
            </span>
            <h3 style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "24px", 
              fontWeight: 700, 
              color: "#EDEDED", 
              margin: "0 0 12px", 
              letterSpacing: "-0.01em" 
            }}>
              Want to find local shops that need websites?
            </h3>
            <p style={{ 
              fontFamily: "var(--font-sans)", 
              fontSize: 14.5, 
              color: "#8C8C8C", 
              lineHeight: 1.65, 
              margin: "0 0 24px",
              maxWidth: 540
            }}>
              Our scan tool searches Google Maps to find shops that do not have websites. You get their exact names, locations, and direct phone numbers instantly.
            </p>
            <BlogCTAButton />
          </div>
          {/* Subtle gradient blob behind card */}
          <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,93,0.05) 0%, transparent 70%)", bottom: "-60px", right: "-60px" }} />
        </div>

        {/* ── Related / Recommended Posts ─────────────────────────────────── */}
        {recommendedPosts.length > 0 && (
          <div style={{ marginTop: 80, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 56 }}>
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              fontWeight: 700,
              color: "#EDEDED",
              margin: "0 0 28px",
              letterSpacing: "-0.01em"
            }}>
              More Guides You Might Like
            </h3>
            
            <div className="blog-grid" style={{ marginBottom: 0 }}>
              {recommendedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                  style={{ padding: "28px" }}
                >
                  <div>
                    <span style={{
                      fontFamily: "var(--font-sans)", fontSize: 9,
                      fontWeight: 700, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "var(--color-gold)",
                      display: "inline-block", marginBottom: 10
                    }}>
                      {post.city}
                    </span>
                    <h4 style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "17px",
                      fontWeight: 700, color: "#EDEDED",
                      margin: "0 0 8px", lineHeight: 1.35,
                      letterSpacing: "-0.01em"
                    }}>
                      {post.title}
                    </h4>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#888", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        flexWrap: "wrap",
        maxWidth: 720,
        margin: "0 auto",
        fontSize: 12,
        color: "#555",
        position: "relative",
        zIndex: 1
      }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "#EDEDED" }}>
          Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
        </span>
        <div style={{ display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
          <Link href="/" className="footer-link" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
          <Link href="/blog" className="footer-link" style={{ color: "#888", textDecoration: "none" }}>Blog</Link>
          <Link href="/privacy" className="footer-link" style={{ color: "#888", textDecoration: "none" }}>Privacy Policy</Link>
        </div>
        <p style={{ margin: 0 }}>
          © 2026 Sahajta AI Solutions Pvt. Ltd. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
