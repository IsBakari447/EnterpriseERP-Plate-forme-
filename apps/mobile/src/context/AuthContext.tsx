import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  hasSession,
  login,
  logout,
  me,
  register,
  type LoginCredentials,
  type CurrentUser,
  type RegisterPayload,
} from "@/services/auth";

type AuthContextValue = {
  authenticated: boolean;
  loading: boolean;
  user: CurrentUser | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    async function restoreSession() {
      const hasSavedSession = await hasSession();

      if (!hasSavedSession) {
        setAuthenticated(false);
        return;
      }

      try {
        const currentUser = await me();
        setUser(currentUser);
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
        setUser(null);
      }
    }

    restoreSession().finally(() => setLoading(false));
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    const response = await login(credentials);
    setUser(response.user ?? null);
    setAuthenticated(true);
  };

  const signUp = async (payload: RegisterPayload) => {
    const response = await register(payload);
    setUser(response.user ?? null);
    setAuthenticated(true);
  };

  const signOut = async () => {
    await logout();
    setAuthenticated(false);
    setUser(null);
  };

  const reloadUser = async () => {
    const currentUser = await me();
    setUser(currentUser);
  };

  const value = useMemo(
    () => ({
      authenticated,
      loading,
      user,
      signIn,
      signUp,
      signOut,
      reloadUser,
    }),
    [authenticated, loading, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }

  return value;
}
