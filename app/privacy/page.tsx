export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#EDEDED", padding: "80px 40px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <a href="/" style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#EDEDED", textDecoration: "none", display: "inline-block", marginBottom: 48 }}>
          Local<span style={{ color: "#22C55E" }}>Leads</span>
        </a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#555", margin: "0 0 40px" }}>
          Last updated: June 2025
        </p>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "#888", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 20 }}>
          <p>
            LocalLeads is operated by Sahajta AI Solutions. We collect only the data required to operate the service.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Data we collect.</strong> When you sign in, we store your email address and Google account ID. We store your search history and the leads you have found so you can access them later. We store your subscription status and billing cycle information.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>How we use your data.</strong> Your email is used to send you account-related emails (welcome, upgrade prompts). We do not sell your data to third parties. We do not use your data for advertising purposes other than our own product.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Third-party services.</strong> We use Firebase (Google) for authentication and data storage, Razorpay for payment processing, Resend for transactional email, and Google Maps API to surface business data. Each of these services has its own privacy policy.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Analytics.</strong> We use Meta Pixel and Meta Conversions API to measure the effectiveness of our advertising. This involves sending hashed email addresses to Meta when you complete key actions (sign-up, purchase). You may opt out via your Facebook ad preferences.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Data retention.</strong> Your account data is retained as long as your account is active. You may request deletion by emailing us.
          </p>
          <p>
            <strong style={{ color: "#EDEDED" }}>Contact.</strong> For any queries regarding this policy, email{" "}
            <a href="mailto:contact@sahajta.com" style={{ color: "#22C55E", textDecoration: "none" }}>contact@sahajta.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
