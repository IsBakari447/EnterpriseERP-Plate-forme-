"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import NewInvoiceForm from "../components/NewInvoiceForm";
import InvoiceTable from "../components/InvoiceTable";
import { useInvoices } from "../hooks/useInvoices";

export default function FacturationPage() {
  const { invoices, loading, error, createInvoice, deleteInvoice, reload } = useInvoices();

  const total = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const pending = invoices
    .filter((invoice) => invoice.status !== "Payée")
    .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  return (
    <ERPLayout
      title="Facturation"
      subtitle="Gérez les factures, paiements et échéances."
      action="API PostgreSQL active"
    >
      <section className="grid grid-cols-4 gap-5">
        <KPICard label="CA facturé" value={`${total} €`} />
        <KPICard label="Factures" value={String(invoices.length)} />
        <KPICard label="À encaisser" value={`${pending} €`} />
        <KPICard
          label="Retards"
          value={String(invoices.filter((i) => i.status === "En retard").length)}
        />
      </section>

      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-night">Nouvelle facture</h2>
        <NewInvoiceForm onSubmit={createInvoice} />
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-night">Liste des factures</h2>
          <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm">
            Actualiser
          </button>
        </div>

        {loading ? <p>Chargement...</p> : <InvoiceTable invoices={invoices} onDelete={deleteInvoice} />}
      </section>
    </ERPLayout>
  );
}
