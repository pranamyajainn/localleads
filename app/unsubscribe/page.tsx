import { Metadata } from "next";
import UnsubscribeButton from "@/components/UnsubscribeButton";

export const metadata: Metadata = {
  title: "Unsubscribe — LocalLeads",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#EDEDED",
        fontFamily: "sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
        padding: 40,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 28,
          fontWeight: 700,
          margin: 0,
        }}
      >
        Unsubscribe
      </h1>
      <p style={{ color: "#555", fontSize: 16, margin: 0 }}>
        Click below to stop receiving emails{email ? ` for ${email}` : ""}.
      </p>
      <UnsubscribeButton email={email} />
      <p style={{ color: "#333", fontSize: 13, margin: 0 }}>
        Changed your mind?{" "}
        <a
          href="https://localleads.sahajta.com/blog"
          style={{ color: "#22C55E" }}
        >
          Go back to the blog
        </a>
      </p>
    </main>
  );
}
