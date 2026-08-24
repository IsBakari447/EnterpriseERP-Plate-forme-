import { apiClient } from "@shared/api/client";
import type { CompanyDto } from "@modules/company/services/company.service";
import type { ModuleKey, SectorKey } from "@shared/sector/types";

export type OnboardingCompanyInput = {
  name: string;
};

export type OnboardingSettingsInput = {
  country: string;
  currency: string;
  language?: string;
};

export type OnboardingInviteInput = {
  emails: string[];
};

export const onboardingService = {
  async getOnboardingState(): Promise<CompanyDto> {
    const { data } = await apiClient.get<CompanyDto>("/company/current");
    return data;
  },

  async updateCompany(input: OnboardingCompanyInput): Promise<CompanyDto> {
    const { data } = await apiClient.patch<CompanyDto>("/company/current", input);
    return data;
  },

  async updateSector(sector: SectorKey): Promise<CompanyDto> {
    const { data } = await apiClient.patch<CompanyDto>("/company/current", { sector });
    return data;
  },

  async updateSettings(input: OnboardingSettingsInput): Promise<CompanyDto> {
    const { data } = await apiClient.patch<CompanyDto>("/company/current", input);
    return data;
  },

  async updateModules(enabledModules: ModuleKey[]): Promise<{ enabledModules: string[] }> {
    const { data } = await apiClient.patch<{ enabledModules: string[] }>("/company/current/modules", {
      enabledModules,
    });
    return data;
  },

  async inviteUsers(input: OnboardingInviteInput): Promise<{ queued: string[] }> {
    return { queued: input.emails };
  },

  async completeOnboarding(): Promise<CompanyDto> {
    const { data } = await apiClient.post<CompanyDto>("/company/current/complete-onboarding");
    return data;
  },
};
