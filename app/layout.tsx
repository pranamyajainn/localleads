import type { Metadata } from "next";
import { Inter, Outfit, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://localleads.sahajta.com"),
  title: {
    default: "LocalLeads — Find Local Businesses With No Website",
    template: "%s | LocalLeads",
  },
  description:
    "LocalLeads scans Google Maps and finds local businesses with a phone number and no website. Get 20 free leads — no credit card needed. Used by freelancers across Mumbai, Pune, Bangalore, Delhi, Jaipur and Hyderabad.",
  keywords: [
    "local business leads india",
    "find businesses without website",
    "google maps lead extractor",
    "website leads for freelancers",
    "local lead generation india",
    "businesses without website india",
    "web design leads",
    "freelancer lead generation tool",
    "cold outreach leads india",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://localleads.sahajta.com",
    siteName: "LocalLeads",
    title: "LocalLeads — Find Local Businesses With No Website",
    description:
      "Scan Google Maps and find businesses with a live phone number and no website. Free trial — no credit card.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalLeads — Find Local Businesses With No Website",
    description:
      "Scan Google Maps and find businesses with a live phone number and no website. Free trial — no credit card.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://localleads.sahajta.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "LocalLeads",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "LocalLeads scans Google Maps and finds local businesses with a phone number and no website. Used by Indian freelancers and agencies for lead generation.",
              url: "https://localleads.sahajta.com",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
                description: "Free trial with 20 leads, no credit card required",
              },
              creator: {
                "@type": "Organization",
                name: "Sahajta AI Solutions Pvt. Ltd.",
                url: "https://sahajta.com",
              },
            }),
          }}
        />
      </head>
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
{`
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "wxkxjp6vpl");
`}
        </Script>
      </body>
    </html>
  );
}
