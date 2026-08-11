"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { navigationItems } from "@config/navigation";
import { useI18n } from "@shared/i18n/I18nProvider";
import { useSector } from "@shared/sector/SectorProvider";

const actionItems = [
  { key: "create-invoice", href: "/facturation", module: "facturation" },
  { key: "create-client", href: "/crm", module: "crm" },
  { key: "open-stock", href: "/stock", module: "stock" },
  { key: "open-ai", href: "/assistant", module: "assistant" },
  { key: "open-sales-agent", href: "/ai-sales-agent", module: "ai-sales-agent" },
  { key: "open-security", href: "/account/security", module: "security" },
];

export default function CommandPalette() {
  const { t } = useI18n();
  const { sector } = useSector();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const openPalette = () => setOpen(true);

    window.addEventListener("enterpriseerp:open-command-palette", openPalette);
    return () => window.removeEventListener("enterpriseerp:open-command-palette", openPalette);
  }, []);

  const moduleResults = useMemo(
    () =>
      navigationItems
        .filter((item) => sector.modules.includes(item.key))
        .map((item) => ({
          key: item.key,
          href: item.href,
          icon: item.icon,
          label: t(`nav.${item.key}`),
          type: t("command.type.module"),
        })),
    [sector.modules, t]
  );

  const actionResults = useMemo(
    () =>
      actionItems.map((item) => ({
        key: item.key,
        href: item.href,
        icon: "GO",
        label: t(`command.action.${item.key}`),
        type: t("command.type.action"),
      })),
    [t]
  );

  const results = [...moduleResults, ...actionResults]
    .filter((item) => {
      const normalized = `${item.label} ${item.type}`.toLowerCase();
      return normalized.includes(query.toLowerCase().trim());
    })
    .slice(0, 8);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="hidden min-w-72 items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-bold text-slate-500 shadow ring-1 ring-slate-200 transition hover:ring-[#00C2A9] md:flex"
      >
        <span>{t("command.placeholder")}</span>
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">Ctrl K</span>
      </button>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-black text-night shadow ring-1 ring-slate-200 md:hidden"
      >
        /
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(92vw,520px)] rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("command.search")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none focus:border-[#00C2A9]"
          />

          <div className="mt-4 space-y-2">
            {results.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
                {t("command.empty")}
              </div>
            )}

            {results.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E2A38] text-xs font-black text-white">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-black text-night">{item.label}</span>
                  <span className="block text-xs font-bold text-slate-400">{item.type}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
