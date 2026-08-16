"use client";

import { pricingPlans } from "@modules/cloud-market/data";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function PricingPage() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
          {tx("Pricing SaaS")}
        </span>
        <h1 className="mt-6 text-5xl font-black">{tx("Des offres simples pour lancer EnterpriseERP Cloud.")}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {tx("L'essai gratuit donne un cadre clair: 14 jours, admin complet, 3 utilisateurs, 20 factures, 50 produits, puis lecture seule jusqu'au paiement.")}
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">{tx(plan.name)}</h2>
              <p className="mt-3 text-3xl font-black text-[#00A693]">{tx(plan.price)}</p>
              <p className="mt-3 leading-7 text-slate-600">{tx(plan.highlight)}</p>
              <ul className="mt-6 space-y-2 text-sm font-bold text-slate-700">
                {plan.features.map((feature) => <li key={feature}>- {tx(feature)}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
