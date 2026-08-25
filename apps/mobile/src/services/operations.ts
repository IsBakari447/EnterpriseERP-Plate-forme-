import { api } from "@/services/api";

export type ModuleApiKey =
  | "sales"
  | "hr"
  | "reports"
  | "accounting"
  | "appointments"
  | "production";

export type ApiMetric = {
  label?: string;
  labelKey?: string;
  value: string;
  change?: string;
  changeKey?: string;
};

export type ApiListItem = {
  id?: string;
  title?: string;
  titleKey?: string;
  subtitle?: string;
  subtitleKey?: string;
  value?: string;
  meta?: string;
  metaKey?: string;
  status?: string;
  statusKey?: string;
  number?: string;
  customer?: string;
  amount?: string;
  date?: string;
  name?: string;
  role?: string;
  roleKey?: string;
  contract?: string;
};

const moduleEndpoints: Record<ModuleApiKey, { kpis: string; items: string }> = {
  sales: { kpis: "/api/sales/kpis", items: "/api/sales/orders" },
  hr: { kpis: "/api/hr/kpis", items: "/api/hr/employees" },
  reports: { kpis: "/api/reports/kpis", items: "/api/reports/items" },
  accounting: { kpis: "/api/accounting/kpis", items: "/api/accounting/items" },
  appointments: { kpis: "/api/appointments/kpis", items: "/api/appointments/items" },
  production: { kpis: "/api/production/kpis", items: "/api/production/items" },
};

export async function getModuleKpis(module: ModuleApiKey) {
  return api<ApiMetric[]>(moduleEndpoints[module].kpis);
}

export async function getModuleItems(module: ModuleApiKey) {
  return api<ApiListItem[]>(moduleEndpoints[module].items);
}
