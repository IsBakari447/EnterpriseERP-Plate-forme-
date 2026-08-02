"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import NewInvoiceForm from "../components/NewInvoiceForm";
import InvoiceTable from "../components/InvoiceTable";
import { useInvoices } from "../hooks/useInvoices";

export default function FacturationPage() {
  const { t } = useI18n();
  const { invoices, loading, error, createInvoice, deleteInvoice, reload } = useInvoices();

  const total = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const pending = invoices
    .filter((invoice) => invoice.status !== "Payee")
    .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  return (
    <ERPLayout
      title={t("billing.title")}
      subtitle={t("billing.subtitle")}
      action={t("common.apiActive")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KPICard label={t("billing.revenue")} value={`${total} EUR`} />
        <KPICard label={t("billing.invoices")} value={String(invoices.length)} />
        <KPICard label={t("billing.pending")} value={`${pending} EUR`} />
        <KPICard
          label={t("billing.late")}
          value={String(invoices.filter((invoice) => invoice.status === "En retard").length)}
        />
      </section>

      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-night">{t("billing.newInvoice")}</h2>
        <NewInvoiceForm onSubmit={createInvoice} />
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-night">{t("billing.list")}</h2>
          <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm">
            {t("common.refresh")}
          </button>
        </div>

        {loading ? <p>{t("common.loading")}</p> : <InvoiceTable invoices={invoices} onDelete={deleteInvoice} />}
      </section>
    </ERPLayout>
  );
}
