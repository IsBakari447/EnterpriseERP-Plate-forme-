"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sectorDefinitions, sectorOptions } from "@config/sectors";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";
import type { SectorKey } from "@shared/sector/types";

type DemoTab = "dashboard" | "crm" | "stock" | "billing";

const tabs: DemoTab[] = ["dashboard", "crm", "stock", "billing"];

const tabRows: Record<DemoTab, string[][]> = {
  dashboard: [
    ["Factures a relancer", "18", "Priorite"],
    ["Stock critique", "12 SKU", "Action"],
    ["Devis en attente", "42 800 EUR", "Relance"],
  ],
  crm: [
    ["Nordic Retail AB", "Proposition", "12 800 EUR"],
    ["Kamyla Group", "Negociation", "24 500 EUR"],
    ["Nova Services", "Relance", "7 400 EUR"],
  ],
  stock: [
    ["Terminal mobile", "SKU-734001", "3"],
    ["Scanner code-barres", "ERP-002", "8"],
    ["Pack cuisine", "REST-041", "12"],
  ],
  billing: [
    ["FAC-2026-041", "Payee", "18 450 EUR"],
    ["FAC-2026-042", "En attente", "7 850 EUR"],
    ["FAC-2026-043", "En retard", "4 120 EUR"],
  ],
};

function getInitialSector(): SectorKey {
  if (typeof window === "undefined") return "general";

  const value = new URLSearchParams(window.location.search).get("sector");
  return value && value in sectorDefinitions ? (value as SectorKey) : "general";
}

export default function DemoLivePage() {
  const { t } = useI18n();
  const [sector, setSector] = useState<SectorKey>(getInitialSector);
  const [activeTab, setActiveTab] = useState<DemoTab>("dashboard");

  const kpis = useMemo(
    () => [
      { label: t("demo.live.kpi.revenue"), value: sector === "restaurant" ? "4 280 EUR" : "128 450 EUR", change: "+12%" },
      { label: t("demo.live.kpi.actions"), value: sector === "education" ? "37" : "24", change: t("demo.live.today") },
      { label: t("demo.live.kpi.cash"), value: "48 200 EUR", change: t("demo.live.toCollect") },
      { label: t("demo.live.kpi.risk"), value: sector === "construction" ? "3" : "12", change: t("demo.live.watch") },
    ],
    [sector, t]
  );

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-10 text-[#102033] lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/demo" className="font-black text-[#00A693]">
            EnterpriseERP Cloud
          </Link>
          <LanguageSwitcher />
        </div>

        <section className="mt-8 rounded-[28px] bg-[#1E2A38] p-7 text-white shadow-2xl lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8df8e8]">{t("demo.live.badge")}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight lg:text-6xl">{t("demo.live.title")}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{t("demo.live.text")}</p>
            </div>
            <label className="block">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[#8df8e8]">{t("demo.sector")}</span>
              <select
                value={sector}
                onChange={(event) => setSector(event.target.value as SectorKey)}
                className="mt-3 w-full rounded-2xl border border-white/20 bg-white px-4 py-4 font-black text-[#102033] outline-none"
              >
                {sectorOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {t(`sector.${item.key}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
              <p className="font-semibold text-slate-500">{kpi.label}</p>
              <p className="mt-4 text-3xl font-black">{kpi.value}</p>
              <p className="mt-3 font-black text-[#00A693]">{kpi.change}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">{t(`sector.${sector}`)}</p>
              <h2 className="mt-2 text-3xl font-black">{t("demo.live.workspace")}</h2>
            </div>
            <Link href={`/register?sector=${sector}`} className="rounded-2xl bg-[#FF7A00] px-5 py-3 font-black text-white">
              {t("auth.createAccount")}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  activeTab === tab ? "bg-[#1E2A38] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {t(`demo.live.tab.${tab}`)}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-slate-200">
            {tabRows[activeTab].map((row) => (
              <div key={row.join("-")} className="grid gap-3 border-b border-slate-100 p-4 text-sm font-bold last:border-0 md:grid-cols-3">
                {row.map((cell) => (
                  <span key={cell}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {["demo.live.proof.0", "demo.live.proof.1", "demo.live.proof.2"].map((key) => (
            <article key={key} className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
              <p className="text-lg font-black">{t(key)}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
