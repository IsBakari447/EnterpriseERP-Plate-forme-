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
      setClients([]);
      setError("");
    } finally {
      setLoading(false);
    }
  }

  async function createClient(client: ClientDto) {
    try {
      await clientService.create(client);
      await loadClients();
    } catch {
      setError("");
    }
  }

  async function updateClient(id: string, client: Partial<ClientDto>) {
    try {
      await clientService.update(id, client);
      await loadClients();
    } catch {
      setError("");
    }
  }

  async function deleteClient(id?: string) {
    if (!id) return;

    try {
      await clientService.remove(id);
      await loadClients();
    } catch {
      setError("");
    }
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
