import { apiClient } from "@shared/api/client";
import { parametresKpis as fallbackKpis } from "../data";

export type SettingsKpi = {
  labelKey: string;
  value: string;
  changeKey?: string;
};

export type SettingsSummary = {
  kpis: SettingsKpi[];
  security: {
    twoFactor: boolean;
    audit: boolean;
    backups: "daily" | "weekly" | string;
  };
};

const fallbackSummary: SettingsSummary = {
  kpis: fallbackKpis,
  security: {
    twoFactor: true,
    audit: true,
    backups: "daily",
  },
};

export const settingsService = {
  async getSummary(): Promise<SettingsSummary> {
    try {
      const { data } = await apiClient.get<SettingsSummary>("/settings/summary");
      return data;
    } catch {
      return fallbackSummary;
    }
  },
};
