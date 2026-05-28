export default function RefundPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#EDEDED", padding: "80px 40px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <a href="/" style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED", textDecoration: "none", display: "inline-block", marginBottom: 48 }}>
          Local<span style={{ color: "var(--color-gold)" }}>Leads</span>
        </a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Refund Policy
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555", margin: "0 0 40px" }}>
          Last updated: January 2026
        </p>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#888", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 20 }}>
          <p>
            LocalLeads subscriptions are billed monthly. You may cancel anytime from your dashboard. Refunds are not provided for partial months. For any billing issues, contact{" "}
            <a href="mailto:contact@sahajta.com" style={{ color: "var(--color-gold)", textDecoration: "none" }}>contact@sahajta.com</a>{" "}
            and we will respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
