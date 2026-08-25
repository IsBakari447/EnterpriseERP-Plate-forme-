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

export type ModuleStatusMap = Partial<
  Record<ModuleKey, ApiModuleStatus>
>;

const apiToMobileModule: Record<string, ModuleKey | undefined> = {
  crm: "crm",
  stock: "stock",
  facturation: "facturation",
  ai: "assistant",
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
