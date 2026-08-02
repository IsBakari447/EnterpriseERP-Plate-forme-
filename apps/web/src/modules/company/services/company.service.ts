import { apiClient } from "@shared/api/client";
import type { SectorKey } from "@shared/sector/types";

export type CompanyDto = {
  id: string;
  name: string;
  sector: SectorKey;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
  currency: string;
  language: string;
  timezone: string;
};

export const companyService = {
  async getCurrent(): Promise<CompanyDto> {
    const { data } = await apiClient.get<CompanyDto>("/company");
    return data;
  },

  async update(
    values: Partial<CompanyDto>
  ): Promise<CompanyDto> {
    const { data } = await apiClient.put<CompanyDto>(
      "/company",
      values
    );

    return data;
  },
};
