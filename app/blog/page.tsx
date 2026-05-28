import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import NewsletterForm from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — LocalLeads",
  description:
    "Practical guides for Indian freelancers and web designers on finding clients, cold outreach, pricing websites, and building a consistent income.",
  alternates: { canonical: "https://localleads.sahajta.com/blog" },
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  // Helper to calculate reading time
  const getReadingTime = (content: string): string => {
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.max(3, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <main className="blog-glow-container" style={{ minHeight: "100vh", color: "#EDEDED" }}>
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
          <Link href="/blog" className="nav-link active" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 500, color: "var(--color-gold)" }}>Blog</Link>
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

      {/* ── Blog Main Content ──────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 40px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.15em",
            color: "var(--color-gold)",
            textTransform: "uppercase",
            display: "inline-block",
            marginBottom: 12,
            background: "rgba(255, 230, 93, 0.05)",
            border: "1px solid rgba(255, 230, 93, 0.15)",
            padding: "4px 12px",
            borderRadius: 20
          }}>
            RESOURCES & GUIDES
          </span>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700, color: "#EDEDED",
            margin: "0 0 16px", letterSpacing: "-0.03em",
            lineHeight: 1.05
          }}>
            Get shop owners to pay you for websites.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#888", lineHeight: 1.7, margin: 0, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
            Simple steps to scan local shops, pitch owners, and scale your freelance agency in India.
          </p>
        </div>

        {posts.length === 0 ? (
          <div style={{
            padding: "80px 40px",
            textAlign: "center",
            background: "rgba(255,255,255,0.01)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 28,
            backdropFilter: "blur(12px)"
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" style={{ marginBottom: 20, opacity: 0.8 }}>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: "#EDEDED", margin: "0 0 8px" }}>
              Guides are coming soon!
            </h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#666", maxWidth: 400, margin: "0 auto" }}>
              We are currently drafting practical strategies. Enter your email below to be notified when the first guide drops.
            </p>
          </div>
        ) : (
          <>
            {/* ── Featured Post Card ────────────────────────────────────────── */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="blog-featured-card">
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", gap: 20 }}>
                  <div>
                    <span style={{
                      fontFamily: "var(--font-sans)", fontSize: 10,
                      fontWeight: 800, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "var(--color-gold)",
                      background: "rgba(255, 230, 93, 0.08)",
                      padding: "4px 10px", borderRadius: 12,
                      display: "inline-block", marginBottom: 16
                    }}>
                      FEATURED ARTICLE
                    </span>
                    <h2 style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(22px, 3vw, 32px)",
                      fontWeight: 700, color: "#EDEDED",
                      margin: "0 0 12px", lineHeight: 1.25,
                      letterSpacing: "-0.02em"
                    }}>
                      {featuredPost.title}
                    </h2>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#888", margin: 0, lineHeight: 1.65 }}>
                      {featuredPost.description}
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", fontSize: 12, color: "#555" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#777" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {getReadingTime(featuredPost.content)}
                    </span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#777" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {featuredPost.city}
                    </span>
                    <span>•</span>
                    <span style={{ color: "#555" }}>
                      {new Date(featuredPost.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Right Side Visual Decorator */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(255, 230, 93, 0.08) 0%, rgba(255, 230, 93, 0.01) 100%)",
                  border: "1px solid rgba(255, 230, 93, 0.1)",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  minHeight: 200,
                  overflow: "hidden"
                }}>
                  <div style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 16,
                    width: "80%",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    transform: "rotate(-2deg)",
                    zIndex: 1
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                      <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 6, marginLeft: 8 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ height: 14, width: "70%", background: "var(--color-gold)", opacity: 0.8, borderRadius: 4 }} />
                      <div style={{ height: 8, width: "100%", background: "rgba(255,255,255,0.15)", borderRadius: 3 }} />
                      <div style={{ height: 8, width: "85%", background: "rgba(255,255,255,0.15)", borderRadius: 3 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                        <div style={{ height: 18, width: 75, background: "rgba(255, 230, 93, 0.1)", border: "1px solid rgba(255, 230, 93, 0.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--color-gold)", fontWeight: 700 }}>
                          NO WEBSITE
                        </div>
                        <div style={{ height: 18, width: 40, background: "rgba(255,255,255,0.05)", borderRadius: 10 }} />
                      </div>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,93,0.1) 0%, transparent 70%)", top: "-40px", right: "-40px" }} />
                </div>
              </Link>
            )}

            {/* ── Subtitle for Grid ─────────────────────────────────────────── */}
            {gridPosts.length > 0 && (
              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                fontWeight: 700,
                color: "#EDEDED",
                margin: "0 0 28px",
                letterSpacing: "-0.015em"
              }}>
                All Guides & Case Studies
              </h2>
            )}

            {/* ── Blog Grid ─────────────────────────────────────────────────── */}
            <div className="blog-grid">
              {gridPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                >
                  <div style={{ marginBottom: 28 }}>
                    <p style={{
                      fontFamily: "var(--font-sans)", fontSize: 10,
                      fontWeight: 700, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "var(--color-gold)",
                      margin: "0 0 12px",
                    }}>
                      {post.city}
                    </p>
                    <h3 style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "20px",
                      fontWeight: 700, color: "#EDEDED",
                      margin: "0 0 8px", lineHeight: 1.35,
                      letterSpacing: "-0.015em",
                    }}>
                      {post.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "#888", margin: 0, lineHeight: 1.6 }}>
                      {post.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 11, color: "#555", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#777" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {getReadingTime(post.content)}
                    </span>
                    <span>•</span>
                    <span style={{ color: "#666" }}>
                      {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ── Newsletter Section ───────────────────────────────────────────── */}
        <div className="newsletter-card">
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 10,
            fontWeight: 800, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "var(--color-gold)",
            display: "inline-block", marginBottom: 12
          }}>
            STAY AHEAD
          </span>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 700, color: "#EDEDED", margin: "0 0 8px",
            letterSpacing: "-0.02em"
          }}>
            Get client acquisition guides in your inbox.
          </h2>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: 14.5,
            color: "#888", margin: "0 auto", maxWidth: 500, lineHeight: 1.6
          }}>
            No spam. Just practical freelance strategies, cold calling templates, and pricing tips sent twice a month.
          </p>

          <NewsletterForm />
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        flexWrap: "wrap",
        maxWidth: 1000,
        margin: "0 auto",
        fontSize: 12,
        color: "#555"
      }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700, color: "#EDEDED" }}>
          Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
        </span>
        <div style={{ display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
          <Link href="/" className="footer-link" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
          <Link href="/privacy" className="footer-link" style={{ color: "#888", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/refund" className="footer-link" style={{ color: "#888", textDecoration: "none" }}>Refund Policy</Link>
        </div>
        <p style={{ margin: 0 }}>
          © 2026 Sahajta AI Solutions Pvt. Ltd. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
