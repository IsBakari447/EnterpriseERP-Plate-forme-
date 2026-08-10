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
  const administrationKeys = new Set(["utilisateurs", "roles-permissions"]);
  const businessItems = visibleItems.filter((item) => !administrationKeys.has(item.key));
  const administrationItems = visibleItems.filter((item) => administrationKeys.has(item.key));
  const accountItems = [
    { href: "/profile", label: t("account.profile"), icon: "ME" },
    { href: "/account/security", label: t("account.security"), icon: "SC" },
    { href: "/account/sessions", label: t("account.sessions"), icon: "DV" },
    { href: "/account/preferences", label: t("account.preferences"), icon: "PF" },
  ];
  const adminExtraItems = [
    { href: "/audit", label: t("account.audit"), icon: "AU" },
    { href: "/security-center", label: t("account.securityCenter"), icon: "SE" },
  ];

  const renderLink = (item: { href: string; label: string; icon: string; key?: string }) => {
    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.key ?? item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
          active
            ? "bg-white text-night shadow-sm"
            : "text-slate-200 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black leading-none ${
            active ? "bg-night text-white" : "bg-white/10 text-turquoise"
          }`}
        >
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

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

      <nav className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1 enterprise-scroll">
        <div className="space-y-1">
          {businessItems.map((item) =>
            renderLink({
              key: item.key,
              href: item.href,
              icon: item.icon,
              label: t(`nav.${item.key}`),
            })
          )}
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{t("account.section")}</p>
          <div className="space-y-1">{accountItems.map(renderLink)}</div>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{t("admin.section")}</p>
          <div className="space-y-1">
            {administrationItems.map((item) =>
              renderLink({
                key: item.key,
                href: item.href,
                icon: item.icon,
                label: t(`nav.${item.key}`),
              })
            )}
            {adminExtraItems.map(renderLink)}
          </div>
        </div>
      </nav>
    </aside>
  );
}
