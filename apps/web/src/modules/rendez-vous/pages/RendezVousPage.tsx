"use client";

import OperationCrudPage from "@modules/operations/components/OperationCrudPage";
import type { OperationCrudConfig, OperationField, OperationKpi, OperationRow } from "@modules/operations/services/operationCrud.service";
import { useI18n } from "@shared/i18n/I18nProvider";

const config: OperationCrudConfig = {
  kpisPath: "/appointments/kpis",
  listPath: "/appointments/items",
  createPath: "/appointments",
  updatePath: (id) => `/appointments/${id}`,
  deletePath: (id) => `/appointments/${id}`,
};

const kpis: OperationKpi[] = [
  { label: "Rendez-vous du jour", value: "0" },
  { label: "Creneaux libres", value: "0" },
  { label: "A confirmer", value: "0" },
  { label: "Risque absence", value: "0" },
];

const fields: OperationField[] = [
  { key: "title", label: "Titre", required: true },
  { key: "clientName", label: "Client / patient" },
  { key: "scheduledAt", label: "Date et heure", type: "datetime-local", required: true },
  { key: "endAt", label: "Fin", type: "datetime-local" },
  { key: "status", label: "Statut", defaultValue: "scheduled" },
  { key: "location", label: "Lieu" },
];

const rows: OperationRow[] = [
  { id: "demo", title: "Premier rendez-vous", subtitle: "Client", value: "09:00", meta: "Aujourd'hui", status: "scheduled" },
];

export default function RendezVousPage() {
  const { t } = useI18n();

  return (
    <OperationCrudPage
      title={t("nav.rendez-vous")}
      subtitle="Agenda, disponibilites, confirmations et suivi des rendez-vous."
      action="Nouveau rendez-vous"
      listTitle="Agenda"
      formTitle="Nouveau rendez-vous"
      kpis={kpis}
      rows={rows}
      columns={[
        { key: "title", label: "Titre" },
        { key: "subtitle", label: "Client" },
        { key: "value", label: "Heure" },
        { key: "meta", label: "Date" },
        { key: "status", label: t("common.status"), badge: true },
      ]}
      fields={fields}
      config={config}
    />
  );
}
