"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import NewProductForm from "../components/NewProductForm";
import ProductTable from "../components/ProductTable";
import { useProducts } from "../hooks/useProducts";

export default function StockPage() {
  const { products, loading, error, createProduct, deleteProduct, reload } = useProducts();

  const totalValue = products.reduce((sum, product) => {
    return sum + Number(product.value || 0);
  }, 0);

  return (
    <ERPLayout
      title="Gestion du stock"
      subtitle="Suivez vos produits, quantités et alertes."
      action="API PostgreSQL active"
    >
      <section className="grid grid-cols-4 gap-5">
        <KPICard label="Produits" value={String(products.length)} />
        <KPICard
          label="Stock total"
          value={String(products.reduce((sum, p) => sum + Number(p.quantity || 0), 0))}
        />
        <KPICard
          label="Alertes"
          value={String(products.filter((p) => p.status !== "Disponible").length)}
        />
        <KPICard label="Valeur stock" value={`${totalValue} €`} />
      </section>

      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-night">Nouveau produit</h2>
        <NewProductForm onSubmit={createProduct} />
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-night">Produits en stock</h2>
          <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm">
            Actualiser
          </button>
        </div>

        {loading ? <p>Chargement...</p> : <ProductTable products={products} onDelete={deleteProduct} />}
      </section>
    </ERPLayout>
  );
}
