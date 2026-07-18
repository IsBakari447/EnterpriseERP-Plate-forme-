import { apiClient } from "@shared/api/client";

export type ClientDto = {
  id?: string;
  name: string;
  email: string;
  country: string;
  status: string;
  revenue: number;
};

export const clientService = {
  async findAll(): Promise<ClientDto[]> {
    const { data } = await apiClient.get<ClientDto[]>("/clients");
    return data;
  },

  async create(client: ClientDto): Promise<ClientDto> {
    const { data } = await apiClient.post<ClientDto>("/clients", client);
    return data;
  },

  async update(id: string, client: Partial<ClientDto>): Promise<ClientDto> {
    const { data } = await apiClient.put<ClientDto>(`/clients/${id}`, client);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/clients/${id}`);
  },
};
