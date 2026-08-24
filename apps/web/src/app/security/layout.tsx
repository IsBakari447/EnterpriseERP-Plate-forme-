import type { ReactNode } from "react";

import { publicPageMetadata } from "@shared/seo/page-metadata";

export const metadata = publicPageMetadata.security;

export default function SecurityLayout({ children }: { children: ReactNode }) {
  return children;
}
