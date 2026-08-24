import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://enterpriseerp-web.onrender.com";
  const now = new Date();

  const routes = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/cloud", priority: 0.9, changeFrequency: "weekly" },
    { path: "/solutions", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/demo", priority: 0.9, changeFrequency: "weekly" },
    { path: "/integrations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/security", priority: 0.8, changeFrequency: "monthly" },
    { path: "/status", priority: 0.7, changeFrequency: "daily" },
    { path: "/support", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/roi", priority: 0.75, changeFrequency: "monthly" },
    { path: "/roadmap", priority: 0.75, changeFrequency: "monthly" },
    { path: "/commerce", priority: 0.85, changeFrequency: "monthly" },
    { path: "/restaurant", priority: 0.85, changeFrequency: "monthly" },
    { path: "/hotel", priority: 0.85, changeFrequency: "monthly" },
    { path: "/construction", priority: 0.85, changeFrequency: "monthly" },
    { path: "/industrie", priority: 0.85, changeFrequency: "monthly" },
    { path: "/transport", priority: 0.85, changeFrequency: "monthly" },
    { path: "/sante", priority: 0.85, changeFrequency: "monthly" },
    { path: "/education", priority: 0.85, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: route.priority,
  }));
}
