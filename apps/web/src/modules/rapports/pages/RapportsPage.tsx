"use client";

import OperationCrudPage from "@modules/operations/components/OperationCrudPage";
import type { OperationCrudConfig, OperationField, OperationKpi, OperationRow } from "@modules/operations/services/operationCrud.service";
import { useI18n } from "@shared/i18n/I18nProvider";

const config: OperationCrudConfig = {
  kpisPath: "/reports/kpis",
  listPath: "/reports/views",
  createPath: "/reports/views",
  updatePath: (id) => `/reports/views/${id}`,
  deletePath: (id) => `/reports/views/${id}`,
};

const kpis: OperationKpi[] = [
  { label: "Vues enregistrées", value: "0" },
  { label: "Exports", value: "0" },
  { label: "Rapports programmés", value: "0" },
  { label: "Insights", value: "0" },
];

const fields: OperationField[] = [
  { key: "name", label: "Nom du rapport", required: true },
  { key: "type", label: "Type", defaultValue: "executive" },
  { key: "status", label: "Statut", defaultValue: "ready" },
  { key: "schedule", label: "Fréquence" },
  { key: "lastRunAt", label: "Dernière exécution", type: "datetime-local" },
];

const rows: OperationRow[] = [
  { id: "executive", name: "Vue Direction", type: "executive", schedule: "manual", status: "ready" },
];

export default function RapportsPage() {
  const { t } = useI18n();

  return (
    <OperationCrudPage
      title={t("nav.rapports")}
      subtitle="KPI, vues enregistrées, rapports programmés et exports décisionnels."
      action="Créer un rapport"
      listTitle="Rapports enregistrés"
      formTitle="Créer un rapport"
      kpis={kpis}
      rows={rows}
      columns={[
        { key: "name", label: "Nom" },
        { key: "type", label: "Type" },
        { key: "schedule", label: "Fréquence" },
        { key: "status", label: t("common.status"), badge: true },
      ]}
      fields={fields}
      config={config}
    />
  );
}
