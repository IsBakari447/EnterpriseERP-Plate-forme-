import type { ReactNode } from "react";
import { buildPageMetadata } from "@shared/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Mentions legales EnterpriseERP Cloud",
  description: "Mentions legales, contact et informations d'edition EnterpriseERP Cloud.",
  path: "/legal",
});

export default function LegalLayout({ children }: { children: ReactNode }) {
  return children;
}
