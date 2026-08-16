"use client";

import { useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";
import { ClientDto } from "../services/client.service";

export default function NewClientForm({
  onSubmit,
}: {
  onSubmit: (client: ClientDto) => Promise<void>;
}) {
  const { locale, t } = useI18n();
  const tf = (value: string) => translateFixedLabel(value, locale);
  const [client, setClient] = useState<ClientDto>({
    name: "",
    email: "",
    country: "",
    status: "Prospect",
    revenue: 0,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(client);

    setClient({
      name: "",
      email: "",
      country: "",
      status: "Prospect",
      revenue: 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-5 gap-3">
      <input
        placeholder={t("common.name")}
        value={client.name}
        onChange={(e) => setClient({ ...client, name: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder={t("profile.email")}
        type="email"
        value={client.email}
        onChange={(e) => setClient({ ...client, email: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder={t("crm.country")}
        value={client.country}
        onChange={(e) => setClient({ ...client, country: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <select
        value={client.status}
        onChange={(e) => setClient({ ...client, status: e.target.value })}
        className="rounded-xl border px-4 py-3"
      >
        <option value="Prospect">{tf("Prospect")}</option>
        <option value="Actif">{tf("Actif")}</option>
        <option value="En attente">{tf("En attente")}</option>
      </select>

      <input
        placeholder="CA"
        type="number"
        value={client.revenue}
        onChange={(e) =>
          setClient({ ...client, revenue: Number(e.target.value) })
        }
        className="rounded-xl border px-4 py-3"
      />

      <button className="col-span-5 rounded-xl bg-action px-6 py-3 font-semibold text-white">
        {t("crm.saveClient")}
      </button>
    </form>
  );
}
