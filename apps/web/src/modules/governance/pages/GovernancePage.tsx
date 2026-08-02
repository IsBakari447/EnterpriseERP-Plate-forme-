"use client";

import { useEffect, useMemo, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import Badge from "@shared/components/ui/Badge";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import {
  governanceService,
  PlatformFoundation,
  RoleMatrixItem,
  UserItem,
  WorkflowItem,
} from "../services/governance.service";

export default function GovernancePage() {
  const { t } = useI18n();
  const [foundation, setFoundation] = useState<PlatformFoundation | null>(null);
  const [roles, setRoles] = useState<RoleMatrixItem[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    async function loadGovernance() {
      const [foundationData, roleData, workflowData, userData] = await Promise.all([
        governanceService.getFoundation(),
        governanceService.getRoles(),
        governanceService.getWorkflows(),
        governanceService.getUsers(),
      ]);

      setFoundation(foundationData);
      setRoles(roleData);
      setWorkflows(workflowData);
      setUsers(userData);
    }

    loadGovernance();
  }, []);

  const kpis = useMemo(
    () => [
      {
        label: t("governance.users"),
        value: users.length.toString(),
        hint: "Multi-tenant",
        tone: "blue" as const,
      },
      {
        label: t("governance.roles"),
        value: roles.length.toString(),
        hint: "RBAC",
        tone: "green" as const,
      },
      {
        label: t("governance.permissions"),
        value: roles.reduce((count, role) => count + role.permissions.length, 0).toString(),
        hint: "Granulaire",
        tone: "orange" as const,
      },
      {
        label: t("governance.workflows"),
        value: workflows.length.toString(),
        hint: "ERP",
        tone: "purple" as const,
      },
    ],
    [roles, t, users.length, workflows.length]
  );

  return (
    <ERPLayout
      title={t("governance.title")}
      subtitle={t("governance.subtitle")}
      action={t("governance.invite")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-night">{t("governance.foundation")}</h2>
              <p className="mt-1 text-sm text-slate-500">{foundation?.positioning ?? "Cloud ERP SaaS"}</p>
            </div>
            <Badge color="green">{foundation?.tenantIsolation.status ?? "ready"}</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(foundation?.principles ?? []).map((principle) => (
              <div key={principle} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-black text-night">{principle}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Tenant isolation</div>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              {foundation?.tenantIsolation.strategy ?? "companyId on business tables"}
            </p>
          </div>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-black text-night">{t("governance.users")}</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("common.name")}</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">{t("common.status")}</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
                      {t("governance.noUsers")}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-bold text-night">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3"><Badge color="cyan">{user.role}</Badge></td>
                      <td className="px-4 py-3">{user.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-black text-night">{t("governance.roleMatrix")}</h2>
          <div className="mt-5 space-y-4">
            {roles.map((role) => (
              <div key={role.role} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-black text-night">{role.role}</span>
                  <Badge color="green">{role.permissions.length} permissions</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.slice(0, 8).map((permission) => (
                    <span key={permission} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-black text-night">{t("governance.workflows")}</h2>
          <div className="mt-5 space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.key} className="rounded-xl border border-slate-200 p-4">
                <div className="font-black text-night">{workflow.label}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {workflow.steps.map((step, index) => (
                    <span key={`${workflow.key}-${step}`} className="rounded-full bg-[#1E2A38] px-3 py-1 text-xs font-bold text-white">
                      {index + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </ERPLayout>
  );
}
