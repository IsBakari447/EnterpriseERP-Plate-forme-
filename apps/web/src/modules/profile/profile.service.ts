import { apiClient } from "@shared/api/client";

export type UserProfile = {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  avatarUrl?: string | null;
  language: string;
  timezone: string;
  theme: string;
  displayCurrency: string;
  notificationEmail: boolean;
  notificationErp: boolean;
  notificationImportant: boolean;
  signature?: string | null;
  role: string;
  status: string;
  lastLoginAt?: string | null;
  passwordChangedAt?: string | null;
  company?: {
    id: string;
    name: string;
    sector: string;
    businessType?: string | null;
    country?: string | null;
    currency: string;
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
  } | null;
};

export type UserSessionDto = {
  id: string;
  deviceName?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  rememberMe: boolean;
  revokedAt?: string | null;
  expiresAt: string;
  createdAt: string;
};

export const profileService = {
  async getProfile() {
    const { data } = await apiClient.get<UserProfile>("/profile");
    return data;
  },

  async updateProfile(input: Partial<UserProfile>) {
    const { data } = await apiClient.put<UserProfile>("/profile", input);
    return data;
  },

  async updateAvatar(avatarUrl: string) {
    const { data } = await apiClient.post<{ avatarUrl: string }>("/profile/avatar", { avatarUrl });
    return data;
  },

  async deleteAvatar() {
    const { data } = await apiClient.delete<{ avatarUrl: null }>("/profile/avatar");
    return data;
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const { data } = await apiClient.put<{ success: boolean }>("/profile/password", {
      currentPassword,
      newPassword,
    });
    return data;
  },

  async getSessions() {
    const { data } = await apiClient.get<UserSessionDto[]>("/profile/sessions");
    return data;
  },

  async revokeSession(id: string) {
    const { data } = await apiClient.delete<{ success: boolean }>(`/profile/sessions/${id}`);
    return data;
  },

  async logoutAll() {
    const { data } = await apiClient.post<{ success: boolean }>("/profile/logout-all");
    return data;
  },
};
