import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = [
    "bangalore", "mumbai", "delhi", "pune",
    "jaipur", "hyderabad", "ahmedabad", "surat",
  ];

  const cityPages = cities.map((city) => ({
    url: `https://localleads.sahajta.com/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://localleads.sahajta.com",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: "https://localleads.sahajta.com/blog",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: "https://localleads.sahajta.com/pricing",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: "https://localleads.sahajta.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: "https://localleads.sahajta.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: "https://localleads.sahajta.com/refund",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    ...cityPages,
  ];
}
