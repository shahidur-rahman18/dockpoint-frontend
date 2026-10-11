import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  clearStoredAuth,
  loginWithApi,
  type LoginCredentials,
  type UserRole,
} from './authService';
import {
  clearAuthTokens,
  getAccessToken,
  setAccessToken as storeAccessToken,
  setRefreshToken,
} from './accessTokenStore';

interface AuthContextValue {
  email: string | null;
  role: UserRole | null;
  accessToken: string | null;
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{
    role: UserRole;
    email: string;
  } | null>(null);
  const [accessToken, setAccessTokenState] = useState(getAccessToken);

  const setToken = useCallback((token: string | null) => {
    storeAccessToken(token);
    setAccessTokenState(token);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials, role: UserRole) => {
    clearAuthTokens();
    setAccessTokenState(null);
    const { session: authenticatedSession, tokens } = await loginWithApi(credentials, role);
    storeAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);
    setAccessTokenState(tokens.access);
    clearStoredAuth();
    setSession(authenticatedSession);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    clearAuthTokens();
    setAccessTokenState(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        email: session?.email ?? null,
        role: session?.role ?? null,
        accessToken,
        login,
        setAccessToken: setToken,
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
