"use client";

import { useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { InvoiceDto } from "../services/invoice.service";

export default function NewInvoiceForm({
  onSubmit,
}: {
  onSubmit: (invoice: InvoiceDto) => Promise<void>;
}) {
  const { locale } = useI18n();
  const tf = (value: string) => translateFixedLabel(value, locale);
  const [invoice, setInvoice] = useState<InvoiceDto>({
    number: "",
    customer: "",
    amount: 0,
    due: "",
    status: "En attente",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(invoice);

    setInvoice({
      number: "",
      customer: "",
      amount: 0,
      due: "",
      status: "En attente",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-3 lg:grid-cols-5">
      <input placeholder={tf("No facture")} value={invoice.number} onChange={(e) => setInvoice({ ...invoice, number: e.target.value })} className="rounded-xl border px-4 py-3" required />
      <input placeholder={tf("Client")} value={invoice.customer} onChange={(e) => setInvoice({ ...invoice, customer: e.target.value })} className="rounded-xl border px-4 py-3" required />
      <input placeholder={tf("Montant")} type="number" value={invoice.amount} onChange={(e) => setInvoice({ ...invoice, amount: Number(e.target.value) })} className="rounded-xl border px-4 py-3" />
      <input placeholder={tf("Echeance")} type="date" value={invoice.due} onChange={(e) => setInvoice({ ...invoice, due: e.target.value })} className="rounded-xl border px-4 py-3" required />
      <select value={invoice.status} onChange={(e) => setInvoice({ ...invoice, status: e.target.value })} className="rounded-xl border px-4 py-3">
        <option value="En attente">{tf("En attente")}</option>
        <option value="Payee">{tf("Payee")}</option>
        <option value="En retard">{tf("En retard")}</option>
      </select>
      <button className="rounded-xl bg-action px-6 py-3 font-semibold text-white lg:col-span-5">
        {tf("Enregistrer la facture")}
      </button>
    </form>
  );
}
