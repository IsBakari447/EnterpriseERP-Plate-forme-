"use client";

import { useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { useI18n } from "@shared/i18n/I18nProvider";
import { orders, ventesKpis } from "@modules/ventes/data";
import { salesService, type SalesKpi, type SalesOrder } from "../services/sales.service";

export default function VentesPage() {
  const { t } = useI18n();
  const [kpis, setKpis] = useState<SalesKpi[]>(ventesKpis);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(orders);

  useEffect(() => {
    async function loadSales() {
      const [nextKpis, nextOrders] = await Promise.all([
        salesService.getKpis(),
        salesService.getOrders(),
      ]);

      setKpis(nextKpis);
      setSalesOrders(nextOrders);
    }

    loadSales();
  }, []);

  return (
    <ERPLayout
      title={t("sales.title")}
      subtitle={t("sales.subtitle")}
      action={t("sales.action")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-xl font-bold text-night">
          {t("sales.recentOrders")}
        </h2>

        <DataGrid
          columns={[
            { key: "number", label: t("sales.order") },
            { key: "customer", label: t("common.client") },
            { key: "amount", label: t("common.amount") },
            { key: "date", label: t("common.date") },
            { key: "status", label: t("common.status"), badge: true },
          ]}
          data={salesOrders}
        />
      </section>
    </ERPLayout>
  );
}
