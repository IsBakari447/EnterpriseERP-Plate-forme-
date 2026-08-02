import { apiClient } from "@shared/api/client";

export type ClientDto = {
  id?: string;
  name: string;
  email: string;
  country: string;
  status: string;
  revenue: number;
};

const STORAGE_KEY = "enterpriseerp-cloud.clients";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readLocalClients(): ClientDto[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalClients(clients: ClientDto[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeClient(client: ClientDto): ClientDto {
  return {
    ...client,
    id: client.id ?? createLocalId(),
    revenue: Number(client.revenue || 0),
  };
}

export const clientService = {
  async findAll(): Promise<ClientDto[]> {
    try {
      const { data } = await apiClient.get<ClientDto[]>("/clients");
      if (Array.isArray(data)) {
        const clients = data.map(normalizeClient);
        writeLocalClients(clients);
        return clients;
      }
    } catch {
      // Local mode keeps the CRM usable when the API or database is unavailable.
    }

    return readLocalClients();
  },

  async create(client: ClientDto): Promise<ClientDto> {
    const nextClient = normalizeClient(client);

    try {
      const { data } = await apiClient.post<ClientDto>("/clients", nextClient);
      const savedClient = normalizeClient(data);
      const clients = readLocalClients();
      writeLocalClients([savedClient, ...clients.filter((item) => item.id !== savedClient.id)]);
      return savedClient;
    } catch {
      const clients = readLocalClients();
      writeLocalClients([nextClient, ...clients]);
      return nextClient;
    }
  },

  async update(id: string, client: Partial<ClientDto>): Promise<ClientDto> {
    const clients = readLocalClients();
    const existing = clients.find((item) => item.id === id);
    const updated = normalizeClient({
      name: "",
      email: "",
      country: "",
      status: "Prospect",
      revenue: 0,
      ...existing,
      ...client,
      id,
    });

    try {
      const { data } = await apiClient.put<ClientDto>(`/clients/${id}`, updated);
      const savedClient = normalizeClient(data);
      writeLocalClients(clients.map((item) => (item.id === id ? savedClient : item)));
      return savedClient;
    } catch {
      writeLocalClients(clients.map((item) => (item.id === id ? updated : item)));
      return updated;
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch {
      // Delete locally even when the remote API is unavailable.
    }

    writeLocalClients(readLocalClients().filter((client) => client.id !== id));
  },
};
