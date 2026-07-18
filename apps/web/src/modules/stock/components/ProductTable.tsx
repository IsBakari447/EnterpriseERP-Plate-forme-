import DataGrid from "@shared/components/ui/DataGrid";
import { ProductDto } from "../services/product.service";

export default function ProductTable({
  products,
  onDelete,
}: {
  products: ProductDto[];
  onDelete: (id?: string) => Promise<void>;
}) {
  return (
    <DataGrid
      columns={[
        { key: "name", label: "Produit" },
        { key: "sku", label: "SKU" },
        { key: "quantity", label: "Quantité" },
        { key: "status", label: "Statut", badge: true },
        { key: "value", label: "Valeur" },
      ]}
      data={products}
      actions={(product) => (
        <button
          onClick={() => onDelete(product.id)}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          Supprimer
        </button>
      )}
    />
  );
}
