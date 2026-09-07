"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const renderLink = (item: { href: string; label: string; icon: string; key?: string }) => {
    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.key ?? item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black transition ${
          active
            ? "bg-white text-night shadow-sm"
            : "text-slate-200 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black leading-none ${
            active ? "bg-night text-white" : "bg-white/10 text-turquoise"
          }`}
        >
          {item.icon}
        </span>
        <span className="min-w-0 truncate">{item.label}</span>
      </Link>
    );
  };

  const renderNavigationItem = (item: (typeof navigationItems)[number]) =>
    renderLink({
      key: item.key,
      href: item.href,
      icon: item.icon,
      label: sector.labels?.[item.key] ? translateSectorLabel(sector.labels[item.key]!) : t(`nav.${item.key}`),
    });

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("common.menu")}
          aria-expanded={open}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-night text-white shadow ring-1 ring-slate-900/10"
        >
          <span className="space-y-1.5" aria-hidden="true">
            <span className="block h-0.5 w-6 rounded-full bg-white" />
            <span className="block h-0.5 w-6 rounded-full bg-white" />
            <span className="block h-0.5 w-6 rounded-full bg-white" />
          </span>
        </button>

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

        <div className="hidden w-36 shrink-0 min-[420px]:block">
          <LanguageSwitcher compact />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" role="presentation">
          <button
            type="button"
            aria-label={t("common.close")}
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setOpen(false)}
          />

          <aside
            className="relative flex h-dvh w-[min(86vw,360px)] flex-col bg-night px-4 py-5 text-white shadow-2xl"
            aria-label={t("common.menu")}
          >
            <div className="flex items-center justify-between gap-3">
              <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm">
                  <Image
                    src="/enterpriseerp-icon.png"
                    alt="EnterpriseERP Cloud"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                    priority
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-lg font-black">EnterpriseERP</span>
                  <span className="block truncate text-xs font-bold text-turquoise">{t("app.tagline")}</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("common.close")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-light text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <LanguageSwitcher compact />

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                  {t("dashboard.filter.sector")}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00C2A9]/15 text-xl">
                    {sector.icon || "E"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-base font-black">{t(`sector.${sectorKey}`)}</span>
                    <span className="block truncate text-xs font-semibold text-white/45">
                      EnterpriseERP Platform
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <nav className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1 enterprise-scroll">
              <div className="space-y-1">{businessItems.map(renderNavigationItem)}</div>

              <div>
                <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {t("account.section")}
                </p>
                <div className="space-y-1">{accountItems.map(renderLink)}</div>
              </div>

              <div>
                <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {t("admin.section")}
                </p>
                <div className="space-y-1">
                  {administrationItems.map(renderNavigationItem)}
                  {adminExtraItems.map(renderLink)}
                </div>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
