import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Créer un compte EnterpriseERP Cloud",
  description: "Création d'un espace EnterpriseERP Cloud pour démarrer un essai SaaS.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
