"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function MarketingHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <Image src="/enterpriseerp-icon.png" alt="EnterpriseERP" width={42} height={42} className="h-10 w-10 object-contain" priority />
          </span>

          <div>
            <div className="text-xl font-bold text-[#1E2A38]">
              EnterpriseERP
            </div>
            <div className="text-xs font-medium text-[#00A990]">
              {t("app.tagline")}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          <a href="#problemes" className="transition hover:text-[#00A990]">
            {t("marketing.challenges")}
          </a>
          <a href="#modules" className="transition hover:text-[#00A990]">
            {t("marketing.modules")}
          </a>
          <a href="#demo" className="transition hover:text-[#00A990]">
            {t("marketing.demo")}
          </a>
          <a href="#tarifs" className="transition hover:text-[#00A990]">
            {t("marketing.pricing")}
          </a>
          <a href="#roadmap" className="transition hover:text-[#00A990]">
            {t("marketing.roadmap")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher compact />
          <Link
            href="/login"
            className="hidden rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-[#1E2A38] transition hover:bg-slate-50 sm:inline-flex"
          >
            {t("marketing.openPlatform")}
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-[#FF7A00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e66e00]"
          >
            {t("auth.createAccount")}
          </Link>
        </div>
      </div>
    </header>
  );
}
