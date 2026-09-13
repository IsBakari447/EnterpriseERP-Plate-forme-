"use client";

import OperationCrudPage from "@modules/operations/components/OperationCrudPage";
import type { OperationCrudConfig, OperationField, OperationKpi, OperationRow } from "@modules/operations/services/operationCrud.service";
import { useI18n } from "@shared/i18n/I18nProvider";

const config: OperationCrudConfig = {
  kpisPath: "/production/kpis",
  listPath: "/production/items",
  createPath: "/production/orders",
  updatePath: (id) => `/production/orders/${id}`,
  deletePath: (id) => `/production/orders/${id}`,
};

const kpis: OperationKpi[] = [
  { label: "Ordres", value: "0" },
  { label: "Rendement", value: "0%" },
  { label: "Couts", value: "0 EUR" },
  { label: "Alertes qualite", value: "0" },
];

const fields: OperationField[] = [
  { key: "number", label: "Ordre", required: true, defaultValue: `OF-${new Date().getFullYear()}-` },
  { key: "productName", label: "Produit", required: true },
  { key: "quantity", label: "Quantite", type: "number", defaultValue: 0 },
  { key: "plannedCost", label: "Cout prevu", type: "number", defaultValue: 0 },
  { key: "actualCost", label: "Cout reel", type: "number" },
  { key: "progress", label: "Avancement", type: "number", defaultValue: 0 },
  { key: "status", label: "Statut", defaultValue: "planned" },
  { key: "dueDate", label: "Echeance", type: "date" },
];

const rows: OperationRow[] = [
  { id: "demo", title: "OF-2026-001", subtitle: "Production", value: "0%", meta: "0 EUR", status: "planned" },
];

export default function ProductionPage() {
  const { t } = useI18n();

  return (
    <OperationCrudPage
      title={t("nav.production")}
      subtitle="Ordres de fabrication, quantites, couts, rendement et alertes."
      action="Nouvel ordre"
      listTitle="Ordres de production"
      formTitle="Nouvel ordre"
      kpis={kpis}
      rows={rows}
      columns={[
        { key: "title", label: "Ordre" },
        { key: "subtitle", label: "Produit" },
        { key: "value", label: "Avancement" },
        { key: "meta", label: "Cout" },
        { key: "status", label: t("common.status"), badge: true },
      ]}
      fields={fields}
      config={config}
    />
  );
}
