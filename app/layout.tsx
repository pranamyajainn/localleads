import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://localleads.sahajta.com"),
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
      <body className="antialiased bg-[#0A0A0A] text-[#F5F0E8]">
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '909588332098654');
          fbq('track', 'PageView');
        `}</Script>
        <Script id="namyah-pixel" strategy="afterInteractive">
{`
  !function(){var n=window.namyah=function(){(n.q=n.q||[]).push(arguments)};
    var s=document.createElement("script");
    s.src="https://smartbudget.qzz.io/api/pixel/namyah.js?id=pxl_9GhdtEf5fcfmdp";
    s.async=true;document.head.appendChild(s);
  }();
  namyah("init","pxl_9GhdtEf5fcfmdp");
`}
        </Script>
      </body>
    </html>
  );
}
