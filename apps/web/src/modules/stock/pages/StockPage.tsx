"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import NewProductForm from "../components/NewProductForm";
import ProductTable from "../components/ProductTable";
import { useProducts } from "../hooks/useProducts";

export default function StockPage() {
  const { t } = useI18n();
  const { products, loading, error, createProduct, deleteProduct, reload } = useProducts();

  const totalValue = products.reduce((sum, product) => {
    return sum + Number(product.value || 0);
  }, 0);

  return (
    <ERPLayout
      title={t("stock.title")}
      subtitle={t("stock.subtitle")}
      action={t("common.apiActive")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KPICard label={t("stock.products")} value={String(products.length)} />
        <KPICard
          label={t("stock.total")}
          value={String(products.reduce((sum, product) => sum + Number(product.quantity || 0), 0))}
        />
        <KPICard
          label={t("stock.alerts")}
          value={String(products.filter((product) => product.status !== "Disponible").length)}
        />
        <KPICard label={t("stock.value")} value={`${totalValue} EUR`} />
      </section>

      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{t(error)}</div>}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-night">{t("stock.newProduct")}</h2>
        <NewProductForm onSubmit={createProduct} />
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-night">{t("stock.inStock")}</h2>
          <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm">
            {t("common.refresh")}
          </button>
        </div>

        {loading ? <p>{t("common.loading")}</p> : <ProductTable products={products} onDelete={deleteProduct} />}
      </section>
    </ERPLayout>
  );
}
