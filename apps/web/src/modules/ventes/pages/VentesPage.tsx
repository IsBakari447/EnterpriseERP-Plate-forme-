"use client";

import OperationCrudPage from "@modules/operations/components/OperationCrudPage";
import type { OperationCrudConfig, OperationField, OperationRow } from "@modules/operations/services/operationCrud.service";
import { orders, ventesKpis } from "@modules/ventes/data";
import { useI18n } from "@shared/i18n/I18nProvider";

const config: OperationCrudConfig = {
  kpisPath: "/sales/kpis",
  listPath: "/sales/orders",
  createPath: "/sales/orders",
  updatePath: (id) => `/sales/orders/${id}`,
  deletePath: (id) => `/sales/orders/${id}`,
};

const fields: OperationField[] = [
  { key: "number", label: "Commande", required: true, defaultValue: `CMD-${new Date().getFullYear()}-` },
  { key: "customer", label: "Client", required: true },
  { key: "amount", label: "Montant", type: "number", defaultValue: 0 },
  { key: "status", label: "Statut", defaultValue: "pending" },
  { key: "orderDate", label: "Date", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
  { key: "dueDate", label: "Echeance", type: "date" },
];

const fallbackRows: OperationRow[] = orders.map((order) => ({
  ...order,
  id: order.number,
  title: order.number,
  subtitle: order.customer,
  value: order.amount,
  meta: order.date,
}));

export default function VentesPage() {
  const { t } = useI18n();

  return (
    <OperationCrudPage
      title={t("sales.title")}
      subtitle={t("sales.subtitle")}
      action={t("sales.action")}
      listTitle={t("sales.recentOrders")}
      formTitle={t("sales.action")}
      kpis={ventesKpis}
      rows={fallbackRows}
      columns={[
        { key: "number", label: t("sales.order") },
        { key: "customer", label: t("common.client") },
        { key: "amount", label: t("common.amount") },
        { key: "meta", label: t("common.date") },
        { key: "status", label: t("common.status"), badge: true },
      ]}
      fields={fields}
      config={config}
    />
  );
}
