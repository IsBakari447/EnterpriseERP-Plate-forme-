"use client";

import { useEffect, useState } from "react";
import { clientService, ClientDto } from "../services/client.service";

export function useClients() {
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClients() {
    try {
      setLoading(true);
      setError("");
      const data = await clientService.findAll();
      setClients(data);
    } catch {
      setError("Impossible de charger les clients. Vérifiez que l’API est lancée.");
    } finally {
      setLoading(false);
    }
  }

  async function createClient(client: ClientDto) {
    await clientService.create(client);
    await loadClients();
  }

  async function updateClient(id: string, client: Partial<ClientDto>) {
    await clientService.update(id, client);
    await loadClients();
  }

  async function deleteClient(id?: string) {
    if (!id) return;
    await clientService.remove(id);
    await loadClients();
  }

  useEffect(() => {
    loadClients();
  }, []);

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    reload: loadClients,
  };
}
