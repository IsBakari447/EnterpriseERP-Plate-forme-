"use client";

import { useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import ClientTable from "../components/ClientTable";
import NewClientForm from "../components/NewClientForm";
import EditClientForm from "../components/EditClientForm";
import { ClientDto } from "../services/client.service";
import { useClients } from "../hooks/useClients";

export default function CRMPage() {
  const { t } = useI18n();
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
      title={t("crm.title")}
      subtitle={t("crm.subtitle")}
      action={t("common.apiActive")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KPICard label={t("crm.registered")} value={String(clients.length)} />
        <KPICard
          label={t("crm.active")}
          value={String(clients.filter((client) => client.status === "Actif").length)}
        />
        <KPICard
          label={t("crm.prospects")}
          value={String(clients.filter((client) => client.status === "Prospect").length)}
        />
        <KPICard
          label={t("crm.revenue")}
          value={`${clients.reduce((sum, client) => sum + Number(client.revenue || 0), 0)} EUR`}
        />
      </section>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-night">
          {editingClient ? t("crm.edit") : t("crm.new")}
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
          <h2 className="text-xl font-bold text-night">{t("crm.list")}</h2>
          <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm">
            {t("common.refresh")}
          </button>
        </div>

        {loading ? (
          <p>{t("common.loading")}</p>
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
