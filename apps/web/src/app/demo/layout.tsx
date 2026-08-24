import type { ReactNode } from "react";

import { publicPageMetadata } from "@shared/seo/page-metadata";

export const metadata = publicPageMetadata.demo;

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
