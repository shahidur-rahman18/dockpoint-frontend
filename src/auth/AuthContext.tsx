import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  clearStoredAuth,
  fetchUserSession,
  getSessionWithAccessToken,
  loginWithApi,
  type AuthTokens,
  type LoginCredentials,
  type UserRole,
} from './authService';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './accessTokenStore';

interface AuthContextValue {
  email: string | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
  establishSession: (tokens: AuthTokens, expectedRole: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{
    role: UserRole;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (getAccessToken() || getRefreshToken()) {
          setSession(await fetchUserSession());
        }
      } catch {
        clearAuthTokens();
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials, role: UserRole) => {
    setIsLoading(true);
    try {
      const { session: authenticatedSession, tokens } = await loginWithApi(credentials, role);
      setAccessToken(tokens.access);
      setRefreshToken(tokens.refresh);
      clearStoredAuth();
      setSession(authenticatedSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const establishSession = useCallback(async (
    tokens: AuthTokens,
    expectedRole: UserRole,
  ) => {
    setIsLoading(true);
    try {
      const authenticatedSession = await getSessionWithAccessToken(tokens.access);
      if (authenticatedSession.role !== expectedRole) {
        throw new Error(`This account does not have the ${expectedRole} role.`);
      }
      setAccessToken(tokens.access);
      setRefreshToken(tokens.refresh);
      clearStoredAuth();
      setSession(authenticatedSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    clearStoredAuth();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        email: session?.email ?? null,
        role: session?.role ?? null,
        isLoading,
        login,
        establishSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}