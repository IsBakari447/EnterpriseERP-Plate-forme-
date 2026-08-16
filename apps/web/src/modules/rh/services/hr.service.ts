import { apiClient } from "@shared/api/client";
import { employees as fallbackEmployees, rhKpis as fallbackKpis } from "../data";

export type HrKpi = {
  label: string;
  value: string;
  change?: string;
};

export type Employee = {
  name: string;
  role: string;
  contract: string;
  status: string;
};

async function getOrFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(path);
    return data;
  } catch {
    return fallback;
  }
}

export const hrService = {
  getKpis() {
    return getOrFallback<HrKpi[]>("/hr/kpis", fallbackKpis);
  },

  getEmployees() {
    return getOrFallback<Employee[]>("/hr/employees", fallbackEmployees);
  },
};
