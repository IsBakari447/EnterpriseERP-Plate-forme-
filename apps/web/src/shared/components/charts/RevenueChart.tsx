"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "@shared/i18n/I18nProvider";

const revenueData = [
  { monthKey: "dashboard.month.jan", revenue: 62000 },
  { monthKey: "dashboard.month.feb", revenue: 74000 },
  { monthKey: "dashboard.month.mar", revenue: 81000 },
  { monthKey: "dashboard.month.apr", revenue: 96000 },
  { monthKey: "dashboard.month.may", revenue: 112000 },
  { monthKey: "dashboard.month.jun", revenue: 128450 },
];

const moduleData = [
  { moduleKey: "nav.crm", value: 1208 },
  { moduleKey: "nav.ventes", value: 342 },
  { moduleKey: "nav.stock", value: 1842 },
  { moduleKey: "nav.facturation", value: 524 },
  { moduleKey: "nav.rh", value: 48 },
];

export function RevenueChart() {
  const { t } = useI18n();
  const localizedRevenueData = revenueData.map((item) => ({
    ...item,
    month: t(item.monthKey),
  }));

  return (
    <div className="h-80 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="mb-5 text-xl font-bold text-night">{t("dashboard.revenueEvolution")}</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={localizedRevenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#00C2A9" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ModuleBarChart() {
  const { t } = useI18n();
  const localizedModuleData = moduleData.map((item) => ({
    ...item,
    module: t(item.moduleKey),
  }));

  return (
    <div className="h-80 rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="mb-5 text-xl font-bold text-night">{t("dashboard.moduleActivity")}</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={localizedModuleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="module" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1E2A38" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
