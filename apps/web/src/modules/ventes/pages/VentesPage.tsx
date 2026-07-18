import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { orders, ventesKpis } from "@modules/ventes/data";

export default function VentesPage() {
  return (
    <ERPLayout title="Ventes" subtitle="Suivez vos commandes, revenus et performances commerciales." action="Nouvelle vente">
      <section className="grid grid-cols-4 gap-5">
        {ventesKpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-xl font-bold text-night">Commandes récentes</h2>

        <DataGrid
          columns={[
            { key: "number", label: "Commande" },
            { key: "customer", label: "Client" },
            { key: "amount", label: "Montant" },
            { key: "date", label: "Date" },
            { key: "status", label: "Statut", badge: true },
          ]}
          data={orders}
        />
      </section>
    </ERPLayout>
  );
}
