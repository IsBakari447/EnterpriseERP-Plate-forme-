import type { ReactNode } from "react";
import { buildPageMetadata } from "@shared/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Demo live EnterpriseERP Cloud | Apercu ERP sans compte",
  description:
    "Ouvrez une demo publique EnterpriseERP Cloud avec dashboard, CRM, stock et facturation sur donnees fictives sectorisees.",
  path: "/demo/live",
  keywords: ["demo ERP live", "ERP sans compte", "demo EnterpriseERP", "ERP Cloud demo"],
});

export default function DemoLiveLayout({ children }: { children: ReactNode }) {
  return children;
}
