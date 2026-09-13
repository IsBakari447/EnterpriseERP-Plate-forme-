import {
  api,
  clearTokens,
  endpoints,
  hasAccessToken,
  saveTokens,
} from "@/services/api";

export type LoginCredentials = {
  email: string;
  password: string;
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
    businessType?: string | null;
    language?: string | null;
    country?: string | null;
    currency?: string | null;
    timezone?: string | null;
    enabledModules?: string[] | null;
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
