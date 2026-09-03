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
  refreshToken: string;
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
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export const tokenStorage = {
  get(): AuthSession | null {
    if (!canUseStorage()) return null;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  },

  set(session: AuthSession) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  clear() {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(STORAGE_KEY);
  },

  getAccessToken() {
    return this.get()?.accessToken ?? null;
  },

  getRefreshToken() {
    return this.get()?.refreshToken ?? null;
  },
};
