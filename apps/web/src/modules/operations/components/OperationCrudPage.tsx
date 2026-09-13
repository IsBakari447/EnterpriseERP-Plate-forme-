"use client";

import { useEffect, useMemo, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import DataGrid from "@shared/components/ui/DataGrid";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import {
  createOperationCrud,
  type OperationCrudConfig,
  type OperationField,
  type OperationKpi,
  type OperationRow,
} from "../services/operationCrud.service";

type OperationColumn = {
  key: string;
  label: string;
  badge?: boolean;
};

type Props = {
  title: string;
  subtitle: string;
  action: string;
  listTitle: string;
  formTitle: string;
  kpis: OperationKpi[];
  rows: OperationRow[];
  columns: OperationColumn[];
  fields: OperationField[];
  config: OperationCrudConfig;
};

function toInputValue(value: unknown) {
  if (value === undefined || value === null) return "";
  return String(value);
}

function normalizeFormValue(field: OperationField, value: string) {
  if (field.type === "number") {
    const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return value;
}

function buildInitialForm(fields: OperationField[], row?: OperationRow | null) {
  return fields.reduce<OperationRow>((acc, field) => {
    acc[field.key] = toInputValue(row?.[field.key] ?? field.defaultValue ?? "");
    return acc;
  }, {});
}

const apiLabels: Record<string, string> = {
  "api.sales.kpi.monthlySales": "Ventes du mois",
  "api.sales.kpi.orders": "Commandes",
  "api.sales.kpi.averageBasket": "Panier moyen",
  "api.sales.kpi.conversion": "Conversion",
  "api.reports.kpi.savedViews": "Vues enregistrees",
  "api.reports.kpi.exports": "Exports",
  "api.reports.kpi.scheduled": "Rapports programmes",
  "api.reports.kpi.insights": "Insights",
  "api.accounting.kpi.revenue": "Recettes",
  "api.accounting.kpi.expenses": "Depenses",
  "api.accounting.kpi.taxes": "Taxes",
  "api.accounting.kpi.reconciliations": "A rapprocher",
  "api.appointments.kpi.today": "Rendez-vous du jour",
  "api.appointments.kpi.availableSlots": "Creneaux libres",
  "api.appointments.kpi.toConfirm": "A confirmer",
  "api.appointments.kpi.noShowRisk": "Risque absence",
  "api.production.kpi.orders": "Ordres",
  "api.production.kpi.yield": "Rendement",
  "api.production.kpi.costs": "Couts",
  "api.production.kpi.qualityAlerts": "Alertes qualite",
  "trend.today": "Aujourd'hui",
  "common.available": "Disponible",
  "trend.priority": "Priorite",
  "trend.watch": "A surveiller",
  "trend.live": "Live",
  "trend.action": "Action",
};

export default function OperationCrudPage({
  title,
  subtitle,
  action,
  listTitle,
  formTitle,
  kpis,
  rows,
  columns,
  fields,
  config,
}: Props) {
  const { locale, t } = useI18n();
  const tc = (value: string) => translateContentText(value, locale);
  const label = (value?: string) => tc(apiLabels[value ?? ""] ?? value ?? "");
  const service = useMemo(() => createOperationCrud(config), [config]);
  const [currentKpis, setCurrentKpis] = useState(kpis);
  const [currentRows, setCurrentRows] = useState(rows);
  const [selectedRow, setSelectedRow] = useState<OperationRow | null>(null);
  const [form, setForm] = useState<OperationRow>(() => buildInitialForm(fields));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    const [nextKpis, nextRows] = await Promise.all([
      service.getKpis(kpis),
      service.findAll(rows),
    ]);
    setCurrentKpis(nextKpis);
    setCurrentRows(nextRows);
    setLoading(false);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startEdit(row: OperationRow) {
    setSelectedRow(row);
    setForm(buildInitialForm(fields, row));
    setMessage("");
    setError("");
  }

  function resetForm() {
    setSelectedRow(null);
    setForm(buildInitialForm(fields));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = fields.reduce<OperationRow>((acc, field) => {
      acc[field.key] = normalizeFormValue(field, String(form[field.key] ?? ""));
      return acc;
    }, {});

    try {
      if (selectedRow?.id) {
        const updated = await service.update(selectedRow.id, payload);
        setCurrentRows((items) => items.map((item) => (item.id === selectedRow.id ? updated : item)));
        setMessage(tc("Saved."));
      } else {
        const created = await service.create(payload);
        setCurrentRows((items) => [created, ...items]);
        setMessage(tc("Saved."));
      }
      resetForm();
      await service.getKpis(kpis).then(setCurrentKpis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save. Check the information.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: OperationRow) {
    if (!row.id) return;
    setError("");
    setMessage("");

    try {
      await service.remove(row.id);
      setCurrentRows((items) => items.filter((item) => item.id !== row.id));
      if (selectedRow?.id === row.id) resetForm();
      setMessage(tc("Saved."));
      await service.getKpis(kpis).then(setCurrentKpis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save. Check the information.");
    }
  }

  return (
    <ERPLayout title={title} subtitle={subtitle} action={action}>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {currentKpis.map((kpi) => (
          <KPICard
            key={kpi.label ?? kpi.labelKey}
            label={label(kpi.label ?? kpi.labelKey)}
            value={kpi.value}
            change={label(kpi.change ?? kpi.changeKey)}
          />
        ))}
      </section>

      {(error || message) && (
        <div className={`mt-6 rounded-xl p-4 font-bold ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {tc(error || message)}
        </div>
      )}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-night">
            {selectedRow ? tc("Modifier") : formTitle}
          </h2>
          {selectedRow && (
            <button type="button" onClick={resetForm} className="rounded-xl border px-4 py-2 text-sm font-bold">
              {tc("Annuler")}
            </button>
          )}
        </div>

        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className="grid gap-2 text-sm font-black text-night">
              {field.label}
              <input
                required={field.required}
                type={field.type ?? "text"}
                value={toInputValue(form[field.key])}
                onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                className="rounded-xl border border-slate-300 px-4 py-3 font-medium outline-none focus:border-cyan-500"
              />
            </label>
          ))}

          <div className="lg:col-span-2">
            <button disabled={saving} className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow disabled:opacity-60">
              {saving ? t("common.loading") : selectedRow ? tc("Enregistrer") : action}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-night">{listTitle}</h2>
          <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm">
            {t("common.refresh")}
          </button>
        </div>

        {loading ? (
          <p>{t("common.loading")}</p>
        ) : (
          <DataGrid
            columns={columns.map((column) => ({ ...column, key: column.key }))}
            data={currentRows}
            onRowClick={startEdit}
            actions={(row) => (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  remove(row);
                }}
                className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
              >
                {tc("Supprimer")}
              </button>
            )}
          />
        )}
      </section>
    </ERPLayout>
  );
}
