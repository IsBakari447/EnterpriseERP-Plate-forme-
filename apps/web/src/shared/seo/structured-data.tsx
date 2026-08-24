const siteUrl = "https://enterpriseerp-web.onrender.com";
const logoUrl = `${siteUrl}/enterpriseerp-logo.png`;
const ogImageUrl = `${siteUrl}/enterpriseerp-og.png`;

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function buildGlobalJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "EnterpriseERP",
      url: siteUrl,
      logo: logoUrl,
      sameAs: ["https://github.com/IsBakari447/EnterpriseERP-Plate-forme-"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "EnterpriseERP Cloud",
      url: siteUrl,
      inLanguage: ["fr", "en", "sv", "es", "de", "pt", "it", "nl"],
      publisher: {
        "@type": "Organization",
        name: "EnterpriseERP",
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "EnterpriseERP Cloud",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Android, iOS",
      url: siteUrl,
      image: ogImageUrl,
      description:
        "ERP SaaS Cloud pour centraliser CRM, ventes, facturation, stock, finance, RH, mobile et IA.",
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/pricing`,
      },
    },
  ];
}

export function buildSectorServiceJsonLd({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string;
}) {
  const pageUrl = `${siteUrl}/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: "ERP Cloud SaaS",
    provider: {
      "@type": "Organization",
      name: "EnterpriseERP",
      url: siteUrl,
      logo: logoUrl,
    },
    areaServed: "Worldwide",
    url: pageUrl,
    description,
    image: ogImageUrl,
  };
}
