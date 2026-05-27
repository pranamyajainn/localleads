import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — LocalLeads",
  description:
    "Practical guides for Indian freelancers and web designers on finding clients, cold outreach, pricing websites, and building a consistent income.",
  alternates: { canonical: "https://localleads.sahajta.com/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

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

      <section style={{ padding: "60px 40px", maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 700, color: "#EDEDED",
          margin: "0 0 12px", letterSpacing: "-0.025em",
        }}>
          For Indian freelancers who want paying clients.
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: 16, color: "#555", lineHeight: 1.7, margin: "0 0 48px" }}>
          Practical guides on finding clients, cold outreach, pricing, and building a consistent web design income in India.
        </p>

        {posts.length === 0 ? (
          <p style={{ fontFamily: "sans-serif", fontSize: 16, color: "#444" }}>
            First post coming soon.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  background: "#080808",
                  padding: "28px 32px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <p style={{
                  fontFamily: "sans-serif", fontSize: 11,
                  fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#22C55E",
                  margin: "0 0 10px",
                }}>
                  {post.city} · {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h2 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  fontWeight: 700, color: "#EDEDED",
                  margin: "0 0 8px", lineHeight: 1.3,
                  letterSpacing: "-0.015em",
                }}>
                  {post.title}
                </h2>
                <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#444", margin: 0, lineHeight: 1.6 }}>
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

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
