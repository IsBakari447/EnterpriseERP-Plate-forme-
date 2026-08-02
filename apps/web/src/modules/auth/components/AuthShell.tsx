"use client";

import Link from "next/link";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";

export default function AuthShell({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-10 text-night">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden bg-[#1E2A38] p-8 text-white lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,194,169,.28),transparent_32%),linear-gradient(135deg,rgba(255,122,0,.18),transparent_42%)]" />
          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-night">
                E
              </span>
              <span>
                <span className="block text-xl font-black">EnterpriseERP</span>
                <span className="text-xs font-bold text-[#00C2A9]">Cloud · Mobile · IA</span>
              </span>
            </Link>

            <div className="mt-6">
              <LanguageSwitcher compact />
            </div>

            <div className="mt-14 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-[#00C2A9]">
              {eyebrow}
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight lg:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/75">
              {text}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["JWT", "RBAC", "Sessions"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-black">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12">{children}</div>
      </section>
    </main>
  );
}
