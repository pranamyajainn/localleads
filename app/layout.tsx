import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LocalLeads — Find businesses that need you",
  description:
    "LocalLeads surfaces local Indian businesses with no website and a live phone number. Ready to call in minutes.",
  keywords: ["local leads", "freelancer India", "business leads", "no website businesses"],
  openGraph: {
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "LocalLeads — Find businesses with no website",
    description:
      "Scan Google Maps and find local businesses with a phone number and no website. Ready to call in minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased bg-[#0A0A0A] text-[#F5F0E8]">{children}</body>
    </html>
  );
}
