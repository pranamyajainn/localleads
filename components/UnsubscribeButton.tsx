"use client";
import { useState } from "react";

export default function UnsubscribeButton({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleUnsubscribe() {
    if (!email || status !== "idle") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p style={{ color: "#22C55E", fontSize: 16, margin: 0 }}>
        Done. You will not receive any more emails.
      </p>
    );
  }

  return (
    <>
      <button
        onClick={handleUnsubscribe}
        disabled={status === "loading"}
        style={{
          background: status === "loading" ? "#333" : "#EF4444",
          color: "#fff",
          border: "none",
          padding: "14px 32px",
          fontFamily: "sans-serif",
          fontSize: 15,
          fontWeight: 700,
          cursor: status === "loading" ? "wait" : "pointer",
        }}
      >
        {status === "loading" ? "Processing..." : "Unsubscribe me"}
      </button>
      {status === "error" && (
        <p style={{ color: "#EF4444", fontSize: 14, margin: 0 }}>
          Something went wrong. Try again.
        </p>
      )}
    </>
  );
}
