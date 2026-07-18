"use client";

import { useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import ClientTable from "../components/ClientTable";
import NewClientForm from "../components/NewClientForm";
import EditClientForm from "../components/EditClientForm";
import { ClientDto } from "../services/client.service";
import { useClients } from "../hooks/useClients";

export default function CRMPage() {
  const {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    reload,
  } = useClients();

  const [editingClient, setEditingClient] = useState<ClientDto | null>(null);

  return (
    <ERPLayout
      title="CRM Clients"
      subtitle="Gérez vos clients, prospects et partenaires."
      action="API PostgreSQL active"
    >
      <section className="grid grid-cols-4 gap-5">
        <KPICard label="Clients enregistrés" value={String(clients.length)} />
        <KPICard label="Clients actifs" value={String(clients.filter((c) => c.status === "Actif").length)} />
        <KPICard label="Prospects" value={String(clients.filter((c) => c.status === "Prospect").length)} />
        <KPICard label="CA total" value={`${clients.reduce((sum, c) => sum + Number(c.revenue || 0), 0)} €`} />
      </section>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-night">
          {editingClient ? "Modifier le client" : "Nouveau client"}
        </h2>

        {editingClient ? (
          <EditClientForm
            client={editingClient}
            onCancel={() => setEditingClient(null)}
            onSubmit={updateClient}
          />
        ) : (
          <NewClientForm onSubmit={createClient} />
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-night">Liste des clients</h2>
          <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm">
            Actualiser
          </button>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <ClientTable
            clients={clients}
            onEdit={setEditingClient}
            onDelete={deleteClient}
          />
        )}
      </section>
    </ERPLayout>
  );
}
