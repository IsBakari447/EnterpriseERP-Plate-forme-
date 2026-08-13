"use client";

import DataGrid from "@shared/components/ui/DataGrid";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { ProductDto } from "../services/product.service";

export default function ProductTable({
  products,
  onDelete,
}: {
  products: ProductDto[];
  onDelete: (id?: string) => Promise<void>;
}) {
  const { locale } = useI18n();
  const tf = (value: string) => translateFixedLabel(value, locale);

  return (
    <DataGrid
      columns={[
        { key: "name", label: tf("Produit") },
        { key: "sku", label: "SKU" },
        { key: "quantity", label: tf("Quantite") },
        { key: "status", label: tf("Statut"), badge: true },
        { key: "value", label: tf("Valeur") },
      ]}
      data={products}
      actions={(product) => (
        <button onClick={() => onDelete(product.id)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
          {tf("Supprimer")}
        </button>
      )}
    />
  );
}
