"use client";

import { useState } from "react";
import { ClientDto } from "../services/client.service";

export default function NewClientForm({
  onSubmit,
}: {
  onSubmit: (client: ClientDto) => Promise<void>;
}) {
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
        placeholder="Nom"
        value={client.name}
        onChange={(e) => setClient({ ...client, name: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder="Email"
        type="email"
        value={client.email}
        onChange={(e) => setClient({ ...client, email: e.target.value })}
        className="rounded-xl border px-4 py-3"
        required
      />

      <input
        placeholder="Pays"
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
        <option>Prospect</option>
        <option>Actif</option>
        <option>En attente</option>
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
        Enregistrer le client
      </button>
    </form>
  );
}
