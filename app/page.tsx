/**
 * LocalLeads landing page
 *
 * Design intent: editorial, not templated.
 * Left-aligned 2-column hero. Bento features. Mega-quote testimonial.
 * A light (cream) section breaks the dark monotony — the "crafted" signal.
 */

import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StatCounter } from "@/components/StatCounter";
import { LiveScan } from "@/components/LiveScan";
import { ProductMockup } from "@/components/ProductMockup";
import { SearchTicker } from "@/components/SearchTicker";

// ─ Data ───────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    note: "Try LocalLeads, no card needed",
    features: ["20 leads (lifetime)", "All cities & categories"],
    missing: ["CSV export", "Priority support"],
    cta: "Start Free",
    href: "/auth",
    featured: false,
  },
  {
    name: "Starter",
    price: "₹499",
    period: "/month",
    note: "Most popular · first sale pays this back 20×",
    highlight: "Most popular",
    perLeadNote: "₹1 per qualified lead",
    features: ["500 leads / month", "CSV export", "All cities & categories"],
    missing: [],
    cta: "Get Starter — ₹499/mo",
    href: "/auth?plan=starter",
    featured: true,
  },
  {
    name: "Growth",
    price: "₹999",
    period: "/month",
    note: "For freelancers closing 5-10 sites/month",
    perLeadNote: "₹0.50 per qualified lead",
    features: ["2,000 leads / month", "CSV export", "All cities & categories"],
    missing: [],
    cta: "Get Growth",
    href: "/auth?plan=growth",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/month",
    note: "For full-time freelancers & small agencies",
    perLeadNote: "₹0.25 per qualified lead",
    features: ["10,000 leads / month", "CSV export", "Priority support", "All cities"],
    missing: [],
    cta: "Get Pro",
    href: "/auth?plan=pro",
    featured: false,
  },
  {
    name: "Agency",
    price: "₹4,999",
    period: "/month",
    note: "For agencies running multi-city campaigns",
    perLeadNote: "₹0.10 per qualified lead",
    features: ["50,000 leads / month", "CSV export", "Priority support", "Dedicated onboarding", "All cities"],
    missing: [],
    cta: "Get Agency",
    href: "/auth?plan=agency",
    featured: false,
  },
];

const FAQS = [
  {
    q: "Is the data real? Will I get active phone numbers or junk?",
    a: "Every number we surface comes directly from Google Maps — the same listing a customer would call to book a table or an appointment. These businesses put their number there because they want calls. We filter out businesses that already have a website, so every result you see is a genuine gap in the market. The Google Maps link is included with every lead so you can verify with your own eyes before you call.",
  },
  {
    q: "How do I actually sell a website to these businesses?",
    a: "Call them and say: I found you on Google Maps — you have no website, I build them for local businesses starting at ₹10,000, interested? That is it. About 1 in 5 calls becomes a real conversation. About 1 in 5 of those becomes a paying client. That is 1 client per 25 calls — and each call takes 2 minutes.",
  },
  {
    q: "Can I search for businesses outside India?",
    a: "Yes. LocalLeads works on Google Maps globally. You can search restaurants in New York, salons in London, or travel agencies in Dubai — and get the same output: business name, phone number, Google Maps link, and no-website confirmation. Many freelancers in India are using LocalLeads to pitch Western businesses at Western price points — charging in dollars while living in India.",
  },
  {
    q: "What price should I charge for a website?",
    a: "₹10,000–₹25,000 is the standard market rate for a small business website in India. A restaurant, salon, or CA firm with no online presence will happily pay ₹10,000–15,000 for a clean, professional site. If you're using AI tools (Framer, Webflow, Cursor), you can build one in 4–8 hours.",
  },
  {
    q: "How is this different from Just Dial or Sulekha?",
    a: "Just Dial shows businesses that already want to be found digitally. LocalLeads finds businesses that haven't built a website yet. These are warmer leads because (1) they have a clear need you can prove, (2) your competitors on Just Dial don't see them, and (3) you're coming in with a specific, valuable offer.",
  },
  {
    q: "Is the data accurate and legal to use?",
    a: "LocalLeads surfaces publicly available business information from Google Maps — the same data you'd see if you searched manually. We filter it and make it actionable. All data is public. All use is legitimate.",
  },
];

// ─ Page ───────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: "#080808", color: "#EDEDED", minHeight: "100vh" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(8,8,8,0.92)",
          backdropFilter: "blur(20px)",
        }}
      >
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </span>
        <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#how-it-works" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 400 }}>How it works</a>
          <a href="#pricing" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 400 }}>Pricing</a>
          <Link href="/auth" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 400 }}>Sign in</Link>
          <Link
            href="/auth"
            style={{
              background: "#22C55E", color: "#080808",
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
              padding: "8px 20px", letterSpacing: "0.03em", textDecoration: "none",
            }}
          >
            Start Free
          </Link>
        </div>
        <Link
          href="/auth"
          className="nav-mobile-only"
          style={{
            background: "#22C55E", color: "#080808",
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700,
            padding: "8px 18px", letterSpacing: "0.03em", textDecoration: "none",
          }}
        >
          Start Free
        </Link>
      </nav>

      {/* ── Hero — left-aligned 2-column ────────────────────────────────────── */}
      <section
        className="dot-grid hero-grid section-pad"
        style={{
          minHeight: "100vh",
          paddingTop: 60,
          display: "grid",
          gridTemplateColumns: "55% 45%",
        }}
      >
        {/* Left — copy */}
        <div
          className="hero-left-pad"
          style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "80px 56px 80px 64px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Editorial label */}
          <div
            className="hero-label"
            style={{
              marginBottom: 24,
              fontFamily: "var(--font-sans)", fontSize: 12, color: "#22C55E",
              letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
            }}
          >
            For web freelancers tired of guessing who to pitch
          </div>

          {/* H1 */}
          <h1
            className="animate-fade-up hero-h1"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(52px, 5.2vw, 88px)",
              fontWeight: 700, lineHeight: 0.94,
              letterSpacing: "-0.038em", color: "#EDEDED",
              margin: "0 0 32px",
            }}
          >
            100 qualified leads in one click —
            <br />
            <span style={{ color: "#22C55E", fontStyle: "italic" }}>businesses that actually need a website.</span>
          </h1>

          {/* Body */}
          <p
            className="animate-fade-up-delay-1"
            style={{
              fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.72,
              color: "#666", margin: "0 0 36px", maxWidth: 420,
            }}
          >
            LocalLeads scans Google Maps and shows you local businesses
            with a phone number and no website. Call them with a reason,
            not a guess.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-2" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
            <Link href="/auth" className="btn-gold hero-cta" style={{ background: "#EF4444", borderColor: "#EF4444" }}>Try for Free — No Credit Card Needed</Link>
            <a href="#how-it-works" className="btn-ghost-sm">See how it works →</a>
          </div>

          {/* Trust */}
          <div
            className="animate-fade-up-delay-3"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              fontFamily: "var(--font-sans)", fontSize: 12, color: "#333",
            }}
          >
            <span>Free forever</span>
            <span style={{ color: "#1E1E1E" }}>·</span>
            <span>Google Sign-in</span>
            <span style={{ color: "#1E1E1E" }}>·</span>
            <span>No credit card</span>
          </div>
        </div>

        {/* Right — live search feed */}
        <div
          className="hero-right"
          style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "80px 48px 80px 32px",
            position: "relative",
            backgroundImage: "url(/hero-illustration.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="animate-fade-up-delay-2"
            style={{ height: 420 }}
          >
            <SearchTicker />
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{
        padding: "64px 24px",
        background: "#0A0A0A",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <ScrollReveal>
            <div className="stats-3col" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            }}>
              {[
                {
                  val: "10–40",
                  sub: "qualified leads per search",
                  note: "Businesses with no website and a live phone number, in any Indian city you pick",
                },
                {
                  val: "2 min",
                  sub: "Results in under 2 minutes",
                  note: "Type a business type and city. Get a contact list ready to call",
                },
                {
                  val: "₹10k+",
                  sub: "is the floor, not the ceiling",
                  note: "Standard market rate in India for a small business website",
                },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "28px 32px",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  textAlign: i === 0 ? "left" : i === 2 ? "right" : "center",
                }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: "#22C55E", margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {s.val}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#EDEDED", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {s.sub}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#444", margin: 0, lineHeight: 1.6 }}>
                    {s.note}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Product Mockup — full-width, proud showcase ──────────────────────── */}
      <section className="section-pad" style={{
        padding: "80px 40px",
        background: "#080808",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22C55E", marginBottom: 12 }}>
                The product
              </p>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "#EDEDED", margin: "0 0 8px", lineHeight: 1.15 }}>
                Search. Get leads. Call. Repeat.
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#555", margin: 0, maxWidth: 460, lineHeight: 1.65 }}>
                Here's the dashboard. You pick a city and business type. We scan Google Maps and show you everyone with a phone number and no website.
              </p>
            </div>
          </ScrollReveal>
          <ProductMockup />
        </div>
      </section>

      {/* ── Pain ─────────────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "100px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <ScrollReveal>
            <div className="pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start" }}>
              {/* Left */}
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22C55E", marginBottom: 16 }}>
                  The real problem
                </p>
                <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(24px, 2.5vw, 34px)", fontWeight: 700, color: "#EDEDED", lineHeight: 1.15, margin: 0 }}>
                  You know how to build.
                  <br />
                  <span style={{ color: "#444" }}>Finding who needs it is the hard part.</span>
                </h2>
              </div>
              {/* Right */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  {
                    num: "01",
                    title: "No list of businesses that actually need a website",
                    body: "You're guessing. Cold messages on Instagram get ignored. Just Dial shows businesses that already know what they want.",
                  },
                  {
                    num: "02",
                    title: "Cold calling with no proof of need rarely works",
                    body: "If you can't point to a real gap, the conversation dies. Businesses listed on Maps with no website are different. The gap is visible.",
                  },
                  {
                    num: "03",
                    title: "Finding warm leads takes hours you don't have",
                    body: "Manual Google Maps research. Checking each business. Noting down numbers. Two hours for what LocalLeads returns in two minutes.",
                  },
                ].map((p, i) => (
                  <ScrollReveal key={i} delay={i * 60}>
                    <div style={{
                      padding: "28px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      display: "grid",
                      gridTemplateColumns: "40px 1fr",
                      gap: 20,
                    }}>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#2E2E2E", paddingTop: 4, letterSpacing: "0.06em" }}>
                        {p.num}
                      </span>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "#555", margin: "0 0 8px", lineHeight: 1.4 }}>
                          {p.title}
                        </h3>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#333", lineHeight: 1.7, margin: 0 }}>
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}

                {/* Bridge */}
                <ScrollReveal>
                  <div style={{
                    padding: "24px 24px",
                    marginTop: 24,
                    background: "rgba(34,197,94,0.04)",
                    borderLeft: "2px solid rgba(34,197,94,0.5)",
                  }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#777", lineHeight: 1.72, margin: 0 }}>
                      A business on Google Maps with no website is already telling you something.{" "}
                      <strong style={{ color: "#EDEDED" }}>LocalLeads finds them for you</strong>{" "}
                      so you can call with a reason, not a guess.{" "}
                      <strong style={{ color: "#22C55E" }}>That changes the whole conversation.</strong>
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Story — narrative transportation ────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "100px 40px", background: "#080808", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <ScrollReveal>
            <div className="story-card-pad" style={{
              position: "relative",
              padding: "52px 52px 48px",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "#0D0D0D",
              overflow: "hidden",
            }}>
              {/* Decorative quote mark */}
              <div style={{
                position: "absolute", top: 8, left: 32,
                fontFamily: "var(--font-serif)", fontSize: 130, lineHeight: 1,
                color: "rgba(34,197,94,0.06)", userSelect: "none", fontWeight: 700, pointerEvents: "none",
              }}>
                "
              </div>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#22C55E", marginBottom: 28, position: "relative" }}>
                How it usually goes
              </p>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#555", lineHeight: 1.82, margin: "0 0 16px", position: "relative" }}>
                A web developer in Pune was spending two hours every morning just finding someone to pitch.
                Instagram DMs. Sulekha. Cold WhatsApp. The work was not the problem. Finding the work was.
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#777", lineHeight: 1.82, margin: "0 0 16px", position: "relative" }}>
                One morning he searched "restaurants, Pune" on LocalLeads. Thirty-one businesses. No website.
                Real numbers. People he could call right now — with a reason.
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#EDEDED", lineHeight: 1.65, margin: "0 0 8px", fontWeight: 500, position: "relative" }}>
                He called eight. Three answered. Two had been meaning to get a website for years. He built all three in a week.
              </p>

              <p style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "#22C55E", margin: "8px 0 24px", fontStyle: "italic", position: "relative", lineHeight: 1.2 }}>
                ₹36,000. No cold outreach. No guessing.
              </p>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#555", lineHeight: 1.78, margin: "0 0 36px", position: "relative" }}>
                That conversation starts differently when you can say: "I found you on Google Maps — you have no website,
                I build them for businesses like yours starting at ₹10,000." That is not a pitch. That is an observation.
                Observations are hard to argue with.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                <div style={{
                  width: 38, height: 38,
                  background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, color: "#22C55E", flexShrink: 0,
                }}>
                  ?
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "#EDEDED", margin: 0 }}>A developer from Pune</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#555", margin: 0 }}>This is what the workflow looks like in practice</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="section-pad" style={{ padding: "100px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ marginBottom: 44 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22C55E", marginBottom: 14 }}>
                How it works
              </p>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(26px, 3.2vw, 42px)", fontWeight: 700, color: "#EDEDED", lineHeight: 1.12, margin: 0 }}>
                Four steps. Any city.
              </h2>
            </div>
          </ScrollReveal>

          {/* Visual process flow */}
          <ScrollReveal>
            <div className="process-flow" style={{ marginBottom: 48 }}>
              {[
                { n: "01", title: "Search", desc: "Type a business type and your city" },
                { n: "02", title: "Get leads", desc: "Businesses on Maps with no website and a live number" },
                { n: "03", title: "Call", desc: "One honest offer: I build websites, want one?" },
                { n: "04", title: "Build and earn", desc: "AI website in hours. ₹10,000-25,000 per client" },
              ].flatMap((step, i, arr) => {
                const items = [
                  <div key={step.n} style={{
                    flex: 1, minWidth: 0,
                    padding: "22px 20px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#080808",
                    display: "flex", flexDirection: "column",
                  }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, color: "#2A2A2A", letterSpacing: "0.1em", marginBottom: 10 }}>{step.n}</span>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "#EDEDED", margin: "0 0 6px", lineHeight: 1.3 }}>{step.title}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                ];
                if (i < arr.length - 1) {
                  items.push(
                    <div key={`a${i}`} className="process-flow-arrow" style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#2A2A2A" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  );
                }
                return items;
              })}
            </div>
          </ScrollReveal>

          {/* Bento grid */}
          <div className="bento-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 400px",
            gridTemplateRows: "auto auto",
            gap: 1,
            background: "rgba(255,255,255,0.07)",
          }}>

            {/* 01 — Search (top left) */}
            <ScrollReveal>
              <div className="feature-card" style={{
                gridColumn: "1 / 2", gridRow: "1 / 2",
                background: "#080808", padding: "36px 32px",
                border: "1px solid transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{
                    width: 40, height: 40,
                    background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E",
                  }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#222", letterSpacing: "0.1em" }}>01</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 600, color: "#EDEDED", margin: "0 0 10px", lineHeight: 1.35 }}>
                  Search by category and city
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#555", lineHeight: 1.68, margin: 0 }}>
                  Type "CA firms, Mumbai" or "salons, Indiranagar". Every business in that category with no website and a live phone number. Instant.
                </p>
              </div>
            </ScrollReveal>

            {/* 03 — Call (spans 2 rows) */}
            <ScrollReveal delay={80}>
              <div className="feature-card bento-span-rows" style={{
                gridColumn: "2 / 3", gridRow: "1 / 3",
                background: "#080808", padding: "36px 32px",
                border: "1px solid transparent",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{
                    width: 40, height: 40,
                    background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E",
                  }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.74h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#222", letterSpacing: "0.1em" }}>03</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 600, color: "#EDEDED", margin: "0 0 10px", lineHeight: 1.35 }}>
                  Call. Pitch. Build. Collect.
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#555", lineHeight: 1.68, margin: "0 0 28px" }}>
                  Every result has a verified phone number. Call, offer a website.
                  Build it with AI in a day. Get paid.
                </p>

                {/* Pitch script box */}
                <div style={{
                  background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.07)",
                  padding: "18px 20px", marginTop: "auto",
                }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3A3A3A", margin: "0 0 10px" }}>
                    The exact pitch
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                    "I found you on Google Maps — you have no website, I build them for local businesses starting at ₹10,000, interested?"
                  </p>
                </div>

                {/* ₹ stat */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, color: "#22C55E", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                    ₹10k–25k
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#444", margin: 0 }}>
                    per website · standard Indian market rate
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* 02 — LiveScan (spans both rows on right) */}
            <ScrollReveal delay={40}>
              <div className="bento-col3 bento-span-rows" style={{
                gridColumn: "3 / 4", gridRow: "1 / 3",
                background: "#080808",
                display: "flex", flexDirection: "column",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{ padding: "28px 28px 16px", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40,
                      background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E",
                    }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#222", letterSpacing: "0.1em" }}>02</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 600, color: "#EDEDED", margin: "0 0 8px", lineHeight: 1.35 }}>
                    Google Maps scan, live
                  </h3>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555", lineHeight: 1.65, margin: 0 }}>
                    Multi-variant geo-grid across your city. Scroll into view to see it scan.
                  </p>
                </div>
                <div style={{ flex: 1, padding: "0 20px 20px", display: "flex", flexDirection: "column" }}>
                  <LiveScan />
                </div>
              </div>
            </ScrollReveal>

            {/* Bottom-left: stat callout */}
            <ScrollReveal delay={120}>
              <div className="feature-card bento-span-rows" style={{
                gridColumn: "1 / 2", gridRow: "2 / 3",
                background: "#080808", padding: "28px 32px",
                border: "1px solid transparent",
                display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#333", margin: "0 0 12px" }}>
                  Most freelancers run
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "#22C55E", margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  1 search
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>
                  every Monday morning — and have enough leads for the whole week
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Pitch Script ─────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "100px 40px", background: "#0D0D0D", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <ScrollReveal>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.16em", textTransform: "uppercase", color: "#22C55E", marginBottom: 32,
            }}>
              The only pitch you need — copy this word for word
            </p>
            <blockquote style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 3.5vw, 48px)",
              fontWeight: 700, lineHeight: 1.2,
              color: "#EDEDED", margin: "0 0 32px",
              letterSpacing: "-0.02em",
            }}>
              "I found you on Google Maps — you have no website, I build them for businesses like yours starting at ₹10,000. Interested?"
            </blockquote>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 14, color: "#444",
              lineHeight: 1.7, margin: 0,
            }}>
              About 1 in 25 calls becomes a paying client. That is ₹400 in potential revenue per call you make.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Global Leads ─────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "100px 40px", background: "#111", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <ScrollReveal>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 4vw, 56px)",
              fontWeight: 700, color: "#EDEDED",
              lineHeight: 1.1, letterSpacing: "-0.025em",
              margin: "0 0 36px",
            }}>
              Your city. Any city. Any country.
            </h2>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#666", lineHeight: 1.82, marginBottom: 48 }}>
              <p style={{ margin: "0 0 20px" }}>
                Most freelancers limit themselves to the city they live in. LocalLeads has no such limit.
              </p>
              <p style={{ margin: "0 0 20px", color: "#888" }}>
                Search restaurants in Austin, Texas.<br />
                Find salons in Manchester, UK.<br />
                Pull CA firms in Dubai, UAE.
              </p>
              <p style={{ margin: "0 0 20px" }}>
                Every search returns the same thing — businesses with no website and a live phone number. Except now the phone number has a +1, +44, or +971 in front of it.
              </p>
              <p style={{ margin: 0, color: "#EDEDED", fontWeight: 500 }}>
                Sit in Bangalore. Work with clients in the West. Charge in dollars.
              </p>
            </div>
          </ScrollReveal>

          {/* Example result cards */}
          <ScrollReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }}>
              {[
                { name: "Mario's Pizzeria", location: "Austin, Texas", phone: "+1 512 XXX XXXX" },
                { name: "The Hair Lounge", location: "Manchester, UK", phone: "+44 161 XXX XXXX" },
                { name: "Al Noor Travel Agency", location: "Dubai, UAE", phone: "+971 4 XXX XXXX" },
              ].map((card, i) => (
                <div key={i} style={{
                  background: "#0D0D0D", padding: "18px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
                }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "#EDEDED" }}>
                      {card.name}
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555", marginLeft: 10 }}>
                      · {card.location} ·
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#EF4444", marginLeft: 6, fontWeight: 600 }}>
                      No website
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: "#22C55E" }}>
                      {card.phone}
                    </span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#444" }}>Maps ↗</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#444", textAlign: "center", margin: 0 }}>
              Same tool. Same search. Anywhere on earth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", padding: "13px 0", background: "#050505" }}>
        <div className="marquee-track" style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#222" }}>
          {[1, 2].map((_, k) => (
            <span key={k} style={{ paddingRight: 48, whiteSpace: "nowrap" }}>
              Restaurants &nbsp;·&nbsp; Salons &nbsp;·&nbsp; CA Firms &nbsp;·&nbsp; Travel Agents &nbsp;·&nbsp; Gyms &nbsp;·&nbsp; Coaching Centers &nbsp;·&nbsp; Boutiques &nbsp;·&nbsp; Clinics &nbsp;·&nbsp; Plumbers &nbsp;·&nbsp; Photographers &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "100px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <ScrollReveal>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22C55E", marginBottom: 52 }}>
              What freelancers are saying on WhatsApp
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div style={{
              background: "#25D366",
              borderRadius: "18px 18px 18px 4px",
              padding: "24px 28px",
              maxWidth: 540,
            }}>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 16, color: "#fff",
                lineHeight: 1.65, margin: 0,
              }}>
                "this saves me a lot of time and gets me 100 leads in 1 click that too qualified who actually need a website"
              </p>
            </div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: 13, color: "#444",
              marginTop: 14, marginLeft: 4, marginBottom: 0,
            }}>
              Rahul, freelance web designer, Pune — after his first week on LocalLeads
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────────── */}
      <section id="pricing" className="section-pad" style={{ padding: "100px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ marginBottom: 52 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22C55E", marginBottom: 14 }}>
                Pricing
              </p>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(26px, 3.2vw, 42px)", fontWeight: 700, color: "#EDEDED", lineHeight: 1.12, margin: "0 0 10px" }}>
                Start free. Scale when ready.
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#555", margin: 0, lineHeight: 1.65 }}>
                Pay only for leads that qualify — businesses with a phone number and no website.{" "}
                <strong style={{ color: "#777" }}>No credit card. Cancel anytime.</strong>
              </p>
            </div>
          </ScrollReveal>

          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", alignItems: "stretch" }}>
            {PLANS.map((plan, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className={plan.featured ? "pricing-card pricing-card-featured" : "pricing-card"} style={{
                  padding: plan.featured ? "44px 24px" : "28px 18px",
                  position: "relative",
                  display: "flex", flexDirection: "column", height: "100%",
                  background: plan.featured ? "rgba(34,197,94,0.04)" : "transparent",
                  border: plan.featured
                    ? "2px solid rgba(34,197,94,0.45)"
                    : "1px solid rgba(255,255,255,0.07)",
                  marginLeft: plan.featured ? -1 : 0,
                  marginRight: plan.featured ? -1 : 0,
                  zIndex: plan.featured ? 2 : 1,
                }}>
                  {plan.featured && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      background: "#22C55E", padding: "6px 0", textAlign: "center",
                      fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 800,
                      letterSpacing: "0.15em", color: "#080808", textTransform: "uppercase",
                    }}>
                      Most popular
                    </div>
                  )}

                  <div style={{ marginBottom: 20, marginTop: plan.featured ? 24 : 0 }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.featured ? "#22C55E" : "#444", margin: "0 0 4px" }}>
                      {plan.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: plan.featured ? "#555" : "#333", margin: 0 }}>
                      {plan.note}
                    </p>
                  </div>

                  <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: "perLeadNote" in plan ? 8 : 0 }}>
                      <span style={{ fontFamily: "var(--font-serif)", fontSize: plan.featured ? 54 : 40, fontWeight: plan.featured ? 400 : 300, color: plan.featured ? "#EDEDED" : "#444", lineHeight: 1 }}>
                        {plan.price}
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555" }}>{plan.period}</span>
                    </div>
                    {"perLeadNote" in plan && (
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#555", margin: 0, letterSpacing: "0.01em" }}>
                        {(plan as typeof plan & { perLeadNote: string }).perLeadNote}
                      </p>
                    )}
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 14, color: plan.featured ? "#EDEDED" : "#555" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        {f}
                      </li>
                    ))}
                    {"missing" in plan && plan.missing.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 14, color: "#2E2E2E" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href} className={plan.featured ? "btn-gold" : "btn-ghost"} style={{ display: "block", textAlign: "center", fontSize: plan.featured ? 13 : 12 }}>
                    {plan.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "100px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ marginBottom: 52 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22C55E", marginBottom: 14 }}>
                Questions
              </p>
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(26px, 3.2vw, 42px)", fontWeight: 700, color: "#EDEDED", lineHeight: 1.12, margin: 0 }}>
                Every question you have, answered.
              </h2>
            </div>
          </ScrollReveal>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {FAQS.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <details>
                  <summary>
                    <span>{faq.q}</span>
                    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="faq-body" dangerouslySetInnerHTML={{ __html: faq.a.replace(/₹[\d,–\-k]+/g, (m) => `<strong>${m}</strong>`) }} />
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Anti-Pitch — LIGHT SECTION ───────────────────────────────────────── */}
      <section className="section-light section-pad" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ScrollReveal>
            <div className="antipitch-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

              {/* Left — not for you */}
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#AAA095", marginBottom: 20 }}>
                  Not for you if
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    "You're not willing to make phone calls",
                    "You expect clients without any effort",
                    "You want hundreds of instant leads",
                    "You won't build what you sell",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8C0B4" strokeWidth="2" style={{ flexShrink: 0, marginTop: 3 }}>
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#7A7268", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — built for you */}
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#1A6B3A", marginBottom: 20 }}>
                  Built for you if
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    "You can build a website (with AI or without)",
                    "You'll call 10 businesses this week",
                    "₹10,000 per client sounds worth your time",
                    "You want a system, not just luck",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 3 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#3A3530", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Closing line */}
            <div style={{ marginTop: 60, paddingTop: 48, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#6B6560", lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
                If you read the right column and thought{" "}
                <strong style={{ color: "#1A1A1A" }}>yes, that's me</strong>{" "}
                — LocalLeads gives you the one thing missing:{" "}
                <strong style={{ color: "#16A34A" }}>someone to call.</strong>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section
        className="dot-grid"
        style={{ padding: "140px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <ScrollReveal>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 580, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#22C55E", marginBottom: 22 }}>
              Start today
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700, color: "#EDEDED", lineHeight: 1.05,
              letterSpacing: "-0.03em", margin: "0 0 16px",
            }}>
              The businesses are already there.
              <br />
              <span style={{ color: "#22C55E", fontStyle: "italic" }}>Someone is going to call them this week.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "#555", margin: "0 0 44px", lineHeight: 1.68 }}>
              Takes 30 seconds to sign in. Your first 20 leads are free — no card needed.
              If you make one call and it goes nowhere, you have lost nothing.
              If it goes somewhere, you know what to do next.
            </p>
            <Link href="/auth" className="btn-gold" style={{ display: "inline-block", marginBottom: 14 }}>
              Find My First Leads — It's Free
            </Link>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#444", margin: "0 0 20px" }}>
              Every lead includes a Google Maps link — verify with your own eyes before you call
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#3A3A3A", margin: "0 0 20px" }}>
              Used by freelancers across Mumbai, Pune, Bangalore, Delhi and Hyderabad
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap", fontFamily: "var(--font-sans)", fontSize: 12, color: "#333" }}>
              <span>✓ Google Sign-in only</span>
              <span style={{ color: "#1E1E1E" }}>·</span>
              <span>✓ No spam ever</span>
              <span style={{ color: "#1E1E1E" }}>·</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="footer-responsive" style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "24px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </span>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#2E2E2E", margin: 0 }}>
          © 2026 Sahajta AI Solutions Pvt. Ltd. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 24, fontFamily: "var(--font-sans)", fontSize: 13, flexWrap: "wrap" }}>
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/refund" className="footer-link">Refund Policy</Link>
          <a href="mailto:contact@sahajta.com" className="footer-link">Contact Us</a>
        </div>
      </footer>

    </div>
  );
}
