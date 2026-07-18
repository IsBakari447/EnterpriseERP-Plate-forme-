import DataGrid from "@shared/components/ui/DataGrid";
import { InvoiceDto } from "../services/invoice.service";

export default function InvoiceTable({
  invoices,
  onDelete,
}: {
  invoices: InvoiceDto[];
  onDelete: (id?: string) => Promise<void>;
}) {
  return (
    <DataGrid
      columns={[
        { key: "number", label: "N°" },
        { key: "customer", label: "Client" },
        { key: "amount", label: "Montant" },
        { key: "due", label: "Échéance" },
        { key: "status", label: "Statut", badge: true },
      ]}
      data={invoices}
      actions={(invoice) => (
        <button
          onClick={() => onDelete(invoice.id)}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          Supprimer
        </button>
      )}
    />
  );
}
