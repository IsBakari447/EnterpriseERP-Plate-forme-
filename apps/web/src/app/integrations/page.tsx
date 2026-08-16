"use client";

import { integrationItems } from "@modules/cloud-market/data";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function IntegrationsPage() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);
  const statuses = ["Disponible", "Disponible", "Disponible", "Disponible", "Disponible", "Beta", "Prevu", "Prevu", "Prevu"];
  const statusClass = (status: string) =>
    status === "Disponible"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Beta"
        ? "bg-cyan-50 text-cyan-700"
        : "bg-slate-100 text-slate-600";

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
          API-first
        </span>
        <h1 className="mt-6 text-5xl font-black">{tx("Connecter EnterpriseERP Cloud a tout l'ecosysteme client.")}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {tx("Connectez progressivement API, webhooks, paiements, email, calendrier et connecteurs comptables avec des statuts clairs: disponible, beta ou prevu.")}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {integrationItems.map((item, index) => (
            <article key={item} className="flex items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 shadow ring-1 ring-slate-200">
              <span className="text-sm font-black text-slate-700">{tx(item)}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(statuses[index])}`}>
                {tx(statuses[index])}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
