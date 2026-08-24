import type { ReactNode } from "react";

import { publicPageMetadata } from "@shared/seo/page-metadata";

export const metadata = publicPageMetadata.pricing;

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
