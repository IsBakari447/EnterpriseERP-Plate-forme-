"use client";

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

export function CloudMarketPage() {
  const { t } = useI18n();
  const statusClass = (status: string) =>
    status === "available"
      ? "bg-emerald-50 text-emerald-700"
      : status === "beta"
        ? "bg-cyan-50 text-cyan-700"
        : "bg-slate-100 text-slate-600";

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-night">
      <MarketingHeader />
      <section className="bg-gradient-to-br from-[#1E2A38] via-[#142235] to-[#00A990] px-6 py-16 text-white lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black">
              EnterpriseERP Cloud SaaS
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {t("market.title")}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
              {t("market.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/register" className="rounded-2xl bg-white px-6 py-4 font-black text-night">
                {t("auth.createAccount")}
              </a>
              <a href="/pricing" className="rounded-2xl border border-white/30 px-6 py-4 font-black text-white">
                {t("market.offers")}
              </a>
              <a href="/demo" className="rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20">
                {t("demo.tryNow")}
              </a>
              <a href="/login" className="rounded-2xl border border-white/30 px-6 py-4 font-black text-white">
                {t("auth.login")}
              </a>
              <a href="/forgot-password" className="rounded-2xl border border-white/30 px-6 py-4 font-black text-white">
                {t("market.forgotPassword")}
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl">
            <div className="rounded-2xl bg-[#0f172a] p-6">
              <h2 className="text-2xl font-black">{t("auth.commandCenter")}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["CRM", "Stock", "Factures", "IA", "Mobile", "API"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 font-black">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="scroll-mt-28 bg-white px-6 py-14 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
              {t("market.videoBadge")}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-night lg:text-4xl">
              {t("market.videoTitle")}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              {t("market.videoText")}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl bg-[#101A26] p-3 shadow-2xl ring-1 ring-slate-200">
            <video
              className="aspect-video w-full rounded-2xl bg-black object-cover"
              controls
              preload="metadata"
              playsInline
            >
              <source src="/videos/enterpriseerp-promo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section id="modules" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-14 lg:px-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {solutionCards.map((card, index) => (
            <article key={card.title} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
              <span className="rounded-full bg-[#00C2A9]/10 px-3 py-1 text-xs font-black text-[#008f7d]">
                {t(`market.solution.${index}.tag`)}
              </span>
              <span className={`ml-2 rounded-full px-3 py-1 text-xs font-black ${statusClass(solutionStatuses[index])}`}>
                {t(`market.status.${solutionStatuses[index]}`)}
              </span>
              <h2 className="mt-4 text-2xl font-black">{t(`market.solution.${index}.title`)}</h2>
              <p className="mt-3 leading-7 text-slate-600">{t(`market.solution.${index}.description`)}</p>
              <ul className="mt-5 space-y-2 text-sm font-bold text-slate-700">
                {card.points.map((point, pointIndex) => <li key={point}>- {t(`market.solution.${index}.point.${pointIndex}`)}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="problemes" className="mx-auto grid max-w-7xl scroll-mt-28 gap-5 px-6 pb-16 lg:grid-cols-[.8fr_1.2fr] lg:px-16">
        <div className="rounded-3xl bg-[#1E2A38] p-7 text-white">
          <h2 className="text-3xl font-black">{t("market.businessBenefits")}</h2>
          <p className="mt-4 leading-8 text-white/75">
            {t("market.businessBenefitsText")}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {competitorSignals.map((signal, index) => (
            <div key={signal} className="rounded-2xl bg-white p-5 font-bold text-slate-700 shadow ring-1 ring-slate-200">
              {t(`market.signal.${index}`)}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-16">
        <h2 className="text-3xl font-black">{t("market.onboarding")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {onboardingSteps.map((step, index) => (
            <article key={step.title} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
              <h3 className="text-xl font-black">{t(`market.onboarding.${index}.title`)}</h3>
              <p className="mt-3 leading-7 text-slate-600">{t(`market.onboarding.${index}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-4 lg:px-16">
        {[
          { href: "/demo", key: "demo" },
          { href: "/roi", key: "roi" },
          { href: "/status", key: "status" },
          { href: "/faq", key: "faq" },
        ].map((item) => (
          <a key={item.href} href={item.href} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-xl font-black">{t(`market.link.${item.key}.label`)}</h2>
            <p className="mt-3 leading-7 text-slate-600">{t(`market.link.${item.key}.text`)}</p>
          </a>
        ))}
      </section>

      <section id="tarifs" className="mx-auto grid max-w-7xl scroll-mt-28 gap-5 px-6 pb-16 lg:grid-cols-3 lg:px-16">
        {pricingPlans.map((plan, index) => (
          <article key={plan.name} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">{t(`market.plan.${index}.name`)}</h2>
            <p className="mt-3 text-3xl font-black text-[#00A693]">{t(`market.plan.${index}.price`)}</p>
            <p className="mt-3 leading-7 text-slate-600">{t(`market.plan.${index}.highlight`)}</p>
            <ul className="mt-6 space-y-2 text-sm font-bold text-slate-700">
              {plan.features.map((feature, featureIndex) => <li key={feature}>- {t(`market.plan.${index}.feature.${featureIndex}`)}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section id="roadmap" className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-16 lg:px-16">
        <div className="rounded-3xl bg-[#101b2d] p-8 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#7df5e5]">
                {t("marketing.roadmap")}
              </span>
              <h2 className="mt-5 text-3xl font-black lg:text-4xl">{t("market.roadmapTitle")}</h2>
              <p className="mt-4 leading-8 text-white/70">{t("market.roadmapText")}</p>
              <a href="/roadmap" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 font-black text-night">
                {t("market.roadmapOpen")}
              </a>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {["foundation", "automation", "ecosystem"].map((item) => (
                <article key={item} className="rounded-2xl bg-white/10 p-5">
                  <h3 className="font-black">{t(`market.roadmap.${item}.title`)}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white/65">{t(`market.roadmap.${item}.text`)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-20 lg:grid-cols-2 lg:px-16">
        <div className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
          <h2 className="text-3xl font-black">{t("market.cloudSecurity")}</h2>
          <div className="mt-5 space-y-4">
            {securityItems.map((item, index) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black">{t(`market.security.${index}.title`)}</h3>
                <p className="mt-2 text-slate-600">{t(`market.security.${index}.description`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
          <h2 className="text-3xl font-black">{t("market.integrations")}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {integrationItems.map((item, index) => (
              <div key={item} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-black text-slate-700">{t(`market.integration.${index}`)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(integrationStatuses[index])}`}>
                  {t(`market.status.${integrationStatuses[index]}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
