import { apiClient } from "@shared/api/client";
import { tokenStorage, type AuthSession, type AuthUser } from "@shared/auth/token-storage";

export type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type MfaRequiredResponse = {
  mfaRequired: true;
  challengeId: string;
  expiresIn: number;
  message: string;
};

export type RegisterInput = {
  companyName: string;
  name: string;
  email: string;
  password: string;
  sector?: string;
  language?: string;
};

export type RegisterResponse =
  | AuthSession
  | {
      requiresEmailVerification: true;
      message: string;
      email: string;
      verificationToken?: string;
      verificationUrl?: string;
    };

export type MfaSetupResponse = {
  issuer: string;
  label: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
  expiresIn: number;
};

export type MfaRecoveryResponse = {
  enabled: boolean;
  recoveryCodes: string[];
};

export const authService = {
  async login(input: LoginInput) {
    const { data } = await apiClient.post<AuthSession | MfaRequiredResponse>("/auth/login", {
      ...input,
      deviceName: "EnterpriseERP Web",
    });
    if ("accessToken" in data) {
      tokenStorage.set(data);
    }
    return data;
  },

  async completeMfaChallenge(input: { challengeId: string; code?: string; recoveryCode?: string }) {
    const { data } = await apiClient.post<AuthSession>("/auth/mfa/challenge", input);
    tokenStorage.set(data);
    return data;
  },

  async setupMfa(password: string) {
    const { data } = await apiClient.post<MfaSetupResponse>("/auth/mfa/setup", { password });
    return data;
  },

  async verifyMfaSetup(code: string) {
    const { data } = await apiClient.post<MfaRecoveryResponse>("/auth/mfa/verify", { code });
    return data;
  },

  async disableMfa(input: { password: string; code?: string; recoveryCode?: string }) {
    const { data } = await apiClient.post<{ enabled: false }>("/auth/mfa/disable", input);
    return data;
  },

  async regenerateMfaRecoveryCodes(code: string) {
    const { data } = await apiClient.post<{ recoveryCodes: string[] }>("/auth/mfa/recovery", { code });
    return data;
  },

  async register(input: RegisterInput) {
    const { data } = await apiClient.post<RegisterResponse>("/auth/register", input);
    if ("accessToken" in data) {
      tokenStorage.set(data);
    }
    return data;
  },

  async me() {
    const { data } = await apiClient.get<AuthUser>("/auth/me");
    const session = tokenStorage.get();

    if (session) {
      tokenStorage.set({
        ...session,
        companyId: data.companyId,
        sector: data.company?.sector ?? session.sector,
        onboardingCompleted: data.company?.onboardingCompleted ?? session.onboardingCompleted,
        role: data.role,
        user: data,
      });
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
