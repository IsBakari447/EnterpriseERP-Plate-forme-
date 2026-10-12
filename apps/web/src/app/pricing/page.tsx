"use client";

import { pricingPlans } from "@modules/cloud-market/data";
import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

const transparentPlans = [
  {
    name: "Starter Trial",
    price: "14 jours gratuits",
    target: "Pour valider le produit sans risque.",
    users: "3",
    storage: "Données de démonstration",
    modules: "CRM, stock, factures",
    ai: "Suggestions de démonstration",
    api: "Lecture API",
    audit: "Journal de base",
    support: "Email",
    multisite: "Non",
  },
  {
    name: "Business Cloud",
    price: "À partir de 49 EUR/mois",
    target: "Pour les PME qui veulent centraliser leurs opérations.",
    users: "5 inclus",
    storage: "10 GB",
    modules: "CRM, ventes, stock, facturation, finance, RH",
    ai: "Assistant IA",
    api: "API REST",
    audit: "Journal entreprise",
    support: "Prioritaire",
    multisite: "1 site",
  },
  {
    name: "Enterprise Cloud",
    price: "Sur devis",
    target: "Pour les organisations multi-sites, les exigences avancées, le SSO et les intégrations dédiées.",
    users: "Sur mesure",
    storage: "Sur mesure",
    modules: "Tous + extensions",
    ai: "Agents dédiés",
    api: "API, webhooks, intégrations dédiées",
    audit: "Audit, SSO, DPA",
    support: "SLA",
    multisite: "Illimité",
  },
];

const comparisonRows = [
  ["Utilisateurs", "users"],
  ["Stockage", "storage"],
  ["Modules", "modules"],
  ["IA", "ai"],
  ["API", "api"],
  ["Audit", "audit"],
  ["Support", "support"],
  ["Multi-sites", "multisite"],
] as const;

export default function PricingPage() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-night">
      <MarketingHeader />
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
          {tx("SaaS pricing")}
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">{tx("Des offres simples pour lancer EnterpriseERP Cloud.")}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {tx("L'essai gratuit donne un cadre clair : 14 jours, admin complet, 3 utilisateurs, 20 factures, 50 produits, puis lecture seule jusqu'au paiement.")}
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

        <section className="mt-12 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">{tx("Comparateur PME")}</p>
              <h2 className="mt-2 text-3xl font-black">{tx("Choisissez une offre claire pour accompagner votre croissance.")}</h2>
            </div>
            <a href="/demo" className="rounded-2xl bg-[#FF7A00] px-5 py-3 font-black text-white">
              {tx("Essayer la démo")}
            </a>
          </div>

          <div className="mt-7 grid gap-4 md:hidden">
            {transparentPlans.map((plan) => (
              <article key={plan.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-xl font-black text-night">{tx(plan.name)}</h3>
                <p className="mt-1 text-2xl font-black text-[#00A693]">{tx(plan.price)}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tx(plan.target)}</p>
                <dl className="mt-5 divide-y divide-slate-200 text-sm">
                  {comparisonRows.map(([label, key]) => (
                    <div key={label} className="grid grid-cols-[.8fr_1.2fr] gap-3 py-3">
                      <dt className="font-black text-night">{tx(label)}</dt>
                      <dd className="font-semibold text-slate-600">{tx(plan[key])}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-7 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th className="rounded-l-2xl bg-slate-50 p-4 font-black text-slate-500">{tx("Fonction")}</th>
                  {transparentPlans.map((plan, index) => (
                    <th key={plan.name} className={`bg-slate-50 p-4 ${index === transparentPlans.length - 1 ? "rounded-r-2xl" : ""}`}>
                      <p className="text-lg font-black text-night">{tx(plan.name)}</p>
                      <p className="mt-1 text-xl font-black text-[#00A693]">{tx(plan.price)}</p>
                      <p className="mt-2 max-w-56 text-xs font-semibold leading-5 text-slate-500">{tx(plan.target)}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([label, key]) => (
                  <tr key={label}>
                    <td className="border-b border-slate-100 p-4 font-black text-night">{tx(label)}</td>
                    {transparentPlans.map((plan) => (
                      <td key={`${plan.name}-${key}`} className="border-b border-slate-100 p-4 font-semibold text-slate-600">
                        {tx(plan[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
      <MarketingFooter />
    </main>
  );
}
