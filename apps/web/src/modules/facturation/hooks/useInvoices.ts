"use client";

import { useEffect, useState } from "react";
import { invoiceService, InvoiceDto } from "../services/invoice.service";

export function useInvoices() {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInvoices() {
    try {
      setLoading(true);
      setError("");
      const data = await invoiceService.findAll();
      setInvoices(data);
    } catch {
      setError("Impossible de charger les factures. Vérifiez que l’API est lancée.");
    } finally {
      setLoading(false);
    }
  }

  async function createInvoice(invoice: InvoiceDto) {
    await invoiceService.create(invoice);
    await loadInvoices();
  }

  async function deleteInvoice(id?: string) {
    if (!id) return;
    await invoiceService.remove(id);
    await loadInvoices();
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    createInvoice,
    deleteInvoice,
    reload: loadInvoices,
  };
}
