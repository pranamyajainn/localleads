import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Businesses Without Website in Surat — LocalLeads",
  description:
    "LocalLeads finds local businesses in Surat with a phone number and no website. Get 20 free leads in minutes — no credit card needed. Used by web freelancers across Surat.",
  alternates: {
    canonical: "https://localleads.sahajta.com/surat",
  },
  openGraph: {
    title: "Find Businesses Without Website in Surat — LocalLeads",
    description:
      "Scan Google Maps for Surat businesses with no website. Free trial, no card.",
    url: "https://localleads.sahajta.com/surat",
  },
};

export default function CityPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#EDEDED" }}>

      {/* Nav */}
      <nav style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Link href="/" style={{
          fontFamily: "Georgia, serif",
          fontSize: 20, fontWeight: 700,
          color: "#EDEDED", textDecoration: "none",
          letterSpacing: "-0.01em",
        }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </Link>
        <Link href="/auth" style={{
          background: "#22C55E", color: "#000",
          padding: "10px 20px", fontFamily: "sans-serif",
          fontSize: 14, fontWeight: 700,
          textDecoration: "none",
        }}>
          Try Free
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 40px 60px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{
          fontFamily: "sans-serif", fontSize: 11,
          fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#22C55E",
          marginBottom: 20,
        }}>
          Surat · Lead Generation
        </p>
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(32px, 5vw, 60px)",
          fontWeight: 700, lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: "#EDEDED", margin: "0 0 28px",
        }}>
          Find businesses in Surat
          <br />
          <span style={{ color: "#22C55E" }}>with no website.</span>
        </h1>
        <p style={{
          fontFamily: "sans-serif", fontSize: 17,
          color: "#666", lineHeight: 1.8,
          margin: "0 0 16px", maxWidth: 580,
        }}>
          Surat&apos;s textile traders, diamond merchants, restaurants, and local shops are on Google Maps — many with no website. LocalLeads finds them by area and category in minutes.
        </p>
        <p style={{
          fontFamily: "sans-serif", fontSize: 16,
          color: "#555", lineHeight: 1.8,
          margin: "0 0 40px", maxWidth: 580,
        }}>
          LocalLeads scans Google Maps in real time and shows you every business in Surat with a live phone number and no website. Not a cached list. Live data — with a Google Maps verification link on every lead.
        </p>
        <Link href="/auth" style={{
          display: "inline-block",
          background: "#22C55E", color: "#000",
          padding: "16px 32px",
          fontFamily: "sans-serif", fontSize: 15,
          fontWeight: 700, textDecoration: "none",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          Get 20 Free Surat Leads →
        </Link>
        <p style={{
          fontFamily: "sans-serif", fontSize: 12,
          color: "#333", marginTop: 12,
        }}>
          No credit card. Google Sign-in only. Results in under 10 minutes.
        </p>
      </section>

      {/* How it works */}
      <section style={{
        padding: "60px 40px",
        maxWidth: 760, margin: "0 auto",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(24px, 3vw, 40px)",
          fontWeight: 700, color: "#EDEDED",
          margin: "0 0 40px", letterSpacing: "-0.02em",
        }}>
          How to find Surat leads
        </h2>
        {[
          { step: "01", title: "Enter business type", desc: "Type any category — restaurants, salons, CA firms, clinics, travel agents. Anything." },
          { step: "02", title: "Enter Surat", desc: "Add specific areas within Surat for more targeted results — localities, neighbourhoods, market areas." },
          { step: "03", title: "Get your list", desc: "LocalLeads scans Google Maps and returns businesses with a live phone number and no website. Every result verified." },
          { step: "04", title: "Call and pitch", desc: "Call them. Say: I found you on Google Maps — you have no website, I build them starting at ₹10,000. Interested?" },
        ].map((item) => (
          <div key={item.step} style={{ display: "flex", gap: 24, marginBottom: 36 }}>
            <span style={{
              fontFamily: "Georgia, serif",
              fontSize: 36, fontWeight: 700,
              color: "#1A1A1A", lineHeight: 1,
              flexShrink: 0, width: 48,
            }}>
              {item.step}
            </span>
            <div>
              <p style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 600, color: "#EDEDED", margin: "0 0 6px" }}>
                {item.title}
              </p>
              <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#555", lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{
        padding: "60px 40px",
        maxWidth: 760, margin: "0 auto",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(24px, 3vw, 40px)",
          fontWeight: 700, color: "#EDEDED",
          margin: "0 0 16px", letterSpacing: "-0.02em",
        }}>
          Start finding Surat leads today.
        </h2>
        <p style={{ fontFamily: "sans-serif", fontSize: 16, color: "#555", lineHeight: 1.7, margin: "0 0 32px" }}>
          20 free leads. No credit card. Results in under 10 minutes.
        </p>
        <Link href="/auth" style={{
          display: "inline-block",
          background: "#22C55E", color: "#000",
          padding: "16px 40px",
          fontFamily: "sans-serif", fontSize: 15,
          fontWeight: 700, textDecoration: "none",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          Try LocalLeads Free →
        </Link>
      </section>

      {/* Footer */}
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
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/privacy" style={{ fontFamily: "sans-serif", fontSize: 12, color: "#333", textDecoration: "none" }}>Privacy</Link>
          <Link href="/auth" style={{ fontFamily: "sans-serif", fontSize: 12, color: "#333", textDecoration: "none" }}>Sign In</Link>
        </div>
      </footer>

    </main>
  );
}
