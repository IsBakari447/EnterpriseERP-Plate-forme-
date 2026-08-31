import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Creer un compte EnterpriseERP Cloud",
  description: "Creation d'un espace EnterpriseERP Cloud pour demarrer un essai SaaS.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
