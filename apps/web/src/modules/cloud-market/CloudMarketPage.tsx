"use client";

import Link from "next/link";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";
import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import { useI18n } from "@shared/i18n/I18nProvider";
import {
  competitorSignals,
  integrationItems,
  integrationStatuses,
  onboardingSteps,
  pricingPlans,
  securityItems,
  solutionCards,
  solutionStatuses,
} from "./data";

const revenueData = [
  { month: "Mai", value: 54 },
  { month: "Juin", value: 67 },
  { month: "Juil", value: 79 },
  { month: "Août", value: 74 },
  { month: "Sept", value: 92 },
  { month: "Oct", value: 118 },
];

const previewRows = {
  crm: [
    ["Nordic Retail AB", "Proposition", "12 800 EUR"],
    ["Kamyla Group", "Négociation", "24 500 EUR"],
    ["Nova Services", "Relance", "7 400 EUR"],
  ],
  stock: [
    ["Clavier Pro", "5 unités", "Réapprovisionner"],
    ["Écran 27 pouces", "12 unités", "À surveiller"],
    ["Dock USB-C", "8 unités", "Commander"],
  ],
  invoices: [
    ["FAC-2026-0421", "2 450 EUR", "En retard"],
    ["FAC-2026-0418", "5 320 EUR", "À relancer"],
    ["FAC-2026-0410", "1 280 EUR", "À venir"],
  ],
};

type PreviewTab = "dashboard" | keyof typeof previewRows;

export function CloudMarketPage() {
  const { t } = useI18n();
  const [previewTab, setPreviewTab] = useState<PreviewTab>("dashboard");
  const statusClass = (status: string) =>
    status === "available"
      ? "bg-emerald-50 text-emerald-700"
      : status === "beta"
        ? "bg-cyan-50 text-cyan-700"
        : "bg-slate-100 text-slate-600";

  const previewTabs: { key: PreviewTab; label: string }[] = [
    { key: "dashboard", label: t("demo.live.tab.dashboard") },
    { key: "crm", label: t("demo.live.tab.crm") },
    { key: "stock", label: t("demo.live.tab.stock") },
    { key: "invoices", label: t("demo.live.tab.billing") },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-night">
      <MarketingHeader />

      <section className="relative overflow-hidden bg-[linear-gradient(125deg,#102136_0%,#12283c_56%,#00a990_145%)] px-5 py-10 text-white sm:px-8 lg:py-11">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <div className="mx-auto grid max-w-[1400px] gap-12 xl:grid-cols-[.82fr_1.18fr] xl:items-center">
          <div className="relative z-10">
            <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#78f2df] ring-1 ring-white/10">
              EnterpriseERP Cloud SaaS
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-6xl xl:text-[3.65rem]">
              {t("market.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              {t("market.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#FF7A00] px-7 py-4 text-base font-black text-white shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:bg-[#e66e00]">
                {t("market.plan.0.price")}
              </Link>
              <Link href="/demo/live?sector=general" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/35 px-7 py-4 text-base font-black text-white transition hover:bg-white/10">
                {t("demo.tryNow")}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-slate-200">
              <span>{t("market.trustMetric.0.value")}</span>
              <span>{t("market.trustMetric.1.value")}</span>
              <span>{t("market.trustMetric.2.value")}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-[#00C2A9]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-slate-950/35">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 text-[#102136]">
                <div>
                  <p className="text-sm font-black">EnterpriseERP</p>
                  <p className="text-xs font-semibold text-slate-500">{t("auth.commandCenter")}</p>
                </div>
                <div className="hidden w-full max-w-sm rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-500 sm:block">
                  {t("command.search")}
                </div>
                <div className="rounded-full bg-[#e9fbf7] px-3 py-2 text-xs font-black text-[#008f7d]">JD</div>
              </div>

              <div className="grid min-h-[360px] bg-[#f7f9fc] md:grid-cols-[150px_1fr]">
                <aside className="hidden bg-[#102136] p-4 text-white md:block">
                  <p className="mb-5 px-3 text-xs font-black uppercase tracking-[0.18em] text-[#78f2df]">Cloud ERP</p>
                  <div className="grid gap-1 text-sm font-bold text-white/75">
                    {["dashboard", "crm", "ventes", "facturation", "stock", "rh", "assistant"].map((item, index) => (
                      <div key={item} className={`rounded-xl px-3 py-2.5 ${index === 0 ? "bg-[#00A990] text-white" : ""}`}>
                        {item === "dashboard" ? t("demo.live.tab.dashboard") : t(`nav.${item}`)}
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="min-w-0 p-4 text-[#102136] sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#008f7d]">{t("market.solution.1.tag")}</p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight">{t("market.solution.1.title")}</h2>
                    </div>
                    <Link href="/register" className="inline-flex rounded-xl bg-[#FF7A00] px-4 py-3 text-sm font-black text-white">
                      {t("auth.createAccount")}
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      [t("demo.live.kpi.revenue"), "128 450 EUR", "+12%"],
                      [t("demo.live.kpi.actions"), "24", t("demo.live.today")],
                      [t("demo.live.kpi.cash"), "48 200 EUR", t("demo.live.toCollect")],
                      [t("demo.live.kpi.risk"), "12", t("demo.live.watch")],
                    ].map(([label, value, note]) => (
                      <article key={label} className="rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs font-bold text-slate-500">{label}</p>
                        <p className="mt-2 text-lg font-black tracking-tight sm:text-xl">{value}</p>
                        <p className="mt-1 text-xs font-black text-[#009a87]">{note}</p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
                    <div role="tablist" aria-label={t("demo.live.workspace")} className="flex flex-wrap gap-2">
                      {previewTabs.map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={previewTab === tab.key}
                          onClick={() => setPreviewTab(tab.key)}
                          className={`rounded-xl px-3 py-2 text-xs font-black transition ${previewTab === tab.key ? "bg-[#102136] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {previewTab === "dashboard" ? (
                    <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
                        <div className="min-h-40">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-black">{t("dashboard.revenueEvolution")}</p>
                            <span className="text-xs font-bold text-slate-400">2026</span>
                          </div>
                          <ResponsiveContainer width="100%" height={105}>
                            <BarChart data={revenueData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                              <CartesianGrid stroke="#e7edf3" vertical={false} />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                              <Tooltip cursor={{ fill: "#eef8f6" }} contentStyle={{ borderRadius: 12, borderColor: "#dbe4ec" }} />
                              <Bar dataKey="value" fill="#00A990" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="rounded-2xl bg-[#102136] p-4 text-white">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#78f2df]">{t("marketing.aiRecommendation")}</p>
                          <p className="mt-3 text-lg font-black">{t("demo.live.row.stock")}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{t("market.solution.3.description")}</p>
                          <span className="mt-4 inline-flex rounded-xl bg-white px-3 py-2 text-xs font-black text-[#102136]">{t("demo.live.status.action")}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                        {previewRows[previewTab].map((row, index) => (
                          <div key={row[0]} className={`grid gap-3 px-4 py-3 text-sm sm:grid-cols-3 ${index ? "border-t border-slate-200" : ""}`}>
                            <span className="font-black">{row[0]}</span>
                            <span className="font-semibold text-slate-600">{row[1]}</span>
                            <span className="font-black text-[#008f7d] sm:text-right">{row[2]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="scroll-mt-28 border-b border-slate-200 bg-white px-5 py-9 sm:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {["crm", "invoices", "stock", "api", "mobile", "ai"].map((item, index) => (
            <div key={item} className="border-l-2 border-[#00A990]/25 pl-4">
              <p className="font-black text-[#102136]">{t(`market.command.${item}`)}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{t(`market.solution.${Math.min(index, 5)}.point.0`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="problemes" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#008f7d]">{t("market.expectedSignals")}</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102136] sm:text-5xl">{t("market.businessBenefits")}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{t("market.businessBenefitsText")}</p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-slate-200 ring-1 ring-slate-200 md:grid-cols-2 xl:grid-cols-3">
            {competitorSignals.map((signal, index) => (
              <article key={signal} className="bg-white p-7">
                <p className="text-xs font-black text-[#009a87]">0{index + 1}</p>
                <p className="mt-3 text-lg font-black leading-7 text-[#102136]">{t(`market.signal.${index}`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[#008f7d]">{t("marketing.modules")}</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102136] sm:text-5xl">{t("market.productProofTitle")}</h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{t("market.productProofText")}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {solutionCards.map((card, index) => (
              <article key={card.title} className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-7 transition hover:-translate-y-1 hover:border-[#00A990]/40 hover:bg-white hover:shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#00C2A9]/10 px-3 py-1 text-xs font-black text-[#008f7d]">{t(`market.solution.${index}.tag`)}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(solutionStatuses[index])}`}>{t(`market.status.${solutionStatuses[index]}`)}</span>
                </div>
                <h3 className="mt-5 text-2xl font-black text-[#102136]">{t(`market.solution.${index}.title`)}</h3>
                <p className="mt-3 leading-7 text-slate-600">{t(`market.solution.${index}.description`)}</p>
                <ul className="mt-5 space-y-2 text-sm font-bold text-slate-700">
                  {card.points.map((point, pointIndex) => <li key={point}>{t(`market.solution.${index}.point.${pointIndex}`)}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="scroll-mt-28 px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <div>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#008f7d]">{t("market.onboarding")}</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#102136] sm:text-5xl">{t("demo.title")}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{t("demo.text")}</p>
            <Link href="/demo/live?sector=general" className="mt-7 inline-flex rounded-2xl bg-[#102136] px-6 py-4 font-black text-white transition hover:bg-[#1d344f]">
              {t("demo.tryNow")}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {onboardingSteps.map((step, index) => (
              <article key={step.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-black text-[#009a87]">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-black text-[#102136]">{t(`market.onboarding.${index}.title`)}</h3>
                <p className="mt-3 leading-7 text-slate-600">{t(`market.onboarding.${index}.description`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="scroll-mt-28 bg-[#102136] px-5 py-16 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#78f2df]">{t("marketing.pricing")}</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{t("marketing.choosePlan")}</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <article key={plan.name} className={`rounded-3xl p-7 ${index === 1 ? "bg-white text-[#102136] ring-4 ring-[#00C2A9]" : "bg-white/8 ring-1 ring-white/15"}`}>
                <p className={`text-sm font-black uppercase tracking-[0.16em] ${index === 1 ? "text-[#008f7d]" : "text-[#78f2df]"}`}>{t(`market.plan.${index}.name`)}</p>
                <p className="mt-4 text-3xl font-black">{t(`market.plan.${index}.price`)}</p>
                <p className={`mt-3 leading-7 ${index === 1 ? "text-slate-600" : "text-slate-300"}`}>{t(`market.plan.${index}.highlight`)}</p>
                <ul className={`mt-6 space-y-3 text-sm font-bold ${index === 1 ? "text-slate-700" : "text-slate-200"}`}>
                  {plan.features.map((feature, featureIndex) => <li key={feature}>{t(`market.plan.${index}.feature.${featureIndex}`)}</li>)}
                </ul>
                <Link href={index === 2 ? "/demo" : "/register"} className={`mt-7 inline-flex rounded-xl px-5 py-3 text-sm font-black ${index === 1 ? "bg-[#FF7A00] text-white" : "bg-white text-[#102136]"}`}>
                  {index === 2 ? t("marketing.requestDemo") : t("auth.createAccount")}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-7 sm:p-9">
            <h2 className="text-3xl font-black text-[#102136]">{t("market.cloudSecurity")}</h2>
            <div className="mt-6 divide-y divide-slate-200">
              {securityItems.map((item, index) => (
                <div key={item.title} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="font-black text-[#102136]">{t(`market.security.${index}.title`)}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{t(`market.security.${index}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 p-7 sm:p-9">
            <h2 className="text-3xl font-black text-[#102136]">{t("market.integrations")}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {integrationItems.map((item, index) => (
                <div key={item} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-black text-slate-700">{t(`market.integration.${index}`)}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusClass(integrationStatuses[index])}`}>{t(`market.status.${integrationStatuses[index]}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="scroll-mt-28 bg-white px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-[1400px] rounded-[2rem] bg-[#e9fbf7] p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[#008f7d]">{t("marketing.roadmap")}</span>
              <h2 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-[#102136] sm:text-5xl">{t("market.roadmapTitle")}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{t("market.roadmapText")}</p>
            </div>
            <Link href="/roadmap" className="inline-flex rounded-2xl bg-[#102136] px-6 py-4 font-black text-white">{t("market.roadmapOpen")}</Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
