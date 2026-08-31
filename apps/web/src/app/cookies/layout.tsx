import type { ReactNode } from "react";
import { buildPageMetadata } from "@shared/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Cookies EnterpriseERP Cloud",
  description: "Politique cookies et stockages techniques EnterpriseERP Cloud.",
  path: "/cookies",
});

export default function CookiesLayout({ children }: { children: ReactNode }) {
  return children;
}
