export type AuthUser = {
  id: string;
  companyId?: string | null;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  language?: string;
  timezone?: string;
  theme?: string;
  displayCurrency?: string;
  mfaEnabled?: boolean;
  mfaEnabledAt?: string | null;
  role: string;
  status: string;
  company?: {
    id: string;
    name: string;
    sector: string;
    businessType?: string | null;
    enabledModules?: string[];
    country?: string | null;
    language: string;
    currency: string;
    timezone?: string;
    dateFormat?: string;
    numberFormat?: string;
    onboardingCompleted?: boolean;
    onboardingCompletedAt?: string | null;
  } | null;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: string;
  companyId?: string | null;
  sector?: string | null;
  onboardingCompleted?: boolean;
  role?: string;
  permissions?: string[];
  user: AuthUser;
};

const STORAGE_KEY = "enterpriseerp-cloud.auth";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function clearLegacyLocalStorage() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in strict privacy modes.
  }
}

export const tokenStorage = {
  get(): AuthSession | null {
    if (!canUseStorage()) return null;
    clearLegacyLocalStorage();

    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as AuthSession;
      const { refreshToken, ...safeSession } = session;
      return safeSession;
    } catch {
      return null;
    }
  },

  set(session: AuthSession) {
    if (!canUseStorage()) return;
    clearLegacyLocalStorage();
    const { refreshToken, ...safeSession } = session;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(safeSession));
  },

  clear() {
    if (!canUseStorage()) return;
    window.sessionStorage.removeItem(STORAGE_KEY);
    clearLegacyLocalStorage();
  },

  getAccessToken() {
    return this.get()?.accessToken ?? null;
  },

};
