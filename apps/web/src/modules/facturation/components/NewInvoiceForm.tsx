"use client";

import { useState } from "react";
import { InvoiceDto } from "../services/invoice.service";

export default function NewInvoiceForm({
  onSubmit,
}: {
  onSubmit: (invoice: InvoiceDto) => Promise<void>;
}) {
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
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-5 gap-3">
      <input
        placeholder="N° facture"
        value={invoice.number}
        onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder="Client"
        value={invoice.customer}
        onChange={(e) => setInvoice({ ...invoice, customer: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder="Montant"
        type="number"
        value={invoice.amount}
        onChange={(e) => setInvoice({ ...invoice, amount: Number(e.target.value) })}
        className="rounded-xl border px-4 py-3"
      />

      <input
        placeholder="Échéance"
        type="date"
        value={invoice.due}
        onChange={(e) => setInvoice({ ...invoice, due: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <select
        value={invoice.status}
        onChange={(e) => setInvoice({ ...invoice, status: e.target.value })}
        className="rounded-xl border px-4 py-3"
      >
        <option>En attente</option>
        <option>Payée</option>
        <option>En retard</option>
      </select>

      <button className="col-span-5 rounded-xl bg-action px-6 py-3 font-semibold text-white">
        Enregistrer la facture
      </button>
    </form>
  );
}
