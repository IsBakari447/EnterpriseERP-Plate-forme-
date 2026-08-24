import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://enterpriseerp-web.onrender.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/admin/",
          "/api/",
          "/audit/",
          "/dashboard/",
          "/forgot-password/",
          "/login/",
          "/modules/",
          "/onboarding/",
          "/parametres/",
          "/profile/",
          "/register/",
          "/reset-password/",
          "/security-center/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
