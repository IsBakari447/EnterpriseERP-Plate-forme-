import DataGrid from "@shared/components/ui/DataGrid";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { ClientDto } from "../services/client.service";

export default function ClientTable({
  clients,
  onEdit,
  onDelete,
}: {
  clients: ClientDto[];
  onEdit: (client: ClientDto) => void;
  onDelete: (id?: string) => Promise<void>;
}) {
  const { locale } = useI18n();
  const tFixed = (value: string) => translateFixedLabel(value, locale);

  return (
    <DataGrid
      columns={[
        { key: "name", label: "Client" },
        { key: "email", label: "Email" },
        { key: "country", label: "Pays" },
        { key: "status", label: "Statut", badge: true },
        { key: "revenue", label: "CA" },
      ]}
      data={clients}
      actions={(client) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(client)}
            className="rounded-lg bg-cyan-50 px-3 py-2 text-sm font-semibold text-turquoise hover:bg-cyan-100"
          >
            {tFixed("Modifier")}
          </button>

          <button
            onClick={() => onDelete(client.id)}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            {tFixed("Supprimer")}
          </button>
        </div>
      )}
    />
  );
}
