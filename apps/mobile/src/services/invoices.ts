import { api } from "@/services/api";

export type Invoice = {
  id: string;
  number: string;
  customer: string;
  amount?: number | string | null;
  due?: string | null;
  status?: string | null;
};

export type InvoiceInput = {
  number: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
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

export async function createInvoice(payload: InvoiceInput): Promise<Invoice> {
  return api<Invoice>("/api/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
