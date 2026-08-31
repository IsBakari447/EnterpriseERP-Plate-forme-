import { apiClient } from "@shared/api/client";
import { invoices as fallbackInvoices } from "../data";

export type InvoiceDto = {
  id?: string;
  number: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
};

const STORAGE_KEY = "enterpriseerp-cloud.invoices";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseAmount(value: string | number) {
  return Number(String(value).replace(/[^\d.-]/g, "")) || 0;
}

function normalizeInvoice(invoice: InvoiceDto): InvoiceDto {
  return {
    ...invoice,
    id: invoice.id ?? invoice.number ?? createLocalId(),
    amount: Number(invoice.amount || 0),
  };
}

function getFallbackInvoices(): InvoiceDto[] {
  return fallbackInvoices.map((invoice) =>
    normalizeInvoice({
      id: invoice.number,
      number: invoice.number,
      customer: invoice.customer,
      amount: parseAmount(invoice.amount),
      due: invoice.due,
      status: invoice.status,
    })
  );
}

function readLocalInvoices(): InvoiceDto[] {
  if (!canUseStorage()) return getFallbackInvoices();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeInvoice);
    }
  } catch {
    return getFallbackInvoices();
  }

  return getFallbackInvoices();
}

function writeLocalInvoices(invoices: InvoiceDto[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices.map(normalizeInvoice)));
}

export const invoiceService = {
  async findAll(): Promise<InvoiceDto[]> {
    try {
      const { data } = await apiClient.get<InvoiceDto[]>("/invoices");
      if (Array.isArray(data)) {
        const invoices = data.map(normalizeInvoice);
        writeLocalInvoices(invoices);
        return invoices;
      }
    } catch {
      // Keep billing usable while auth/API setup is unavailable.
    }

    return readLocalInvoices();
  },

  async create(invoice: InvoiceDto): Promise<InvoiceDto> {
    const nextInvoice = normalizeInvoice(invoice);

    try {
      const { data } = await apiClient.post<InvoiceDto>("/invoices", nextInvoice);
      const savedInvoice = normalizeInvoice(data);
      const invoices = readLocalInvoices();
      writeLocalInvoices([savedInvoice, ...invoices.filter((item) => item.id !== savedInvoice.id)]);
      return savedInvoice;
    } catch {
      const invoices = readLocalInvoices();
      writeLocalInvoices([nextInvoice, ...invoices]);
      return nextInvoice;
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/invoices/${id}`);
    } catch {
      // Delete locally even when the remote API is unavailable.
    }

    writeLocalInvoices(readLocalInvoices().filter((invoice) => invoice.id !== id));
  },
};
