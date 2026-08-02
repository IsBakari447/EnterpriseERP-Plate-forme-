"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/config/navigation";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";
import SectorSelector from "@shared/sector/SectorSelector";
import { useSector } from "@shared/sector/SectorProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { sector } = useSector();
  const { t } = useI18n();

  const visibleItems = navigationItems.filter((item) =>
    sector.modules.includes(item.key)
  );

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/10 bg-night px-4 py-5 text-white">
      <Link href="/" className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-base font-black text-night">
          E
        </div>
        <div className="min-w-0">
          <div className="truncate text-xl font-black">EnterpriseERP</div>
          <div className="text-xs font-semibold text-turquoise">{t("app.tagline")}</div>
        </div>
      </Link>

      <div className="space-y-3">
        <LanguageSwitcher compact />
        <SectorSelector />
      </div>

      <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1 enterprise-scroll">
        {visibleItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const label = sector.labels?.[item.key] ?? t(`nav.${item.key}`);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-white text-night shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base font-black leading-none ${
                  active ? "bg-night text-white" : "bg-white/10 text-turquoise"
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
