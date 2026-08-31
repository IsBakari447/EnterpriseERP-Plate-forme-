import axios from "axios";
import { tokenStorage, type AuthSession } from "@shared/auth/token-storage";

function getDefaultApiUrl() {
  if (typeof window !== "undefined" && window.location.hostname.includes("enterpriseerp-web.onrender.com")) {
    return "https://enterpriseerp-api.onrender.com";
  }

  return "http://localhost:4000";
}

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || getDefaultApiUrl();
export const apiOriginUrl = configuredApiUrl.replace(/\/$/, "").endsWith("/api")
  ? configuredApiUrl.replace(/\/$/, "").slice(0, -4)
  : configuredApiUrl.replace(/\/$/, "");
const apiBaseUrl = `${apiOriginUrl}/api`;

const publicRoutePrefixes = [
  "/",
  "/cloud",
  "/commerce",
  "/construction",
  "/cookies",
  "/demo",
  "/dpa",
  "/education",
  "/faq",
  "/forgot-password",
  "/hotel",
  "/industrie",
  "/integrations",
  "/legal",
  "/login",
  "/pricing",
  "/privacy",
  "/register",
  "/reset-password",
  "/restaurant",
  "/roadmap",
  "/roi",
  "/sante",
  "/security",
  "/solutions",
  "/status",
  "/support",
  "/transport",
];

function isPublicRoute(pathname: string) {
  return publicRoutePrefixes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function redirectToLogin() {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;

  if (!isPublicRoute(currentPath)) {
    window.location.replace("/login?reason=session-expired");
  }
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !["/auth/login", "/auth/register", "/auth/refresh"].includes(String(originalRequest.url ?? ""))
    ) {
      originalRequest._retry = true;
      const refreshToken = tokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const { data } = await axios.post<AuthSession>(
            `${apiBaseUrl}/auth/refresh`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          tokenStorage.set(data);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch {
          tokenStorage.clear();
          redirectToLogin();
        }
      } else {
        tokenStorage.clear();
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);
