"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";

const studioTools = [
  {
    title: "Traduction automatique",
    text: "Traduire factures, devis et emails clients en gardant le ton professionnel.",
    action: "Traduire",
  },
  {
    title: "Resume de rapport",
    text: "Transformer un rapport long en synthese dirigeant avec risques et actions.",
    action: "Resumer",
  },
  {
    title: "Email client",
    text: "Generer une reponse claire pour relance, proposition, retard ou suivi.",
    action: "Rediger",
  },
  {
    title: "Page de vente",
    text: "Creer une page marketing pour un module, un secteur ou une offre SaaS.",
    action: "Generer",
  },
  {
    title: "Prediction ventes",
    text: "Identifier les tendances, opportunites et risques commerciaux.",
    action: "Analyser",
  },
  {
    title: "Rupture de stock",
    text: "Predire les references a risque selon ventes, stock et delais fournisseur.",
    action: "Predire",
  },
];

export default function AiStudioPage() {
  const { t } = useI18n();

  return (
    <ERPLayout title="AI Studio" subtitle={t("aiStudio.subtitle")} action={t("aiStudio.action")}>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t("aiStudio.tools"), value: "6", change: "Enterprise ready" },
          { label: t("aiStudio.generated"), value: "312", change: "+28%" },
          { label: t("aiStudio.savedTime"), value: "64 h", change: "+18%" },
          { label: t("aiStudio.automations"), value: "23", change: "+9%" },
        ].map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-gradient-to-br from-[#1E2A38] via-[#13243a] to-[#00A990] p-7 text-white shadow-xl">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8df8e8]">EnterpriseERP AI Studio</p>
          <h2 className="mt-4 text-4xl font-black">{t("aiStudio.heroTitle")}</h2>
          <p className="mt-4 leading-8 text-white/75">{t("aiStudio.heroText")}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {studioTools.map((tool) => (
          <article key={tool.title} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h3 className="text-xl font-black text-night">{tool.title}</h3>
            <p className="mt-3 min-h-20 leading-7 text-slate-500">{tool.text}</p>
            <button className="mt-5 rounded-xl bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
              {tool.action}
            </button>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-2xl font-black text-night">{t("aiStudio.promptTitle")}</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_.8fr]">
          <textarea
            rows={8}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none focus:border-[#00C2A9]"
            placeholder={t("aiStudio.placeholder")}
          />
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="font-black text-night">{t("aiStudio.output")}</h3>
            <p className="mt-3 leading-7 text-slate-600">
              L'IA preparera une sortie structuree avec contexte, contenu pret a utiliser, prochaine action et lien vers le module ERP concerne.
            </p>
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
