import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { comptabiliteKpis, entries } from "@modules/comptabilite/data";

export default function ComptabilitePage() {
  return (
    <ERPLayout title="Comptabilité" subtitle="Suivez vos écritures, dépenses, recettes et obligations fiscales." action="Nouvelle écriture">
      <section className="grid grid-cols-4 gap-5">
        {comptabiliteKpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-xl font-bold text-night">Écritures comptables</h2>

        <DataGrid
          columns={[
            { key: "ref", label: "Référence" },
            { key: "label", label: "Libellé" },
            { key: "type", label: "Type" },
            { key: "amount", label: "Montant" },
            { key: "status", label: "Statut", badge: true },
          ]}
          data={entries}
        />
      </section>
    </ERPLayout>
  );
}
