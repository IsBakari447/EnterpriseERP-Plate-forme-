"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function MarketingHeader() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "/#problemes", label: t("marketing.challenges") },
    { href: "/#modules", label: t("marketing.modules") },
    { href: "/demo", label: t("marketing.demo") },
    { href: "/pricing", label: t("marketing.pricing") },
    { href: "/roadmap", label: t("marketing.roadmap") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <Image src="/enterpriseerp-icon.png" alt="EnterpriseERP" width={40} height={40} className="h-9 w-9 object-contain" priority />
          </span>
          <div>
            <div className="text-lg font-black tracking-tight text-[#102136] sm:text-xl">EnterpriseERP</div>
            <div className="text-[11px] font-bold text-[#009a87] sm:text-xs">{t("app.tagline")}</div>
          </div>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#009a87]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block"><LanguageSwitcher compact /></div>
          <Link href="/login" className="hidden rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-[#102136] transition hover:border-slate-400 hover:bg-slate-50 xl:inline-flex">
            {t("marketing.openPlatform")}
          </Link>
          <Link href="/register" className="hidden rounded-xl bg-[#FF7A00] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#e66e00] hover:shadow-md sm:inline-flex">
            {t("market.plan.0.price")}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="marketing-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-black text-[#102136] lg:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="marketing-mobile-menu" className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
          <nav aria-label="Navigation mobile" className="mx-auto grid max-w-[1400px] gap-2">
            <div className="mb-2 sm:hidden"><LanguageSwitcher compact /></div>
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                {link.label}
              </Link>
            ))}
            <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-xl bg-[#FF7A00] px-4 py-3 text-center text-sm font-black text-white sm:hidden">
              {t("market.plan.0.price")}
            </Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#009a87]">
              {t("marketing.openPlatform")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
