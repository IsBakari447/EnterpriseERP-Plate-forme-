"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { ModuleBarChart, RevenueChart } from "@shared/components/charts/RevenueChart";
import { useI18n } from "@shared/i18n/I18nProvider";
import {
  alerts,
  globalKpis,
  marketModules,
  moduleStats,
  pricingPlans,
  trustItems,
} from "../data";

export default function DashboardPage() {
  const { t } = useI18n();

  return (
    <ERPLayout
      title={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
      action={t("dashboard.action")}
    >
      <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl bg-gradient-to-br from-[#1E2A38] via-[#142235] to-[#00A990] p-7 text-white shadow-xl">
          <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
            {t("dashboard.badge")}
          </div>
          <h2 className="mt-6 max-w-4xl text-3xl font-black leading-tight lg:text-4xl">
            {t("dashboard.heroTitle")}
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
            {t("dashboard.heroText")}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[t("dashboard.trial"), t("dashboard.apiFirst"), t("dashboard.multiCompany")].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 font-bold">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">{t("dashboard.marketPriorities")}</h2>
          <div className="mt-5 space-y-3">
            {[
              "Reduire le temps de mise en route client.",
              "Clarifier les limites de l'essai gratuit.",
              "Mettre en avant API, mobile, securite et reporting.",
              "Suivre les feedbacks avant chaque release.",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {globalKpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <RevenueChart />
        <ModuleBarChart />
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200 xl:col-span-2">
          <h2 className="mb-5 text-xl font-bold text-night">
            {t("dashboard.moduleStats")}
          </h2>

          <DataGrid
            columns={[
              { key: "module", label: "Module" },
              { key: "metric", label: "Indicateur" },
              { key: "value", label: "Valeur" },
              { key: "trend", label: "Tendance" },
            ]}
            data={moduleStats}
          />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">{t("dashboard.globalAlerts")}</h2>

          <div className="mt-5 space-y-3">
            {alerts.map((alert) => (
              <div key={alert} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {alert}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-2xl font-black text-night">{t("dashboard.competitiveModules")}</h2>
            <p className="mt-2 max-w-3xl text-slate-500">
              {t("dashboard.competitiveText")}
            </p>
          </div>
          <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
            {t("dashboard.readableRoadmap")}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {marketModules.map((module) => (
            <article key={module.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-black text-night">{module.title}</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#00A693] ring-1 ring-slate-200">
                  {module.status}
                </span>
              </div>
              <p className="mt-3 leading-7 text-slate-600">{module.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-3xl bg-[#1E2A38] p-7 text-white shadow-xl">
          <h2 className="text-2xl font-black">{t("dashboard.aiSummary")}</h2>
          <p className="mt-4 leading-8 text-white/75">
            {t("dashboard.aiSummaryText")}
          </p>
          <div className="mt-6 rounded-2xl bg-white/10 p-5">
            <strong>{t("dashboard.nextAction")}</strong>
            <p className="mt-2 text-white/75">
              {t("dashboard.nextActionText")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
              <h3 className="text-xl font-black text-night">{plan.name}</h3>
              <p className="mt-2 text-2xl font-black text-[#00A693]">{plan.price}</p>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500">{plan.audience}</p>
              <ul className="mt-5 space-y-2 text-sm font-semibold text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-2xl font-black text-night">{t("dashboard.trust")}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {trustItems.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>
    </ERPLayout>
  );
}
