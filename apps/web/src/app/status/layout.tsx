import type { ReactNode } from "react";

import { publicPageMetadata } from "@shared/seo/page-metadata";

export const metadata = publicPageMetadata.status;

export default function StatusLayout({ children }: { children: ReactNode }) {
  return children;
}
