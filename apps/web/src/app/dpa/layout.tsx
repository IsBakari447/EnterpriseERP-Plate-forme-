import type { ReactNode } from "react";
import { buildPageMetadata } from "@shared/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "DPA RGPD EnterpriseERP Cloud",
  description: "Base DPA et traitement RGPD pour EnterpriseERP Cloud.",
  path: "/dpa",
});

export default function DpaLayout({ children }: { children: ReactNode }) {
  return children;
}
