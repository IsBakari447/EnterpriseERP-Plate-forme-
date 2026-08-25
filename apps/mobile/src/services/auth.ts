import {
  api,
  clearTokens,
  endpoints,
  hasAccessToken,
  saveTokens,
} from "@/services/api";
import type { SectorKey } from "@/types/sector";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  companyName: string;
  name: string;
  email: string;
  password: string;
  sector: SectorKey | "commerce" | "sante" | "industrie";
  language: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  companyId?: string | null;
  company?: {
    id: string;
    name: string;
    sector?: string | null;
    language?: string | null;
    currency?: string | null;
  } | null;
};

export type LoginResponse = {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string | null;
    companyId?: string | null;
  } | CurrentUser;
};

async function persistSession(result: LoginResponse) {
  const token = result.accessToken ?? result.access_token;
  if (!token) throw new Error("NO_ACCESS_TOKEN");
  await saveTokens(token, result.refreshToken);
  return result;
}

export async function login(credentials: LoginCredentials) {
  const result = await api<LoginResponse>(endpoints.login, {
    method: "POST",
    body: JSON.stringify({
      ...credentials,
      rememberMe: true,
      deviceName: "EnterpriseERP Mobile",
    }),
  });

  return persistSession(result);
}

export async function register(payload: RegisterPayload) {
  const result = await api<LoginResponse>(endpoints.register, {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      deviceName: "EnterpriseERP Mobile",
    }),
  });

  return persistSession(result);
}

export async function me() {
  return api<CurrentUser>(endpoints.me);
}

export async function logout() {
  try {
    await api(endpoints.logout, { method: "POST" });
  } catch {
    // Local sign-out must still work when the device is offline.
  }

  await clearTokens();
}

export async function hasSession() {
  return hasAccessToken();
}
