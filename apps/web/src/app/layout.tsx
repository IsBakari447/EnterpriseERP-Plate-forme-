import type { Metadata } from "next";

import "./globals.css";
import { SectorProvider } from "@shared/sector/SectorProvider";
import { I18nProvider } from "@shared/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "EnterpriseERP Cloud",
  description:
    "ERP Cloud, Mobile et AI pour les entreprises modernes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <SectorProvider>{children}</SectorProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
