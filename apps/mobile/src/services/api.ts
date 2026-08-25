import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const API_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  "https://enterpriseerp-api.onrender.com";

const ACCESS_TOKEN_KEY = "enterpriseerp.accessToken";
const REFRESH_TOKEN_KEY = "enterpriseerp.refreshToken";

export const endpoints = {
  health: "/health",
  readiness: "/health/ready",
  login: "/api/auth/login",
  register: "/api/auth/register",
  me: "/api/auth/me",
  refresh: "/api/auth/refresh",
  logout: "/api/auth/logout",
  modules: "/api/modules",
  platform: "/api/platform/foundation",
} as const;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

async function refreshAccessToken() {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_URL}${endpoints.refresh}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await clearTokens();
    return null;
  }

  const data = await parseResponse<{ accessToken?: string; refreshToken?: string }>(response);

  if (!data.accessToken) {
    await clearTokens();
    return null;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);

  if (data.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
  }

  return data.accessToken;
}

async function request<T>(path: string, init: RequestInit, token?: string | null) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const payload = await parseResponse<{ message?: string }>(response);
    throw new ApiError(response.status, payload.message ?? `API ${response.status}`);
  }

  return parseResponse<T>(response);
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  try {
    return await request<T>(path, init, token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const nextToken = await refreshAccessToken();

      if (nextToken) {
        return request<T>(path, init, nextToken);
      }
    }

    throw error;
  }
}

export async function checkApiHealth() {
  return api<{ status: string; service?: string }>(endpoints.health);
}

export async function saveTokens(accessToken: string, refreshToken?: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function hasAccessToken() {
  return Boolean(await SecureStore.getItemAsync(ACCESS_TOKEN_KEY));
}
