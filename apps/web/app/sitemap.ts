import type { MetadataRoute } from "next";

const BASE_URL = "https://snapit.rekabytes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Future pages — uncomment when landing page is added:
    // {
    //   url: `${BASE_URL}/editor`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.9,
    // },
  ];
}
