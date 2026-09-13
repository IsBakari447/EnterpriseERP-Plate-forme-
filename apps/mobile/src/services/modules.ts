import { api, endpoints } from "@/services/api";
import type { ModuleKey } from "@/types/sector";

export type ApiModuleStatus = "available" | "beta" | "planned";

type ApiModule = {
  key: string;
  name: string;
  status: ApiModuleStatus;
  value: string;
};

type ModulesResponse = {
  product: string;
  modules: ApiModule[];
};

type CompanyModulesResponse = {
  enabledModules: string[];
};

export type ModuleStatusMap = Partial<
  Record<ModuleKey, ApiModuleStatus>
>;

const apiToMobileModule: Record<string, ModuleKey | undefined> = {
  crm: "crm",
  clients: "crm",
  stock: "stock",
  inventory: "stock",
  products: "stock",
  facturation: "facturation",
  invoices: "facturation",
  billing: "facturation",
  sales: "ventes",
  hr: "rh",
  finance: "comptabilite",
  accounting: "comptabilite",
  reports: "rapports",
  appointments: "rendez-vous",
  reservations: "rendez-vous",
  production: "production",
  ai: "assistant",
  assistant: "assistant",
};

export async function getModuleStatuses(): Promise<ModuleStatusMap> {
  const response = await api<ModulesResponse>(endpoints.modules);

  return response.modules.reduce<ModuleStatusMap>((result, module) => {
    const mobileKey = apiToMobileModule[module.key];

    if (mobileKey) {
      result[mobileKey] = module.status;
    }

    return result;
  }, {});
}

export async function getCompanyEnabledModules(): Promise<ModuleKey[]> {
  const response = await api<CompanyModulesResponse>(endpoints.companyModules);

  return Array.from(
    new Set(
      response.enabledModules
        .map((module) => apiToMobileModule[module] ?? (module as ModuleKey))
        .filter(Boolean),
    ),
  );
}
