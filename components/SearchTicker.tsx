"use client";

import { useEffect, useState } from "react";

const FEED = [
  { cat: "Restaurants",       city: "Mumbai",     n: 47 },
  { cat: "CA Firms",          city: "Delhi",      n: 23 },
  { cat: "Beauty Salons",     city: "Pune",       n: 18 },
  { cat: "Gyms",              city: "Hyderabad",  n: 14 },
  { cat: "Travel Agents",     city: "Ahmedabad",  n: 22 },
  { cat: "Coaching Centers",  city: "Jaipur",     n: 9  },
  { cat: "Clinics",           city: "Bangalore",  n: 27 },
  { cat: "Boutiques",         city: "Chennai",    n: 16 },
  { cat: "Photographers",     city: "Kolkata",    n: 20 },
  { cat: "Tutors",            city: "Nagpur",     n: 12 },
];

const MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', monospace",
};

export function SearchTicker() {
  const [shown, setShown] = useState(5);

  useEffect(() => {
    const t = setInterval(() => {
      setShown((s) => (s >= FEED.length ? 1 : s + 1));
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const items = FEED.slice(0, shown);

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: "rgba(8, 8, 8, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 9,
          backgroundColor: "rgba(4, 4, 4, 0.75)",
          flexShrink: 0,
        }}
      >
        <span
          className="pulse-dot"
          style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#22C55E", display: "inline-block", flexShrink: 0,
          }}
        />
        <span style={{ ...MONO, fontSize: 10, color: "#3A3A3A", letterSpacing: "0.08em" }}>
          live searches · right now
        </span>
        <span style={{ ...MONO, fontSize: 10, color: "#22C55E", marginLeft: "auto", letterSpacing: "0.06em" }}>
          {shown * 3 + 841} found today
        </span>
      </div>

      {/* Feed rows */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {items.map((item, i) => {
          const isNewest = i === items.length - 1;
          const distFromNewest = items.length - 1 - i;
          const opacity = isNewest ? 1 : Math.max(0.14, 0.55 - distFromNewest * 0.1);
          return (
            <div
              key={i}
              style={{
                padding: "12px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity,
                animation: isNewest ? "slideIn 0.35s ease forwards" : "none",
                transition: "opacity 0.4s ease",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...MONO, fontSize: 10, color: "#2A2A2A" }}>→</span>
                <span style={{ ...MONO, fontSize: 12, color: isNewest ? "#D4D0C8" : "#555" }}>
                  {item.cat}
                </span>
                <span style={{ ...MONO, fontSize: 12, color: "#2A2A2A" }}>·</span>
                <span style={{ ...MONO, fontSize: 12, color: "#444" }}>{item.city}</span>
              </div>
              <span style={{ ...MONO, fontSize: 11, color: isNewest ? "#22C55E" : "#2E2E2E", flexShrink: 0 }}>
                {item.n} leads
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          backgroundColor: "rgba(4, 4, 4, 0.75)",
          flexShrink: 0,
        }}
      >
        <span style={{ ...MONO, fontSize: 10, color: "#2A2A2A", letterSpacing: "0.05em" }}>
          50,000+ businesses indexed across{" "}
          <span style={{ color: "#3A3A3A" }}>200+ Indian cities</span>
        </span>
      </div>
    </div>
  );
}
