import { apiClient } from "@shared/api/client";

export type InvoiceDto = {
  id?: string;
  number: string;
  customer: string;
  amount: number;
  due: string;
  status: string;
};

export const invoiceService = {
  async findAll(): Promise<InvoiceDto[]> {
    const { data } = await apiClient.get<InvoiceDto[]>("/invoices");
    return data;
  },

  async create(invoice: InvoiceDto): Promise<InvoiceDto> {
    const { data } = await apiClient.post<InvoiceDto>("/invoices", invoice);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/invoices/${id}`);
  },
};
