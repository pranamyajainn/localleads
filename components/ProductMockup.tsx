"use client";

import { useEffect, useRef, useState } from "react";

const RESULTS = [
  { name: "Sharma Holidays Pvt. Ltd.", area: "Andheri West, Mumbai", phone: "+91 98765 43210" },
  { name: "Mehta & Associates CA", area: "Nariman Point, Mumbai", phone: "+91 87654 32109" },
  { name: "Sunita Beauty & Wellness", area: "Bandra West, Mumbai", phone: "+91 76543 21098" },
  { name: "Iron Will Gym & Fitness", area: "Juhu, Mumbai", phone: "+91 65432 10987" },
  { name: "Spice Route Restaurant", area: "Powai, Mumbai", phone: "+91 54321 09876" },
];

export function ProductMockup() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        border: "1px solid rgba(255,230,93,0.18)",
        background: "#0F0F0F",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Browser chrome bar */}
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0A0A0A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2a2a2a", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2a2a2a", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2a2a2a", display: "inline-block" }} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#333", display: "inline-block" }} />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                color: "#555",
                letterSpacing: "0.02em",
              }}
            >
              localleads.in/dashboard
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 5, height: 5, background: "var(--color-gold)", display: "inline-block" }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              color: "#555",
              letterSpacing: "0.04em",
            }}
          >
            8 credits remaining
          </span>
        </div>
      </div>

      {/* Dashboard body */}
      <div className="mockup-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>

        {/* Left — Search panel */}
        <div
          className="mockup-left"
          style={{
            padding: 28,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            background: "#0C0C0C",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            New Search
          </p>

          <div style={{ marginBottom: 10 }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                color: "#555",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Business Type
            </p>
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "9px 12px",
                fontSize: 13,
                color: "#F0EBE1",
                fontFamily: "var(--font-sans)",
              }}
            >
              Travel Agents
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                color: "#555",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              City
            </p>
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "9px 12px",
                fontSize: 13,
                color: "#F0EBE1",
                fontFamily: "var(--font-sans)",
              }}
            >
              Mumbai
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                color: "#555",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Localities
            </p>
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "9px 12px",
                fontSize: 13,
                color: "#555",
                fontFamily: "var(--font-sans)",
              }}
            >
              Andheri, Bandra...
            </div>
          </div>

          <div
            style={{
              background: "var(--color-gold)",
              padding: "11px 14px",
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#080808",
              fontFamily: "var(--font-sans)",
              cursor: "default",
            }}
          >
            Search →
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-gold)",
                fontWeight: 500,
              }}
            >
              12 businesses found
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                color: "#555",
                marginTop: 3,
              }}
            >
              Showing 1–5 · No website filter on
            </p>
          </div>
        </div>

        {/* Right — Results with blur on last 2 */}
        <div className="mockup-right" style={{ padding: "8px 0", position: "relative", overflow: "hidden" }}>
          {RESULTS.map((r, i) => {
            const blurred = i >= 3;
            return (
              <div
                key={i}
                style={{
                  padding: "18px 28px",
                  borderBottom: i < RESULTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.13}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.13}s`,
                  filter: blurred ? "blur(3.5px)" : "none",
                  userSelect: blurred ? "none" : undefined,
                  pointerEvents: blurred ? "none" : undefined,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#F0EBE1",
                        marginBottom: 3,
                      }}
                    >
                      {r.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 11,
                        color: "#555",
                        marginBottom: 10,
                      }}
                    >
                      {r.area} · No website
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        border: "1px solid rgba(255,230,93,0.3)",
                        fontSize: 12,
                        color: "var(--color-gold)",
                        fontFamily: "var(--font-sans)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {r.phone}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#444",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "default",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    Maps ↗
                  </span>
                </div>
              </div>
            );
          })}

          {/* Blur fade + CTA overlay — Curiosity Gap / Loss of Access */}
          {visible && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "52%",
                background: "linear-gradient(to bottom, transparent 0%, #0F0F0F 52%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 22,
              }}
            >
              <a
                href="/auth"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 20px",
                  background: "var(--color-gold)",
                  color: "#080808",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Sign in to see all 12 leads →
              </a>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .mockup-grid {
            grid-template-columns: 1fr !important;
          }
          .mockup-left {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .mockup-right {
            overflow: visible !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
