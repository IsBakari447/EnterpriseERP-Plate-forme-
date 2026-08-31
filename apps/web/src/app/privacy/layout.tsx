import type { ReactNode } from "react";
import { buildPageMetadata } from "@shared/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Confidentialite EnterpriseERP Cloud",
  description: "Politique de confidentialite et traitement des donnees EnterpriseERP Cloud.",
  path: "/privacy",
});

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
