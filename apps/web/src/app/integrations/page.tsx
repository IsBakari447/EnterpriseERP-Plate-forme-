"use client";

import { integrationItems } from "@modules/cloud-market/data";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function IntegrationsPage() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
          API-first
        </span>
        <h1 className="mt-6 text-5xl font-black">{tx("Connecter EnterpriseERP Cloud a tout l'ecosysteme client.")}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {tx("Les clients Cloud attendent mobile, API, webhooks, finance, paiement, email et BI. Cette page rend la roadmap integration visible.")}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {integrationItems.map((item) => (
            <span key={item} className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-700 shadow ring-1 ring-slate-200">
              {tx(item)}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
