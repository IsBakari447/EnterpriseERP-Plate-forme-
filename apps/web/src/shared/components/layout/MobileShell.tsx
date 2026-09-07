"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/config/navigation";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { useSector } from "@shared/sector/SectorProvider";

export default function MobileShell() {
  const pathname = usePathname();
  const { enabledModules, sector, sectorKey } = useSector();
  const { locale, t } = useI18n();
  const translateSectorLabel = (value: string) =>
    translateContentText(translateFixedLabel(value, locale), locale);

  const alwaysVisibleKeys = new Set(["dashboard", "parametres"]);
  const visibleItems = navigationItems.filter((item) => {
    const sectorAllowsModule = sector.modules.includes(item.key);
    const companyAllowsModule =
      enabledModules.length === 0 ||
      enabledModules.includes(item.key) ||
      alwaysVisibleKeys.has(item.key);

    return sectorAllowsModule && companyAllowsModule;
  });

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow ring-1 ring-slate-200">
            <Image
              src="/enterpriseerp-icon.png"
              alt="EnterpriseERP Cloud"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black text-night">EnterpriseERP</span>
            <span className="block truncate text-xs font-bold text-turquoise">{t("app.tagline")}</span>
          </span>
        </Link>

        <div className="w-36 shrink-0">
          <LanguageSwitcher compact />
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-night px-4 py-3 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
          {t("dashboard.filter.sector")}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00C2A9]/15 text-lg">
            {sector.icon || "E"}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black">{t(`sector.${sectorKey}`)}</span>
            <span className="block truncate text-[11px] font-semibold text-white/45">
              EnterpriseERP Platform
            </span>
          </span>
        </div>
      </div>

      <nav className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 enterprise-scroll">
        {visibleItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const label = sector.labels?.[item.key]
            ? translateSectorLabel(sector.labels[item.key]!)
            : t(`nav.${item.key}`);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-black transition ${
                active
                  ? "bg-night text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-white hover:text-night"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 items-center justify-center rounded-xl text-[10px] font-black ${
                  active ? "bg-white/10 text-turquoise" : "bg-white text-turquoise"
                }`}
              >
                {item.icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
