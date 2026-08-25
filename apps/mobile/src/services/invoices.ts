import { api } from "@/services/api";

export type Invoice = {
  id: string;
  number: string;
  customer: string;
  amount?: number | string | null;
  due?: string | null;
  status?: string | null;
};

type InvoicesEnvelope = {
  invoices?: Invoice[];
  data?: Invoice[];
};

export async function getInvoices(): Promise<Invoice[]> {
  const response = await api<Invoice[] | InvoicesEnvelope>("/api/invoices");

  if (Array.isArray(response)) {
    return response;
  }

  return response.invoices ?? response.data ?? [];
}
