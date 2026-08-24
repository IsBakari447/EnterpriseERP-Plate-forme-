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
      "EnterpriseERP Cloud | ERP Cloud, Mobile et IA",
    template:
      "%s | EnterpriseERP Cloud",
  },

  description:
    "EnterpriseERP Cloud centralise CRM, ventes, facturation, stock, finance, RH, mobile et IA dans un ERP SaaS moderne pour PME et entreprises.",

  applicationName:
    "EnterpriseERP Cloud",

  keywords: [
    "EnterpriseERP",
    "EnterpriseERP Cloud",
    "ERP Cloud",
    "ERP SaaS",
    "logiciel ERP",
    "ERP PME",
    "gestion entreprise",
    "CRM",
    "gestion des ventes",
    "gestion de stock",
    "facturation",
    "finance",
    "ressources humaines",
    "ERP IA",
    "assistant IA entreprise",
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
    locale: "fr_FR",

    url:
      "https://enterpriseerp-web.onrender.com/",

    siteName:
      "EnterpriseERP Cloud",

    title:
      "EnterpriseERP Cloud | ERP Cloud, Mobile et IA",

    description:
      "Centralisez CRM, ventes, facturation, stock, finance, RH, mobile et IA dans une seule plateforme ERP Cloud.",

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
      "EnterpriseERP Cloud | ERP Cloud, Mobile et IA",

    description:
      "ERP Cloud moderne pour CRM, ventes, facturation, stock, finance, RH, mobile et IA.",

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
    <html lang="fr" suppressHydrationWarning>
      <body>
        <JsonLd data={buildGlobalJsonLd()} />
        <I18nProvider>
          <SectorProvider>{children}</SectorProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
