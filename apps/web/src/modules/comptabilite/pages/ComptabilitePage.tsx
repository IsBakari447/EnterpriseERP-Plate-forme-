"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { useI18n } from "@shared/i18n/I18nProvider";
import { comptabiliteKpis, entries } from "@modules/comptabilite/data";

export default function ComptabilitePage() {
  const { t } = useI18n();

  return (
    <ERPLayout
      title={t("accounting.title")}
      subtitle={t("accounting.subtitle")}
      action={t("accounting.action")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {comptabiliteKpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-xl font-bold text-night">
          {t("accounting.entries")}
        </h2>

        <DataGrid
          columns={[
            { key: "ref", label: t("accounting.reference") },
            { key: "label", label: t("accounting.label") },
            { key: "type", label: t("common.type") },
            { key: "amount", label: t("common.amount") },
            { key: "status", label: t("common.status"), badge: true },
          ]}
          data={entries}
        />
      </section>
    </ERPLayout>
  );
}
