"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p style={{
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        color: "var(--color-gold)",
        fontWeight: 600,
        marginTop: 20,
      }}>
        Check your inbox!
      </p>
    );
  }

  return (
    <>
      <form
        className="newsletter-input-group"
        onSubmit={handleSubscribe}
      >
        <input
          type="email"
          placeholder="Enter your email address"
          required
          className="newsletter-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="newsletter-btn"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "#F87171",
          marginTop: 10,
        }}>
          Something went wrong. Try again.
        </p>
      )}
    </>
  );
}
