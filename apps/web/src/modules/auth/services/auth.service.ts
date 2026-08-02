import { apiClient } from "@shared/api/client";
import { tokenStorage, type AuthSession, type AuthUser } from "@shared/auth/token-storage";

export type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterInput = {
  companyName: string;
  name: string;
  email: string;
  password: string;
  sector?: string;
  language?: string;
};

export const authService = {
  async login(input: LoginInput) {
    const { data } = await apiClient.post<AuthSession>("/auth/login", {
      ...input,
      deviceName: "EnterpriseERP Web",
    });
    tokenStorage.set(data);
    return data;
  },

  async register(input: RegisterInput) {
    const { data } = await apiClient.post<AuthSession>("/auth/register", input);
    tokenStorage.set(data);
    return data;
  },

  async me() {
    const { data } = await apiClient.get<AuthUser>("/auth/me");
    const session = tokenStorage.get();

    if (session) {
      tokenStorage.set({ ...session, user: data });
    }

    return data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },

  getSession() {
    return tokenStorage.get();
  },
};
