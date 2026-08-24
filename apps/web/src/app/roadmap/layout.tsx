import type { ReactNode } from "react";

import { publicPageMetadata } from "@shared/seo/page-metadata";

export const metadata = publicPageMetadata.roadmap;

export default function RoadmapLayout({ children }: { children: ReactNode }) {
  return children;
}
