import { api } from "@/services/api";

export type Client = {
  id: string;
  name: string;
  email?: string | null;
  country?: string | null;
  status?: string | null;
  revenue?: number | string | null;
};

export type ClientInput = {
  name: string;
  email: string;
  country: string;
  status: string;
  revenue?: number;
};

type ClientsEnvelope = {
  clients?: Client[];
  data?: Client[];
};

export async function getClients(): Promise<Client[]> {
  const response = await api<Client[] | ClientsEnvelope>("/api/clients");

  if (Array.isArray(response)) {
    return response;
  }

  return response.clients ?? response.data ?? [];
}

export async function createClient(payload: ClientInput): Promise<Client> {
  return api<Client>("/api/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
