import type { Metadata } from "next";

import "./globals.css";
import { SectorProvider } from "@shared/sector/SectorProvider";
import { I18nProvider } from "@shared/i18n/I18nProvider";
import { JsonLd, buildGlobalJsonLd } from "@shared/seo/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://enterpriseerp-web.onrender.com"
  ),

  title: {
    default:
      "EnterpriseERP Cloud | Cloud ERP, Mobile and AI",
    template:
      "%s | EnterpriseERP Cloud",
  },

  description:
    "EnterpriseERP Cloud brings CRM, sales, billing, inventory, finance, HR, mobile and AI into a modern SaaS ERP for SMEs and growing companies.",

  applicationName:
    "EnterpriseERP Cloud",

  keywords: [
    "EnterpriseERP",
    "EnterpriseERP Cloud",
    "ERP Cloud",
    "ERP SaaS",
    "ERP software",
    "SME ERP",
    "business management",
    "CRM",
    "sales management",
    "inventory management",
    "billing",
    "finance",
    "human resources",
    "AI ERP",
    "business AI assistant",
    "ERP mobile",
  ],

  authors: [
    {
      name: "EnterpriseERP",
    },
  ],

  creator:
    "EnterpriseERP",

  publisher:
    "EnterpriseERP",

  category:
    "Business Software",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",

    url:
      "https://enterpriseerp-web.onrender.com/",

    siteName:
      "EnterpriseERP Cloud",

    title:
      "EnterpriseERP Cloud | Cloud ERP, Mobile and AI",

    description:
      "Centralize CRM, sales, billing, inventory, finance, HR, mobile and AI in one Cloud ERP platform.",

    images: [
      {
        url: "/enterpriseerp-og.png",
        width: 1200,
        height: 630,
        alt: "EnterpriseERP Cloud ERP SaaS",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "EnterpriseERP Cloud | Cloud ERP, Mobile and AI",

    description:
      "Modern Cloud ERP for CRM, sales, billing, inventory, finance, HR, mobile and AI.",

    images: [
      "/enterpriseerp-og.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <JsonLd data={buildGlobalJsonLd()} />
        <I18nProvider>
          <SectorProvider>
            <div id="main-content">{children}</div>
          </SectorProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
