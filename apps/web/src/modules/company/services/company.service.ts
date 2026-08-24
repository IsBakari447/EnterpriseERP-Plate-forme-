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
  enabledModules: string[];
  onboardingCompleted: boolean;
  onboardingCompletedAt?: string | null;
};

export const companyService = {
  async getCurrent(): Promise<CompanyDto> {
    const { data } = await apiClient.get<CompanyDto>("/company/current");
    return data;
  },

  async update(
    values: Partial<CompanyDto>
  ): Promise<CompanyDto> {
    const { data } = await apiClient.patch<CompanyDto>(
      "/company/current",
      values
    );

    return data;
  },

  async updateModules(enabledModules: string[]) {
    const { data } = await apiClient.patch<{ enabledModules: string[] }>(
      "/company/current/modules",
      { enabledModules }
    );

    return data;
  },

  async completeOnboarding(): Promise<CompanyDto> {
    const { data } = await apiClient.post<CompanyDto>("/company/current/complete-onboarding");
    return data;
  },
};
