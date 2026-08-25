import type { ModuleKey } from "@/types/sector";
import type { TranslationKey } from "@/i18n";

type ModuleMeta = {
  labelKey: TranslationKey;
  icon: string;
  route: string;
};

export const moduleMeta: Record<ModuleKey, ModuleMeta> = {
  crm: { labelKey: "module.crm", icon: "people-outline", route: "/module/crm" },
  sales: { labelKey: "module.sales", icon: "cart-outline", route: "/module/sales" },
  stock: { labelKey: "module.stock", icon: "cube-outline", route: "/module/stock" },
  invoicing: { labelKey: "module.invoicing", icon: "document-text-outline", route: "/module/invoicing" },
  accounting: { labelKey: "module.accounting", icon: "calculator-outline", route: "/module/accounting" },
  hr: { labelKey: "module.hr", icon: "id-card-outline", route: "/module/hr" },
  appointments: { labelKey: "module.appointments", icon: "calendar-outline", route: "/module/appointments" },
  production: { labelKey: "module.production", icon: "leaf-outline", route: "/module/production" },
  projects: { labelKey: "module.projects", icon: "layers-outline", route: "/module/projects" },
  ai: { labelKey: "module.ai", icon: "sparkles-outline", route: "/module/ai" },
  users: { labelKey: "module.users", icon: "people-circle-outline", route: "/module/users" },
  reports: { labelKey: "module.reports", icon: "bar-chart-outline", route: "/module/reports" },
  settings: { labelKey: "module.settings", icon: "settings-outline", route: "/module/settings" },
};
