import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mot de passe oublie | EnterpriseERP Cloud",
  description: "Demande securisee de recuperation de mot de passe EnterpriseERP Cloud.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
