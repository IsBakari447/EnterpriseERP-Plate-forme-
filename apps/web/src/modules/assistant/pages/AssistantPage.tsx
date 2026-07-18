import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { assistantKpis, suggestions } from "@modules/assistant/data";

export default function AssistantPage() {
  return (
    <ERPLayout
      title="Assistant IA"
      subtitle="Posez vos questions métier et obtenez des recommandations intelligentes."
      action="Nouveau rapport IA"
    >
      <section className="grid grid-cols-4 gap-5">
        {assistantKpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">Conversation IA</h2>

          <div className="mt-6 space-y-4">
            <div className="max-w-xl rounded-2xl bg-slate-100 p-4 text-slate-700">
              Pourquoi les ventes ont-elles augmenté ce mois-ci ?
            </div>

            <div className="ml-auto max-w-2xl rounded-2xl bg-gradient-to-r from-[#1E2A38] to-[#00C2A9] p-5 text-white">
              Les ventes progressent principalement grâce aux clients récurrents,
              à une hausse du panier moyen et à une meilleure conversion des devis.
              Recommandation : renforcer les relances commerciales.
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <input
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder="Posez une question à l'assistant..."
            />
            <button className="rounded-xl bg-action px-6 py-3 font-semibold text-white">
              Envoyer
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">Suggestions</h2>

          <div className="mt-5 space-y-3">
            {suggestions.map((item) => (
              <button
                key={item}
                className="w-full rounded-xl bg-slate-50 p-4 text-left text-sm hover:bg-cyan-50"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
