"use client";

import { useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import { useI18n } from "@shared/i18n/I18nProvider";
import { employees, rhKpis } from "@modules/rh/data";
import { hrService, type Employee, type HrKpi } from "../services/hr.service";

export default function RHPage() {
  const { t } = useI18n();
  const [kpis, setKpis] = useState<HrKpi[]>(rhKpis);
  const [employeeRows, setEmployeeRows] = useState<Employee[]>(employees);

  useEffect(() => {
    async function loadHr() {
      const [nextKpis, nextEmployees] = await Promise.all([
        hrService.getKpis(),
        hrService.getEmployees(),
      ]);

      setKpis(nextKpis);
      setEmployeeRows(nextEmployees);
    }

    loadHr();
  }, []);

  return (
    <ERPLayout
      title={t("hr.title")}
      subtitle={t("hr.subtitle")}
      action={t("hr.action")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-xl font-bold text-night">{t("hr.employees")}</h2>

        <DataGrid
          columns={[
            { key: "name", label: t("common.name") },
            { key: "role", label: t("hr.role") },
            { key: "contract", label: t("hr.contract") },
            { key: "status", label: t("common.status"), badge: true },
          ]}
          data={employeeRows}
        />
      </section>
    </ERPLayout>
  );
}
