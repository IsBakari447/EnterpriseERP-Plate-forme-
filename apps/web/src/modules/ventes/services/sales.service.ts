import { apiClient } from "@shared/api/client";
import { orders as fallbackOrders, ventesKpis as fallbackKpis } from "../data";

export type SalesKpi = {
  label: string;
  value: string;
  change?: string;
};

export type SalesOrder = {
  number: string;
  customer: string;
  amount: string;
  date: string;
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

export const salesService = {
  getKpis() {
    return getOrFallback<SalesKpi[]>("/sales/kpis", fallbackKpis);
  },

  getOrders() {
    return getOrFallback<SalesOrder[]>("/sales/orders", fallbackOrders);
  },
};
