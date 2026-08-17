"use client";

import { pricingPlans } from "@modules/cloud-market/data";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

const transparentPlans = [
  {
    name: "Starter",
    price: "29 EUR/mois",
    target: "Pour demarrer avec CRM, stock et facturation.",
    users: "2",
    storage: "2 GB",
    modules: "Core ERP",
    ai: "Suggestions basiques",
    api: "Non inclus",
    audit: "Basique",
    support: "Email",
    multisite: "Non",
  },
  {
    name: "Business",
    price: "79 EUR/mois",
    target: "Pour les PME qui veulent piloter ventes, finance et operations.",
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
    name: "Professional",
    price: "149 EUR/mois",
    target: "Pour les equipes multi-roles avec automatisations et rapports.",
    users: "15 inclus",
    storage: "50 GB",
    modules: "Tous les modules metier",
    ai: "Agents IA metier",
    api: "API + webhooks beta",
    audit: "Audit avance",
    support: "Prioritaire + onboarding",
    multisite: "3 sites",
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    target: "Pour multi-sites, exigences avancees, SSO et integrations dediees.",
    users: "Sur mesure",
    storage: "Sur mesure",
    modules: "Tous + extensions",
    ai: "Agents dedies",
    api: "API, webhooks, integrations dediees",
    audit: "Audit, SSO, DPA",
    support: "SLA",
    multisite: "Illimite",
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

        <section className="mt-12 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#00A693]">{tx("Comparateur PME")}</p>
              <h2 className="mt-2 text-3xl font-black">{tx("Choisissez un plan clair selon votre croissance.")}</h2>
            </div>
            <a href="/demo" className="rounded-2xl bg-[#FF7A00] px-5 py-3 font-black text-white">
              {tx("Essayer la demo")}
            </a>
          </div>

          <div className="mt-7 overflow-x-auto">
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
    </main>
  );
}
