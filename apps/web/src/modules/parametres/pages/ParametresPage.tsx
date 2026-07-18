import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import Badge from "@shared/components/ui/Badge";
import { parametresKpis, settings } from "@modules/parametres/data";

export default function ParametresPage() {
  return (
    <ERPLayout
      title="Paramètres"
      subtitle="Configurez votre entreprise, la sécurité, les langues et les préférences."
      action="Enregistrer"
    >
      <section className="grid grid-cols-4 gap-5">
        {parametresKpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 grid grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-bold text-night">Entreprise</h2>

          <div className="space-y-4">
            {settings.map((item) => (
              <div key={item.label}>
                <label className="text-sm text-slate-500">{item.label}</label>
                <input
                  value={item.value}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-bold text-night">Sécurité</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>Authentification à deux facteurs</span>
              <Badge color="green">Active</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>Journal d’audit</span>
              <Badge color="green">Activé</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>Sauvegardes automatiques</span>
              <Badge color="cyan">Quotidiennes</Badge>
            </div>
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
