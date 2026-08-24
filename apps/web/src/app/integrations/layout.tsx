import type { ReactNode } from "react";

import { publicPageMetadata } from "@shared/seo/page-metadata";

export const metadata = publicPageMetadata.integrations;

export default function IntegrationsLayout({ children }: { children: ReactNode }) {
  return children;
}
