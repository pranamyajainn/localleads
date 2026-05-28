"use client";

import Link from "next/link";
import Image from "next/image";
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
    note: "Try it out, no credit card needed",
    features: ["Find 20 shops (forever)", "All cities & types of shops"],
    missing: ["Download list to Excel/CSV", "Quick email support"],
    cta: "Start Free",
    href: "/auth",
    featured: false,
  },
  {
    name: "Starter",
    price: "₹499",
    period: "/month",
    note: "Best value · get your money back with just 1 client!",
    highlight: "Most popular",
    perLeadNote: "Cost: ₹1 per shop phone number",
    features: ["Find 500 shops / month", "Download list to Excel/CSV", "All cities & types of shops"],
    missing: [],
    cta: "Get Starter — ₹499/mo",
    href: "/auth?plan=starter",
    featured: true,
  },
  {
    name: "Growth",
    price: "₹999",
    period: "/month",
    note: "For people who build 5 to 10 websites every month",
    perLeadNote: "Cost: ₹0.50 per shop phone number",
    features: ["Find 2,000 shops / month", "Download list to Excel/CSV", "All cities & types of shops"],
    missing: [],
    cta: "Get Growth",
    href: "/auth?plan=growth",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/month",
    note: "For busy designers and small teams",
    perLeadNote: "Cost: ₹0.25 per shop phone number",
    features: ["Find 10,000 shops / month", "Download list to Excel/CSV", "Quick email support", "All cities"],
    missing: [],
    cta: "Get Pro",
    href: "/auth?plan=pro",
    featured: false,
  },
  {
    name: "Agency",
    price: "₹4,999",
    period: "/month",
    note: "For big companies finding shops everywhere",
    perLeadNote: "Cost: ₹0.10 per shop phone number",
    features: ["Find 50,000 shops / month", "Download list to Excel/CSV", "Quick email support", "Help with onboarding", "All cities"],
    missing: [],
    cta: "Get Agency",
    href: "/auth?plan=agency",
    featured: false,
  },
];

const FAQS = [
  {
    q: "Is the phone number list real?",
    a: "Yes! We get the phone numbers straight from Google Maps in real time. We do not use old or fake lists. You can click the Google Maps link for any shop to check it yourself!",
  },
  {
    q: "How do I sell a website to these shops?",
    a: "Just call them! Say: \"I found you on Google Maps. You do not have a website. I can build one for you for ₹10,000.\" If you call 25 shops, you can easily get 1 shop to say yes!",
  },
  {
    q: "Can I find shops in other countries?",
    a: "Yes! You can search anywhere in the world. You can find shops in New York, London, or Dubai. Many people in India use our tool to find shops in other countries and get paid in US Dollars!",
  },
  {
    q: "How much money should I charge?",
    a: "You can charge ₹10,000 to ₹25,000 for a simple website. Shops like cafes, salons, or clinics will happily pay this. With modern web tools, you can build a site in just 1 day!",
  },
  {
    q: "How is this better than other websites?",
    a: "Other sites show shops that already have websites or run ads. We find shops that have NO website at all. This means they really need your help, and other designers are not calling them yet!",
  },
  {
    q: "Is this safe and legal?",
    a: "Yes! All the shop info is public on Google Maps. We just save you time by finding it for you. It is 100% legal and safe to use.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: "#0A0A0B", color: "#EDEDED", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
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
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", color: "#EDEDED" }}>
          Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#benefits" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 500 }}>Benefits</a>
          <a href="#how-it-works" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 500 }}>How it works</a>
          <a href="#pricing" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 500 }}>Pricing</a>
          <Link href="/blog" className="nav-link" style={{ letterSpacing: "normal", fontSize: 14, textTransform: "none", fontWeight: 500 }}>Blog</Link>
          <Link
            href="/auth"
            style={{
              background: "var(--color-gold)", color: "#0A0A0B",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
              padding: "10px 22px", borderRadius: 30, textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--color-gold-light)"}
            onMouseOut={(e) => e.currentTarget.style.background = "var(--color-gold)"}
          >
            Start a free trial
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "calc(100vh - 80px)",
          padding: "80px 24px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
          gap: 48,
        }}
        className="hero-grid"
      >
        {/* Left Side Copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ color: "var(--color-gold)", fontWeight: 700, letterSpacing: "0.1em", fontSize: 12, textTransform: "uppercase" }}>
            Smarter client finding for web designers
          </span>
          <h1
            style={{
              fontSize: "clamp(36px, 4.5vw, 68px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Find local shops with no website.
            <br />
            <span style={{ color: "var(--color-gold)" }}>Call them today.</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 1.8vw, 19px)",
              lineHeight: 1.6,
              color: "rgba(210, 210, 211, 1)",
              maxWidth: 580,
              margin: 0,
            }}
          >
            We find phone numbers of shops on Google Maps that do not have websites. You get them in 1 click. Stop wasting hours searching by yourself!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 12 }}>
            <Link
              href="/auth"
              style={{
                background: "var(--color-gold)", color: "#0A0A0B",
                fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700,
                padding: "16px 40px", borderRadius: 30, textDecoration: "none",
                display: "inline-block", textAlign: "center", width: "fit-content",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "var(--color-gold-light)"}
              onMouseOut={(e) => e.currentTarget.style.background = "var(--color-gold)"}
            >
              Start a free trial
            </Link>
            
            {/* Checks */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 24px", marginTop: 8 }}>
              {[
                "Stop wasting time searching",
                "Get real phone numbers",
                "Get maps links",
              ].map((text, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--color-gold)", flexShrink: 0 }}>
                    <path d="M4.77404 9.93175C4.44485 9.93175 4.11565 9.80186 3.86435 9.54044L0.376956 5.91256C-0.125652 5.38974 -0.125652 4.54277 0.376956 4.02145C0.879564 3.49863 1.69226 3.4971 2.19487 4.01994L4.77404 6.70297L10.8406 0.392129C11.3432 -0.13071 12.1559 -0.13071 12.6586 0.392129C13.1611 0.914977 13.1611 1.76193 12.6586 2.28477L5.68371 9.54044C5.43243 9.80186 5.10323 9.93175 4.77404 9.93175Z" fill="currentColor"/>
                  </svg>
                  <span style={{ fontSize: 13, color: "rgba(210,210,211,1)", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Mockup */}
        <div className="hero-right" style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/simplified-hero.png"
            alt="LocalLeads Dashboard Mockup"
            width={1024}
            height={1024}
            priority
            style={{
              width: "100%",
              maxWidth: 500,
              height: "auto",
              borderRadius: 24,
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 80px rgba(255, 230, 93, 0.08)",
            }}
          />
        </div>
      </section>

      {/* ── Core Benefits Grid (Define Card Style) ─────────────────────────── */}
      <section id="benefits" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            Get more business from Google Maps
          </h2>
          <p style={{ fontSize: 16, color: "rgba(210, 210, 211, 0.7)", maxWidth: 580, margin: "0 auto" }}>
            Don't waste time copy-pasting phone numbers. Let our tool do the work for you.
          </p>
        </div>

        {/* 3-Column Visual Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="pricing-grid"
        >
          {/* Card 1: Blue Background */}
          <div
            style={{
              background: "var(--color-blue)",
              borderRadius: 24,
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Image src="/pipeline-mrr.png" alt="MRR Growth Pipeline" width={1024} height={1024} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Get clients every month
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.8)", margin: 0 }}>
              Do you make ₹28,000 one month and ₹0 the next? That is bad. Keep 500 new shops ready to call every month.
            </p>
          </div>

          {/* Card 2: Coral Background */}
          <div
            style={{
              background: "var(--color-coral)",
              borderRadius: 24,
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Image src="/maps-verify.png" alt="Google Maps no-website proof" width={1024} height={1024} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Show them proof from Google
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.8)", margin: 0 }}>
              Does a shop owner want proof? Tell them: "Look at Google Maps. You have no website link." They will see it is true.
            </p>
          </div>

          {/* Card 3: Dark Slate Background */}
          <div
            style={{
              background: "var(--color-slate)",
              borderRadius: 24,
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* Visual Progress Bar Comparison Block */}
            <div
              style={{
                background: "#1E2024",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "20px",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "#EB8251", fontWeight: 600 }}>Manual Copy-Paste</span>
                  <span style={{ color: "#EB8251", fontWeight: 700 }}>5 Hours</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: "#EB8251", borderRadius: 8 }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "var(--color-gold)", fontWeight: 600 }}>LocalLeads Scan</span>
                  <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>10 Mins</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ width: "8.3%", height: "100%", background: "var(--color-gold)", borderRadius: 8 }} />
                </div>
              </div>
            </div>
            
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Stop searching, start talking
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.8)", margin: 0 }}>
              Get your lead list in 10 minutes. Spend your day making calls. One client pays you ₹10,000+. The tool only costs ₹499.
            </p>
          </div>
        </div>
      </section>

      {/* ── Visual Workflow Section ────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ color: "var(--color-gold)", fontWeight: 700, letterSpacing: "0.1em", fontSize: 12, textTransform: "uppercase" }}>
            The Workflow
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            From Google Maps to a paying client
          </h2>
          <p style={{ fontSize: 16, color: "rgba(210, 210, 211, 0.7)", maxWidth: 580, margin: "0 auto" }}>
            Search any city. Find shops that do not have a website. Call them and offer to build one!
          </p>
        </div>

        <div style={{
          background: "#16161A",
          borderRadius: 32,
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)"
        }} className="section-pad">
          <Image
            src="/outreach-flow.png"
            alt="Google Maps to Lead Workflow"
            width={1024}
            height={1024}
            style={{
              width: "100%",
              maxWidth: 700,
              height: "auto",
              borderRadius: 18,
            }}
          />
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            width: "100%",
            textAlign: "left",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 32,
          }} className="pricing-grid">
            <div>
              <span style={{ color: "var(--color-blue)", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                01 · Search Maps
              </span>
              <p style={{ fontSize: 14, color: "rgba(210,210,211,0.7)", margin: 0, lineHeight: 1.6 }}>
                Find shops in any city or neighborhood on Google Maps.
              </p>
            </div>
            <div>
              <span style={{ color: "var(--color-gold)", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                02 · Filter Websites
              </span>
              <p style={{ fontSize: 14, color: "rgba(210,210,211,0.7)", margin: 0, lineHeight: 1.6 }}>
                Our tool automatically hides shops that already have websites.
              </p>
            </div>
            <div>
              <span style={{ color: "var(--color-coral)", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                03 · Call Them
              </span>
              <p style={{ fontSize: 14, color: "rgba(210,210,211,0.7)", margin: 0, lineHeight: 1.6 }}>
                Call them and show them they have no website on Google Maps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Google Calendar Connector style ────────────────────────────────── */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: 60,
          }}
          className="hero-grid"
        >
          {/* Left Side widget */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src="/outreach-feature.png"
              alt="Outreach Feature Illustration"
              width={1024}
              height={1024}
              style={{
                width: "100%",
                maxWidth: 500,
                height: "auto",
                borderRadius: 24,
                boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 80px rgba(75, 92, 209, 0.05)",
              }}
            />
          </div>

          {/* Right Side Copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "rgba(75,92,209,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--color-blue)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            
            <h3 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, lineHeight: 1.2, color: "#FFFFFF", margin: 0 }}>
              Find shops that need your help
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(210,210,211,0.8)", margin: 0 }}>
              Type any business type (like salons or restaurants) and any city. We show you exactly who does not have a website. Only call people who need you!
            </p>
            
            <Link
              href="/auth"
              style={{
                background: "var(--color-blue)", color: "#FFFFFF",
                fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
                padding: "14px 32px", borderRadius: 30, textDecoration: "none",
                display: "inline-block", textAlign: "center", width: "fit-content",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "var(--color-blue-light)"}
              onMouseOut={(e) => e.currentTarget.style.background = "var(--color-blue)"}
            >
              Start a free trial
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefit List 3-Col ────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }} className="pricing-grid">
          {[
            {
              title: "Search any city",
              desc: "Find shops in any city in the world. Get fresh phone numbers in real time.",
              color: "var(--color-blue)",
              svg: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
            },
            {
              title: "Save your leads",
              desc: "Download your leads to your computer in 1 click. Save their details to call them later.",
              color: "var(--color-coral)",
              svg: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />,
            },
            {
              title: "Call 10 shops a day",
              desc: "Call 10 shops every morning. Even if only 1 says yes, you get a new client!",
              color: "var(--color-slate)",
              svg: <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />,
            },
          ].map((benefit, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: benefit.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#FFFFFF",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {benefit.svg}
                </svg>
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                {benefit.title}
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(210,210,211,0.7)", margin: 0 }}>
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dynamic Shift Indigo Banner ────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            background: "var(--color-blue)",
            borderRadius: 32,
            padding: "60px 48px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 40,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.1, color: "#FFFFFF", margin: 0 }}>
              Get 500 phone numbers every month
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", margin: 0 }}>
              One website client pays you ₹10,000 to ₹30,000. Our tool is only ₹499. Selling just one website pays for the tool for years!
            </p>
            <Link
              href="/auth"
              style={{
                background: "var(--color-coral)", color: "#FFFFFF",
                fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
                padding: "14px 32px", borderRadius: 30, textDecoration: "none",
                display: "inline-block", textAlign: "center", width: "fit-content",
                transition: "background 0.2s",
                marginTop: 8,
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "var(--color-coral-light)"}
              onMouseOut={(e) => e.currentTarget.style.background = "var(--color-coral)"}
            >
              Start a free trial
            </Link>
          </div>

          {/* Right Side Visual Block */}
          <div
            style={{
              background: "var(--color-gold)",
              borderRadius: 24,
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              color: "#0A0A0B",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em" }}>75%</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>pipeline built</span>
            </div>
            
            <div style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)", padding: "20px", borderRadius: 18 }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Monthly Outreach Goal</p>
              <p style={{ fontSize: 13, margin: 0, opacity: 0.8 }}>3 paying clients target closed</p>
              <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 8, marginTop: 12, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "75%", background: "var(--color-coral)", borderRadius: 8 }} />
              </div>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", fontSize: 12, fontWeight: 600, opacity: 0.8 }}>
              <span>✓ CSV exports enabled</span>
              <span>✓ Verified phone numbers</span>
              <span>✓ Global geolocation scan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rebalance / Swipe to Call Section ──────────────────────────────── */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            alignItems: "center",
            gap: 60,
          }}
          className="hero-grid"
        >
          {/* Left Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <h3 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, lineHeight: 1.2, color: "#FFFFFF", margin: 0 }}>
              What to say when you call
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(210,210,211,0.8)", margin: 0 }}>
              Call them and say:
              <br />
              <strong style={{ color: "#FFFFFF", display: "block", margin: "12px 0", fontSize: 18, fontStyle: "italic", borderLeft: "3px solid var(--color-gold)", paddingLeft: 16 }}>
                "I saw your shop on Google Maps. You do not have a website listed. I can build a clean website for you for ₹10,000. Would you like one?"
              </strong>
              This is very simple. Shop owners will listen because they know they need a website.
            </p>
          </div>

          {/* Right Side visual widget */}
          <div
            style={{
              background: "#16161A",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 24,
              padding: "36px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <span style={{ fontSize: 11, color: "var(--color-coral)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Prospect Contact
            </span>
            <h4 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Rahul's Unisex Salon
            </h4>
            
            <div style={{ display: "flex", gap: 8 }}>
              {["/avatar1.png", "/avatar2.png", "/avatar3.png"].map((_, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "#393D45", border: "2px solid #16161A", marginLeft: i > 0 ? -12 : 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 10, fontWeight: 700 }}>
                  {i + 1}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyItems: "center", background: "rgba(235,130,81,0.08)", border: "1px solid rgba(235,130,81,0.2)", borderRadius: 30, padding: "8px 16px", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--color-coral)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.74h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-coral)" }}>Swipe to Dial Prospect</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16, fontSize: 12, color: "#666" }}>
              <span>💬 3 closed meetings</span>
              <span>🔗 Maps link verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Create Tasks Coral Banner ──────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            background: "var(--color-coral)",
            borderRadius: 32,
            padding: "60px 48px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 40,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.1, color: "#FFFFFF", margin: 0 }}>
              Find your first leads now
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", margin: 0 }}>
              Log in with Google. Your first 20 leads are free. See which shops near you need a website today.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
              <Link
                href="/auth"
                style={{
                  background: "var(--color-gold)", color: "#0A0A0B",
                  fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700,
                  padding: "14px 32px", borderRadius: 30, textDecoration: "none",
                  display: "inline-block", textAlign: "center", width: "fit-content",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "var(--color-gold-light)"}
                onMouseOut={(e) => e.currentTarget.style.background = "var(--color-gold)"}
              >
                Start free trial
              </Link>
              
              {/* Checks */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", fontSize: 12, color: "#FFF", fontWeight: 600 }}>
                <span>✓ Flexible time blocking</span>
                <span>✓ Real-time Maps sync</span>
                <span>✓ Task management</span>
                <span>✓ CSV export</span>
              </div>
            </div>
          </div>

          {/* Right Side Visual Block */}
          <div
            style={{
              background: "#16161A",
              borderRadius: 24,
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <p style={{ fontSize: 11, color: "var(--color-gold)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              Search: Dentists in Jaipur
            </p>
            <h4 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Extracting leads...
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {[
                { name: "Jaipur Dental Clinic", phone: "+91 94140 XXXXX" },
                { name: "Pink City Orthodontist", phone: "+91 98290 XXXXX" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#26262B", padding: "12px 16px", borderRadius: 14 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#FFF", margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: "var(--color-coral)", margin: 0 }}>No website</p>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--color-gold)", fontFamily: "ui-monospace" }}>{item.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ─────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ color: "var(--color-gold)", fontWeight: 700, letterSpacing: "0.1em", fontSize: 12, textTransform: "uppercase" }}>
            Simple Pricing
          </span>
          <h2 style={{ fontSize: "clamp(26px, 3.2vw, 42px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.12, margin: "12px 0 10px" }}>
            Try for free first
          </h2>
          <p style={{ fontSize: 15, color: "rgba(210,210,211,0.7)", margin: 0, lineHeight: 1.65 }}>
            Start free. No credit card needed. Cancel whenever you want.
          </p>
        </div>

        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", alignItems: "stretch", gap: 1 }}>
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={plan.featured ? "pricing-card-featured" : ""}
              style={{
                padding: "36px 20px",
                position: "relative",
                display: "flex", flexDirection: "column", height: "100%",
                background: plan.featured ? "rgba(255, 230, 93, 0.04)" : "#16161A",
                border: plan.featured
                  ? "2px solid var(--color-gold)"
                  : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 24,
              }}
            >
              {plan.featured && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  background: "var(--color-gold)", padding: "6px 0", textAlign: "center",
                  fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 800,
                  letterSpacing: "0.15em", color: "#080808", textTransform: "uppercase",
                  borderRadius: "10px 10px 0 0",
                }}>
                  Most popular
                </div>
              )}

              <div style={{ marginBottom: 20, marginTop: plan.featured ? 12 : 0 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.featured ? "var(--color-gold)" : "#888", margin: "0 0 4px" }}>
                  {plan.name}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "rgba(210,210,211,0.6)", margin: 0 }}>
                  {plan.note}
                </p>
              </div>

              <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: "perLeadNote" in plan ? 8 : 0 }}>
                  <span style={{ fontSize: plan.featured ? 44 : 36, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: "#666" }}>{plan.period}</span>
                </div>
                {"perLeadNote" in plan && (
                  <p style={{ fontSize: 11, color: "var(--color-gold)", margin: 0, letterSpacing: "0.01em" }}>
                    {(plan as typeof plan & { perLeadNote: string }).perLeadNote}
                  </p>
                )}
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#EDEDED" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </li>
                ))}
                {"missing" in plan && plan.missing.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#444" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                style={{
                  display: "block", textAlign: "center", fontSize: 13, fontWeight: 700,
                  background: plan.featured ? "var(--color-gold)" : "transparent",
                  color: plan.featured ? "#0A0A0B" : "#FFFFFF",
                  border: plan.featured ? "none" : "1px solid rgba(255,255,255,0.15)",
                  padding: "12px 0",
                  borderRadius: 30,
                  textDecoration: "none",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseOver={(e) => {
                  if (plan.featured) {
                    e.currentTarget.style.background = "var(--color-gold-light)";
                  } else {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }
                }}
                onMouseOut={(e) => {
                  if (plan.featured) {
                    e.currentTarget.style.background = "var(--color-gold)";
                  } else {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.2vw, 42px)", fontWeight: 700, color: "#EDEDED", lineHeight: 1.12, margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="faq-container">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 40}>
              <details className="faq-card" name="landing-faq">
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
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="footer-responsive" style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "32px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        flexWrap: "wrap",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED" }}>
          Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
        </span>
        <p style={{ fontSize: 12, color: "#555", margin: 0 }}>
          © 2026 Sahajta AI Solutions Pvt. Ltd. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
          <Link href="/blog" className="footer-link">Blog</Link>
          <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          <Link href="/refund" className="footer-link">Refund Policy</Link>
          <a href="mailto:contact@sahajta.com" className="footer-link">Contact Us</a>
        </div>
      </footer>

      {/* ── Responsive Mobile Overrides ────────────────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 40px 16px !important;
            gap: 32px !important;
          }
          .hero-right {
            display: flex !important;
            justify-content: center !important;
            margin-top: 12px !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          nav {
            padding: 0 16px !important;
            height: 70px !important;
          }
          nav div {
            gap: 16px !important;
          }
          nav a:not([href="/auth"]) {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
