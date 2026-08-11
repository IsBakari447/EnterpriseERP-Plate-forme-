"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { ModuleBarChart, RevenueChart } from "@shared/components/charts/RevenueChart";
import { useI18n } from "@shared/i18n/I18nProvider";
import { useSector } from "@shared/sector/SectorProvider";
import {
  globalFilters,
  periodOptions,
  planUsage,
  sectorDashboards,
  trustItems,
  type DecisionKpi,
  type PeriodKey,
  type PriorityAction,
} from "../data";

function formatKpi(kpi: DecisionKpi, factor: number) {
  const value = kpi.format === "percent" ? kpi.baseValue : kpi.baseValue * factor;

  if (kpi.format === "currency") {
    return `${Math.round(value).toLocaleString("fr-FR")} EUR`;
  }

  if (kpi.format === "percent") {
    return `${value.toLocaleString("fr-FR")}%`;
  }

  return Math.round(value).toLocaleString("fr-FR");
}

function actionTone(action: PriorityAction) {
  const tones = {
    red: "border-red-100 bg-red-50 text-red-700",
    orange: "border-orange-100 bg-orange-50 text-orange-700",
    cyan: "border-cyan-100 bg-cyan-50 text-cyan-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  };

  return tones[action.tone];
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-[#00C2A9]" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function priorityHref(action: PriorityAction) {
  const text = `${action.title} ${action.detail} ${action.action}`.toLowerCase();

  if (text.includes("facture") || text.includes("paiement") || text.includes("encaisser")) return "/facturation";
  if (text.includes("stock") || text.includes("produit") || text.includes("sku")) return "/stock";
  if (text.includes("devis") || text.includes("vente") || text.includes("commande")) return "/ventes";
  if (text.includes("utilisateur") || text.includes("role") || text.includes("permission")) return "/modules/roles-permissions";
  if (text.includes("reservation") || text.includes("rendez")) return "/modules/reservations";
  if (text.includes("maintenance") || text.includes("vehicule")) return "/modules/maintenance";

  return "/modules/notifications";
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { sectorKey } = useSector();
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [customizing, setCustomizing] = useState(false);

  const selectedPeriod = periodOptions.find((option) => option.key === period) ?? periodOptions[2];
  const dashboard = sectorDashboards[sectorKey] ?? sectorDashboards.general;
  const selectedPeriodLabel = t(`dashboard.period.${selectedPeriod.key}`);

  const kpis = useMemo(
    () =>
      dashboard.kpis.map((kpi) => ({
        label: kpi.label,
        value: formatKpi(kpi, selectedPeriod.factor),
        change: `${kpi.change} - ${selectedPeriodLabel}`,
      })),
    [dashboard.kpis, selectedPeriod.factor, selectedPeriodLabel]
  );

  return (
    <ERPLayout
      title={t("dashboard.title")}
      subtitle={`${dashboard.label} - ${t("dashboard.decisionSubtitle")}`}
      action={t("dashboard.action")}
    >
      <section className="rounded-3xl bg-white p-5 shadow ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">{t("dashboard.decisionCenter")}</p>
            <h2 className="mt-2 text-2xl font-black text-night">{t("dashboard.executiveView")} {dashboard.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {t("dashboard.decisionText")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setPeriod(option.key)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  period === option.key
                    ? "bg-[#1E2A38] text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t(`dashboard.period.${option.key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {globalFilters.map((filter) => (
            <label key={filter.label} className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">{t(`dashboard.filter.${filter.key}`)}</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#00C2A9]">
                <option>{filter.key === "sector" ? dashboard.label : filter.value}</option>
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-black text-night">{t("dashboard.priorityActions")}</h2>
            <p className="mt-2 text-slate-500">{t("dashboard.priorityText")} {selectedPeriodLabel.toLowerCase()}.</p>
          </div>
          <button
            type="button"
            onClick={() => setCustomizing((value) => !value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-[#00C2A9] hover:text-[#00A693]"
          >
            {customizing ? t("dashboard.finishCustomize") : t("dashboard.customize")}
          </button>
        </div>

        {customizing && (
          <div className="mt-5 rounded-2xl border border-dashed border-[#00C2A9] bg-[#00C2A9]/5 p-4 text-sm font-bold text-[#008f7d]">
            {t("dashboard.customizeText")}
          </div>
        )}

        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {dashboard.priorities.map((item) => (
            <article key={item.title} className={`rounded-2xl border p-5 ${actionTone(item)}`}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-black">{item.title}</h3>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black">{item.impact}</span>
              </div>
              <p className="mt-3 text-sm font-semibold opacity-80">{item.detail}</p>
              <Link href={priorityHref(item)} className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-black text-night shadow-sm">
                {item.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <RevenueChart />
        <ModuleBarChart />
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-3xl bg-[#1E2A38] p-6 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7df5e5]">{t("dashboard.cashflow")}</p>
          <h2 className="mt-3 text-2xl font-black">{t("dashboard.projection")}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              [t("dashboard.currentBalance"), dashboard.cashflow.balance],
              [t("dashboard.incoming"), dashboard.cashflow.incoming],
              [t("dashboard.outgoing"), dashboard.cashflow.outgoing],
              [t("dashboard.projection"), dashboard.cashflow.projection],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/65">{label}</p>
                <p className="mt-2 text-xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("dashboard.recentActivity")}</h2>
          <div className="mt-5 space-y-4">
            {dashboard.activity.map((event) => (
              <div key={`${event.title}-${event.time}`} className="flex gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-[#00C2A9] shadow-[0_0_0_6px_rgba(0,194,169,.12)]" />
                <div className="flex-1 rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-black text-night">{event.title}</h3>
                    <span className="text-xs font-bold text-slate-400">{event.time}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200 xl:col-span-2">
          <h2 className="mb-5 text-xl font-bold text-night">{t("dashboard.modulePerformance")}</h2>
          <DataGrid
            columns={[
              { key: "module", label: "Module" },
              { key: "metric", label: "Indicateur" },
              { key: "value", label: "Valeur" },
              { key: "trend", label: "Tendance" },
              { key: "status", label: "Statut", badge: true },
            ]}
            data={dashboard.moduleStats}
          />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">{t("dashboard.alerts")}</h2>
          <div className="mt-5 space-y-3">
            {dashboard.alerts.map((alert) => (
              <div key={alert} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {alert}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[.95fr_1.05fr]">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("dashboard.monthGoals")}</h2>
          <div className="mt-5 space-y-5">
            {dashboard.goals.map((goal) => (
              <article key={goal.label}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-black text-night">{goal.label}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                    {goal.progress}% {t("dashboard.reached")}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {goal.current} / {t("dashboard.objective")} {goal.target}
                </p>
                <ProgressBar value={goal.progress} />
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#101b2d] p-6 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7df5e5]">Synthese IA</p>
          <h2 className="mt-3 text-2xl font-black">{t("dashboard.aiStructured")}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {dashboard.ai.map((group) => (
              <article key={group.title} className="rounded-2xl bg-white/10 p-4">
                <h3 className="font-black">{group.title}</h3>
                <ul className="mt-3 space-y-3 text-sm font-semibold leading-6 text-white/75">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-night">{t("dashboard.planUsage")}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">{t("dashboard.planUsageText")}</p>
            </div>
            <Link href="/pricing" className="rounded-2xl bg-[#FF7A00] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20">
              {t("dashboard.manageSubscription")}
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {planUsage.map((usage) => (
              <article key={usage.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-night">{usage.label}</h3>
                  <span className="text-sm font-black text-[#00A693]">{usage.value}</span>
                </div>
                <ProgressBar value={usage.progress} />
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("dashboard.securityStatus")}</h2>
          <div className="mt-5 grid gap-3">
            {trustItems.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
