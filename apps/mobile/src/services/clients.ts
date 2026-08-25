import { api } from "@/services/api";

export type Client = {
  id: string;
  name: string;
  email?: string | null;
  country?: string | null;
  status?: string | null;
  revenue?: number | string | null;
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
