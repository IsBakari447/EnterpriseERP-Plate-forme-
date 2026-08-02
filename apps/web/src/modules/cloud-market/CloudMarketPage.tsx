"use client";

import MarketingHeader from "@shared/components/marketing/MarketingHeader";
import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import { useI18n } from "@shared/i18n/I18nProvider";
import {
  competitorSignals,
  integrationItems,
  onboardingSteps,
  pricingPlans,
  securityItems,
  solutionCards,
} from "./data";

export function CloudMarketPage() {
  const { t } = useI18n();

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
              <h2 className="text-2xl font-black">Cloud Command Center</h2>
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

      <section className="bg-white px-6 py-14 lg:px-16">
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

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {solutionCards.map((card) => (
            <article key={card.title} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
              <span className="rounded-full bg-[#00C2A9]/10 px-3 py-1 text-xs font-black text-[#008f7d]">
                {card.tag}
              </span>
              <h2 className="mt-4 text-2xl font-black">{card.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{card.description}</p>
              <ul className="mt-5 space-y-2 text-sm font-bold text-slate-700">
                {card.points.map((point) => <li key={point}>- {point}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-[.8fr_1.2fr] lg:px-16">
        <div className="rounded-3xl bg-[#1E2A38] p-7 text-white">
          <h2 className="text-3xl font-black">{t("market.expectedSignals")}</h2>
          <p className="mt-4 leading-8 text-white/75">
            {t("market.expectedSignalsText")}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {competitorSignals.map((signal) => (
            <div key={signal} className="rounded-2xl bg-white p-5 font-bold text-slate-700 shadow ring-1 ring-slate-200">
              {signal}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-16">
        <h2 className="text-3xl font-black">{t("market.onboarding")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {onboardingSteps.map((step) => (
            <article key={step.title} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
              <h3 className="text-xl font-black">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-4 lg:px-16">
        {[
          { href: "/demo", label: "Demo guidee", text: "Transformer un visiteur en prospect qualifie." },
          { href: "/roi", label: "ROI", text: "Montrer la valeur business avant l'achat." },
          { href: "/status", label: "Status", text: "Rassurer sur la disponibilite Cloud." },
          { href: "/faq", label: "FAQ", text: "Lever les objections avant contact commercial." },
        ].map((item) => (
          <a key={item.href} href={item.href} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-xl font-black">{item.label}</h2>
            <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
          </a>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-16 lg:grid-cols-3 lg:px-16">
        {pricingPlans.map((plan) => (
          <article key={plan.name} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">{plan.name}</h2>
            <p className="mt-3 text-3xl font-black text-[#00A693]">{plan.price}</p>
            <p className="mt-3 leading-7 text-slate-600">{plan.highlight}</p>
            <ul className="mt-6 space-y-2 text-sm font-bold text-slate-700">
              {plan.features.map((feature) => <li key={feature}>- {feature}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-20 lg:grid-cols-2 lg:px-16">
        <div className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
          <h2 className="text-3xl font-black">{t("market.cloudSecurity")}</h2>
          <div className="mt-5 space-y-4">
            {securityItems.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
          <h2 className="text-3xl font-black">{t("market.integrations")}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {integrationItems.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
