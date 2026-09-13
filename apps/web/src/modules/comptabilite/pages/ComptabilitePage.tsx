"use client";

import OperationCrudPage from "@modules/operations/components/OperationCrudPage";
import type { OperationCrudConfig, OperationField, OperationRow } from "@modules/operations/services/operationCrud.service";
import { comptabiliteKpis, entries } from "@modules/comptabilite/data";
import { useI18n } from "@shared/i18n/I18nProvider";

const config: OperationCrudConfig = {
  kpisPath: "/accounting/kpis",
  listPath: "/accounting/items",
  createPath: "/expenses",
  updatePath: (id) => `/expenses/${id}`,
  deletePath: (id) => `/expenses/${id}`,
};

const fields: OperationField[] = [
  { key: "label", label: "Libelle", required: true },
  { key: "category", label: "Categorie", defaultValue: "operations" },
  { key: "supplier", label: "Fournisseur" },
  { key: "amount", label: "Montant", type: "number", defaultValue: 0 },
  { key: "status", label: "Statut", defaultValue: "pending" },
  { key: "expenseDate", label: "Date", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
];

const fallbackRows: OperationRow[] = entries.map((entry) => ({
  id: entry.ref,
  title: entry.label,
  subtitle: entry.type,
  value: entry.amount,
  status: entry.status,
}));

export default function ComptabilitePage() {
  const { t } = useI18n();

  return (
    <OperationCrudPage
      title={t("accounting.title")}
      subtitle={t("accounting.subtitle")}
      action={t("accounting.action")}
      listTitle={t("accounting.entries")}
      formTitle={t("accounting.action")}
      kpis={comptabiliteKpis}
      rows={fallbackRows}
      columns={[
        { key: "title", label: t("accounting.label") },
        { key: "subtitle", label: t("common.type") },
        { key: "value", label: t("common.amount") },
        { key: "status", label: t("common.status"), badge: true },
      ]}
      fields={fields}
      config={config}
    />
  );
}
