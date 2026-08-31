import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Reinitialiser le mot de passe | EnterpriseERP Cloud",
  description: "Reinitialisation securisee du mot de passe EnterpriseERP Cloud.",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
