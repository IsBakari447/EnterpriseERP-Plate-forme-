import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { ModuleBarChart, RevenueChart } from "@shared/components/charts/RevenueChart";
import {
  alerts,
  globalKpis,
  marketModules,
  moduleStats,
  pricingPlans,
  trustItems,
} from "../data";

export default function DashboardPage() {
  return (
    <ERPLayout
      title="EnterpriseERP Cloud Command Center"
      subtitle="Plateforme ERP SaaS pour piloter ventes, CRM, stock, facturation, IA et mobile depuis le cloud."
      action="Generer rapport IA"
    >
      <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-3xl bg-gradient-to-br from-[#1E2A38] via-[#142235] to-[#00C2A9] p-8 text-white shadow-xl">
          <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
            ERP Cloud + AI ready + Mobile ready
          </div>
          <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight lg:text-5xl">
            Une base SaaS plus claire, plus vendable et prete pour la croissance.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
            EnterpriseERP Cloud rassemble les donnees critiques, la facturation,
            le CRM, le stock et les recommandations IA dans une experience
            professionnelle pour dirigeants et equipes operationnelles.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["14 jours gratuits", "API-first", "Multi-entreprise ready"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 font-bold">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">Priorites marche</h2>
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
            Statistiques par module
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
          <h2 className="text-xl font-bold text-night">Alertes globales</h2>

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
            <h2 className="text-2xl font-black text-night">Modules qui rendent le SaaS competitif</h2>
            <p className="mt-2 max-w-3xl text-slate-500">
              La plateforme doit montrer rapidement ce qu'elle apporte au marche:
              pilotage, automatisation, mobile, securite et donnees exploitables.
            </p>
          </div>
          <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
            Roadmap produit lisible
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
          <h2 className="text-2xl font-black">Synthese IA</h2>
          <p className="mt-4 leading-8 text-white/75">
            L'entreprise affiche une progression solide. Les ventes augmentent,
            le portefeuille client se developpe et la rentabilite reste positive.
            Les priorites recommandees sont: relance des factures en retard,
            reapprovisionnement des produits critiques et conversion des prospects.
          </p>
          <div className="mt-6 rounded-2xl bg-white/10 p-5">
            <strong>Prochaine action recommandee</strong>
            <p className="mt-2 text-white/75">
              Creer un workflow de relance automatique pour les factures en retard
              et afficher son impact dans le dashboard dirigeant.
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
        <h2 className="text-2xl font-black text-night">Preuves de confiance</h2>
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
