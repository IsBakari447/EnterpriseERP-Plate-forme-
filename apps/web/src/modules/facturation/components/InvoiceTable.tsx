"use client";

import DataGrid from "@shared/components/ui/DataGrid";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { InvoiceDto } from "../services/invoice.service";

export default function InvoiceTable({
  invoices,
  onDelete,
}: {
  invoices: InvoiceDto[];
  onDelete: (id?: string) => Promise<void>;
}) {
  const { locale } = useI18n();
  const tf = (value: string) => translateFixedLabel(value, locale);

  return (
    <DataGrid
      columns={[
        { key: "number", label: tf("No") },
        { key: "customer", label: tf("Client") },
        { key: "amount", label: tf("Montant") },
        { key: "due", label: tf("Echeance") },
        { key: "status", label: tf("Statut"), badge: true },
      ]}
      data={invoices}
      actions={(invoice) => (
        <button onClick={() => onDelete(invoice.id)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
          {tf("Supprimer")}
        </button>
      )}
    />
  );
}
