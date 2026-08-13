"use client";

import FeatureCard from "./FeatureCard";
import MarketingFooter from "./MarketingFooter";
import MarketingHeader from "./MarketingHeader";
import type { SectorConfig } from "@/config/sectors";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function SectorLandingPage({
  sector,
}: {
  sector: SectorConfig;
}) {
  const { locale, t } = useI18n();
  const tc = (value: string) => translateContentText(value, locale);

  return (
    <main className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="overflow-hidden bg-gradient-to-br from-[#F7FAFC] via-white to-[#E8FBF7]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex rounded-full border border-[#00C2A9]/30 bg-[#E8FBF7] px-4 py-2 text-sm font-semibold text-[#008F7C]">
              {tc(sector.badge)}
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight text-[#1E2A38] sm:text-5xl lg:text-6xl">
              {tc(sector.title)}{" "}
              <span className="text-[#00A990]">{tc(sector.highlightedTitle)}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {tc(sector.subtitle)}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="rounded-xl bg-[#FF7A00] px-6 py-3.5 text-center font-semibold text-white shadow-lg transition hover:bg-[#e66e00]">
                {t("marketing.requestFullDemo")}
              </a>

              <a href="https://enterpriseerp-2.onrender.com/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-[#1E2A38] transition hover:bg-slate-50">
                {t("marketing.viewErp")}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span>- {t("marketing.cloud")}</span>
              <span>- {t("marketing.mobile")}</span>
              <span>- {t("marketing.ai")}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[#00C2A9]/10 blur-3xl" />

            <div className="relative rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl">
              <div className="rounded-3xl bg-[#101A26] p-6 text-white">
                <p className="text-sm text-slate-400">{tc(sector.dashboardTitle)}</p>
                <h2 className="mt-2 text-2xl font-bold">EnterpriseERP {t("nav.dashboard")}</h2>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">{t("marketing.revenue")}</p>
                    <p className="mt-2 text-2xl font-bold">128 450 EUR</p>
                    <p className="mt-1 text-sm text-[#7FF2E1]">+18%</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">{t("marketing.activities")}</p>
                    <p className="mt-2 text-2xl font-bold">342</p>
                    <p className="mt-1 text-sm text-[#7FF2E1]">+9%</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">{t("marketing.toProcess")}</p>
                    <p className="mt-2 text-2xl font-bold">8</p>
                    <p className="mt-1 text-sm text-orange-300">{t("dashboard.alerts")}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">{t("crm.active")}</p>
                    <p className="mt-2 text-2xl font-bold">1 208</p>
                    <p className="mt-1 text-sm text-[#7FF2E1]">{t("marketing.centralized")}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#22364A] to-[#00A990] p-5">
                  <p className="font-semibold">{t("marketing.aiRecommendation")}</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">{tc(sector.aiRecommendation)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problemes" className="bg-[#F7F9FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#00A990]">{t("marketing.sectorProblems")}</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1E2A38] sm:text-4xl">{t("marketing.sectorChallenges")}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">{tc(sector.problemIntro)}</p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sector.problems.map((problem) => (
              <FeatureCard key={problem.title} {...problem} />
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#00A990]">{t("marketing.adaptedModules")}</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1E2A38] sm:text-4xl">{t("marketing.adaptedPlatform")}</h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sector.modules.map((module) => (
              <FeatureCard key={module.title} {...module} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101A26] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#6EE7D8]">{t("marketing.valueProof")}</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t("marketing.valueTitle")}</h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {sector.benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                <div className="text-3xl">{benefit.icon}</div>
                <h3 className="mt-5 text-xl font-bold">{tc(benefit.title)}</h3>
                <p className="mt-3 leading-7 text-slate-300">{tc(benefit.description)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-widest text-[#00A990]">{t("marketing.demo")}</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1E2A38] sm:text-4xl">{tc(sector.dashboardTitle)}</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">{tc(sector.dashboardDescription)}</p>

            <a href="https://enterpriseerp-2.onrender.com/" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-xl bg-[#FF7A00] px-6 py-3.5 font-semibold text-white transition hover:bg-[#e66e00]">
              {t("marketing.openDemo")}
            </a>
          </div>

          <div className="rounded-[28px] bg-[#F7F9FC] p-6 shadow-xl">
            <div className="rounded-2xl bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{t("marketing.monthlyPerformance")}</p>
                  <p className="mt-1 text-2xl font-bold text-[#1E2A38]">{t("marketing.clearVision")}</p>
                </div>

                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">+18%</div>
              </div>

              <div className="mt-6 flex h-56 items-end gap-3 rounded-2xl bg-slate-50 p-5">
                {[35, 48, 42, 64, 57, 74, 88, 81, 96].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-lg bg-gradient-to-t from-[#1E2A38] to-[#00C2A9]" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tarifs" className="bg-[#F7F9FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#00A990]">{t("marketing.simplePricing")}</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1E2A38] sm:text-4xl">{t("marketing.choosePlan")}</h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {sector.plans.map((plan) => (
              <article key={plan.name} className={`relative rounded-3xl p-8 ${plan.featured ? "bg-[#1E2A38] text-white shadow-2xl" : "border border-slate-200 bg-white text-[#1E2A38] shadow-sm"}`}>
                {plan.featured && (
                  <div className="absolute right-6 top-6 rounded-full bg-[#00C2A9] px-3 py-1 text-xs font-bold text-white">
                    {t("marketing.recommended")}
                  </div>
                )}

                <h3 className="text-2xl font-bold">{tc(plan.name)}</h3>
                <p className={`mt-2 text-sm ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>{tc(plan.description)}</p>
                <p className="mt-8 text-3xl font-extrabold">{tc(plan.price)}</p>

                <ul className={`mt-8 space-y-4 text-sm ${plan.featured ? "text-slate-200" : "text-slate-600"}`}>
                  {plan.features.map((feature) => (
                    <li key={feature}>- {tc(feature)}</li>
                  ))}
                </ul>

                <a href="#contact" className={`mt-9 block rounded-xl px-5 py-3 text-center font-semibold transition ${plan.featured ? "bg-[#FF7A00] text-white hover:bg-[#e66e00]" : "bg-[#1E2A38] text-white hover:bg-[#29394B]"}`}>
                  {t("marketing.requestFullDemo")}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[36px] bg-gradient-to-r from-[#1E2A38] to-[#00A990] px-8 py-14 text-center text-white shadow-2xl sm:px-14">
            <h2 className="text-3xl font-bold sm:text-4xl">{tc(sector.ctaTitle)}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">{tc(sector.ctaDescription)}</p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={`mailto:contact@enterpriseerp.com?subject=EnterpriseERP demo request ${sector.slug}`} className="rounded-xl bg-[#FF7A00] px-6 py-3.5 font-semibold text-white transition hover:bg-[#e66e00]">
                {t("marketing.requestFullDemo")}
              </a>

              <a href="https://enterpriseerp-2.onrender.com/" target="_blank" rel="noreferrer" className="rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
                {t("marketing.viewErp")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
