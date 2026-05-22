export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#EDEDED", padding: "80px 40px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <a href="/" style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED", textDecoration: "none", display: "inline-block", marginBottom: 48 }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555", margin: "0 0 40px" }}>
          Last updated: June 2025
        </p>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#888", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 20 }}>
          <p>
            LocalLeads is operated by Sahajta AI Solutions. By using LocalLeads, you agree to these terms.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Service.</strong> LocalLeads surfaces publicly available business information from Google Maps. You may use this information to contact businesses for legitimate commercial purposes. You may not use it for spam, harassment, or any unlawful purpose.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Subscriptions.</strong> Paid plans are billed monthly via Razorpay. You may cancel at any time. Your access continues until the end of the current billing period. No refunds are issued for partial months.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Lead credits.</strong> Credits reset at the start of each billing cycle. Unused credits do not carry over. Free plan credits are lifetime and do not reset.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Acceptable use.</strong> You agree not to attempt to reverse engineer, scrape, or extract data from LocalLeads beyond normal use of the product. You agree not to share your account credentials with others.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Limitation of liability.</strong> LocalLeads is provided as-is. We make no guarantees about the accuracy or completeness of business information. We are not liable for any outcomes resulting from your use of leads found through the product.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Contact.</strong> For any queries regarding these terms, email{" "}
            <a href="mailto:contact@sahajta.com" style={{ color: "#22C55E", textDecoration: "none" }}>contact@sahajta.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
