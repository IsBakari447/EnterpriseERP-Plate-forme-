"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import DataGrid from "@shared/components/ui/DataGrid";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

const auditRows = [
  { date: "2026-08-10 09:12", user: "Issa Bakari", action: "LOGIN_SUCCESS", module: "auth", object: "UserSession", ip: "192.168.1.183", result: "success", details: "Windows Edge Stockholm" },
  { date: "2026-08-10 09:18", user: "Issa Bakari", action: "PASSWORD_CHANGED", module: "security", object: "User", ip: "192.168.1.183", result: "success", details: "Mot de passe modifie" },
  { date: "2026-08-10 09:22", user: "Admin", action: "ROLE_CHANGED", module: "users", object: "Role", ip: "192.168.1.183", result: "warning", details: "Permission finance ajoutee" },
  { date: "2026-08-10 09:27", user: "Comptable", action: "EXPORT_CREATED", module: "finance", object: "Export", ip: "192.168.1.183", result: "success", details: "Export comptable CSV" },
  { date: "2026-08-10 09:31", user: "Manager", action: "STOCK_ADJUSTED", module: "stock", object: "Product", ip: "192.168.1.183", result: "success", details: "Ajustement inventaire" },
];

export default function AuditPage() {
  const { locale } = useI18n();
  const tc = (value: string) => translateContentText(value, locale);
  const rows = auditRows.map((row) => ({
    ...row,
    result: tc(row.result),
    details: tc(row.details),
  }));

  return (
    <ERPLayout title={tc("Audit & Activity")} subtitle={tc("Console d'investigation pour connexions, actions sensibles, exports, roles et activites.")} action={tc("Exporter")}>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Actions aujourd'hui", value: "148", change: "+12%" },
          { label: "Connexions", value: "34", change: "Actives" },
          { label: "Echecs de connexion", value: "2", change: "A verifier" },
          { label: "Actions sensibles", value: "9", change: "Roles / exports" },
          { label: "Alertes securite", value: "3", change: "Moyen" },
        ].map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-2xl font-black text-night">{tc("Filtres")}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {["Date", "Utilisateur", "Module", "Action", "Resultat", "Adresse IP"].map((filter) => (
            <input key={filter} placeholder={tc(filter)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#00C2A9]" />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="mb-5 text-2xl font-black text-night">{tc("Journal")}</h2>
        <DataGrid
          columns={[
            { key: "date", label: "Date" },
            { key: "user", label: tc("Utilisateur") },
            { key: "action", label: "Action" },
            { key: "module", label: "Module" },
            { key: "object", label: tc("Objet") },
            { key: "ip", label: "IP" },
            { key: "result", label: tc("Resultat"), badge: true },
            { key: "details", label: tc("Details") },
          ]}
          data={rows}
        />
      </section>
    </ERPLayout>
  );
}
