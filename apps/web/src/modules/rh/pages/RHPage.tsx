import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { employees, rhKpis } from "@modules/rh/data";

export default function RHPage() {
  return (
    <ERPLayout title="Ressources Humaines" subtitle="Gérez les employés, contrats, congés et présences." action="Nouvel employé">
      <section className="grid grid-cols-4 gap-5">
        {rhKpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-xl font-bold text-night">Employés</h2>

        <DataGrid
          columns={[
            { key: "name", label: "Nom" },
            { key: "role", label: "Poste" },
            { key: "contract", label: "Contrat" },
            { key: "status", label: "Statut", badge: true },
          ]}
          data={employees}
        />
      </section>
    </ERPLayout>
  );
}
