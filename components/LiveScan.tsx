"use client";

import { useEffect, useRef, useState } from "react";

const QUERY = "Travel Agents · Mumbai";
const RESULTS = [
  { n: "Sharma Holidays Pvt. Ltd.",  p: "+91 98765 43210", a: "Andheri West" },
  { n: "Global Travel Services",     p: "+91 87654 32109", a: "Bandra West"  },
  { n: "Yatra Express Travels",      p: "+91 76543 21098", a: "Juhu"         },
  { n: "Mehta Tours & Travels",      p: "+91 65432 10987", a: "Dadar"        },
  { n: "Skyline Travel Agency",      p: "+91 54321 09876", a: "Borivali"     },
];

const MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', 'Fira Code', monospace",
};

export function LiveScan() {
  const [phase, setPhase] = useState<"idle" | "typing" | "scanning" | "done">("idle");
  const [typed, setTyped] = useState("");
  const [pct, setPct] = useState(0);
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          go();
          obs.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function go() {
    setTimeout(() => {
      setPhase("typing");
      let i = 0;
      const ti = setInterval(() => {
        setTyped(QUERY.slice(0, ++i));
        if (i >= QUERY.length) {
          clearInterval(ti);
          setTimeout(() => {
            setPhase("scanning");
            let p = 0;
            const si = setInterval(() => {
              p = Math.min(p + 2, 100);
              setPct(p);
              if (p >= 100) {
                clearInterval(si);
                setTimeout(() => {
                  setPhase("done");
                  let r = 0;
                  const ri = setInterval(() => {
                    setShown(++r);
                    if (r >= RESULTS.length) clearInterval(ri);
                  }, 200);
                }, 250);
              }
            }, 22);
          }, 550);
        }
      }, 48);
    }, 600);
  }

  const row: React.CSSProperties = {
    ...MONO,
    fontSize: 13,
    lineHeight: "2",
    display: "flex",
    gap: 20,
    flexWrap: "wrap" as const,
  };

  return (
    <div
      ref={ref}
      style={{
        background: "#0A0A0A",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#080808",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#222",
              display: "inline-block",
            }}
          />
        ))}
        <span style={{ ...MONO, fontSize: 11, color: "#444", marginLeft: 12, letterSpacing: "0.04em" }}>
          localleads — live scan
        </span>
        {phase === "scanning" && (
          <span
            style={{
              ...MONO,
              fontSize: 10,
              color: "var(--color-gold)",
              marginLeft: "auto",
              letterSpacing: "0.08em",
            }}
          >
            SCANNING {pct}%
          </span>
        )}
        {phase === "done" && (
          <span
            style={{
              ...MONO,
              fontSize: 10,
              color: "var(--color-gold)",
              marginLeft: "auto",
              letterSpacing: "0.08em",
            }}
          >
            ✓ DONE
          </span>
        )}
      </div>

      {/* Terminal body */}
      <div style={{ padding: "28px 36px", minHeight: 300 }}>

        {/* Prompt line */}
        <div style={{ ...MONO, fontSize: 13, lineHeight: "1.8", color: "#555" }}>
          <span style={{ color: "var(--color-gold)" }}>›</span>{" "}
          <span style={{ color: "#444" }}>query:</span>{" "}
          <span style={{ color: "#EDEDED" }}>{typed}</span>
          {(phase === "idle" || phase === "typing") && (
            <span className="cursor" style={{ background: "#EDEDED" }} />
          )}
        </div>

        {/* Scanning bar */}
        {(phase === "scanning" || phase === "done") && (
          <div style={{ marginTop: 16 }}>
            <div style={{ ...MONO, fontSize: 12, color: "#555", marginBottom: 8, letterSpacing: "0.06em" }}>
              {phase === "scanning" ? (
                <>
                  scanning google maps
                  <span className="cursor" style={{ background: "#555" }} />
                </>
              ) : (
                <span style={{ color: "var(--color-gold)" }}>✓ scan complete — 12 businesses found</span>
              )}
            </div>
            <div
              style={{
                height: 2,
                background: "rgba(255,255,255,0.06)",
                marginBottom: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 2,
                  background: "linear-gradient(90deg, rgba(255,230,93,0.6), var(--color-gold))",
                  width: `${pct}%`,
                  transition: "width 0.025s linear",
                }}
              />
            </div>
          </div>
        )}

        {/* Results */}
        {phase === "done" && shown > 0 && (
          <div>
            <div
              style={{
                ...MONO,
                fontSize: 11,
                color: "#444",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
                paddingBottom: 10,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              showing {Math.min(shown, RESULTS.length)} of 12 &nbsp;·&nbsp; filter: no website &nbsp;·&nbsp; phone verified
            </div>
            <div>
              {RESULTS.slice(0, shown).map((r, i) => (
                <div
                  key={i}
                  style={{
                    ...row,
                    paddingBottom: 4,
                    opacity: 1,
                    animation: "fadeUp 0.3s ease forwards",
                  }}
                >
                  <span style={{ color: "#333", minWidth: 20, flexShrink: 0 }}>0{i + 1}</span>
                  <span style={{ color: "#EDEDED", flex: 1, minWidth: 180 }}>{r.n}</span>
                  <span style={{ color: "var(--color-gold)" }}>{r.p}</span>
                  <span style={{ color: "#555" }}>{r.a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
