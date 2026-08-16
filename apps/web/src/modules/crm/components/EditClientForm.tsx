"use client";

import { useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { ClientDto } from "../services/client.service";

export default function EditClientForm({
  client,
  onCancel,
  onSubmit,
}: {
  client: ClientDto;
  onCancel: () => void;
  onSubmit: (id: string, client: Partial<ClientDto>) => Promise<void>;
}) {
  const { locale, t } = useI18n();
  const tf = (value: string) => translateFixedLabel(value, locale);
  const [form, setForm] = useState<ClientDto>(client);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.id) return;

    await onSubmit(form.id, {
      name: form.name,
      email: form.email,
      country: form.country,
      status: form.status,
      revenue: Number(form.revenue),
    });

    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-5 gap-3">
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        value={form.email}
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        className="rounded-xl border px-4 py-3"
      >
        <option value="Prospect">{tf("Prospect")}</option>
        <option value="Actif">{tf("Actif")}</option>
        <option value="En attente">{tf("En attente")}</option>
      </select>

      <input
        type="number"
        value={form.revenue}
        onChange={(e) => setForm({ ...form, revenue: Number(e.target.value) })}
        className="rounded-xl border px-4 py-3"
      />

      <div className="col-span-5 flex gap-3">
        <button className="rounded-xl bg-action px-6 py-3 font-semibold text-white">
          {t("profile.saveChanges")}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-6 py-3 font-semibold"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}
