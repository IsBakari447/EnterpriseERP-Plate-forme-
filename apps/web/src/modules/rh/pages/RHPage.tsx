"use client";

import { useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import DataGrid from "@shared/components/ui/DataGrid";
import DetailsDrawer from "@shared/components/ui/DetailsDrawer";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { employees, rhKpis } from "@modules/rh/data";
import { hrService, type Employee, type HrKpi } from "../services/hr.service";

export default function RHPage() {
  const { locale, t } = useI18n();
  const tc = (value: string) => translateContentText(value, locale);
  const [kpis, setKpis] = useState<HrKpi[]>(rhKpis);
  const [employeeRows, setEmployeeRows] = useState<Employee[]>(employees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(employees[0]);

  useEffect(() => {
    async function loadHr() {
      const [nextKpis, nextEmployees] = await Promise.all([
        hrService.getKpis(),
        hrService.getEmployees(),
      ]);

      setKpis(nextKpis);
      setEmployeeRows(nextEmployees);
      setSelectedEmployee((current) => {
        return nextEmployees.find((employee) => employee.name === current.name) ?? nextEmployees[0] ?? current;
      });
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
          onRowClick={setSelectedEmployee}
        />
      </section>

      {selectedEmployee && (
        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <DetailsDrawer
            title={selectedEmployee.name}
            description="Employee record"
            details={[
              { label: t("hr.role"), value: selectedEmployee.role },
              { label: t("hr.contract"), value: selectedEmployee.contract },
              { label: t("common.status"), value: selectedEmployee.status },
              { label: t("profile.email"), value: selectedEmployee.email ?? "-" },
              { label: t("profile.phone"), value: selectedEmployee.phone ?? "-" },
              { label: t("profile.department"), value: selectedEmployee.department ?? "-" },
              { label: tc("Manager"), value: selectedEmployee.manager ?? "-" },
              { label: tc("Start date"), value: selectedEmployee.startDate ?? "-" },
              { label: tc("Payroll"), value: selectedEmployee.salary ?? "-" },
              { label: tc("Leave balance"), value: selectedEmployee.leaveBalance ?? "-" },
            ]}
          />

          <aside className="rounded-2xl bg-night p-6 text-white shadow ring-1 ring-slate-900/10">
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-turquoise">
              IA
            </span>
            <h2 className="mt-4 text-xl font-black">{tc("AI recommendation")}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              {tc(selectedEmployee.nextAction ?? "Review this employee record and assign the next HR action.")}
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-300">{tc("Documents")}</p>
                <p className="mt-1 text-sm font-bold text-white">{selectedEmployee.documents ?? "-"}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-300">{tc("Availability")}</p>
                <p className="mt-1 text-sm font-bold text-white">{tc(selectedEmployee.status)}</p>
              </div>
            </div>
          </aside>
        </section>
      )}
    </ERPLayout>
  );
}
