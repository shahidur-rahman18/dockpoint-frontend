import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  clearStoredAuth,
  getStoredAuth,
  loginWithMockCredentials,
  type LoginCredentials,
  type UserRole,
} from './authService';
import type { DoctorListItem } from '../types';

interface AuthContextValue {
  doctor: DoctorListItem | null;
  role: UserRole | null;
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(getStoredAuth);

  const login = useCallback(async (credentials: LoginCredentials, role: UserRole) => {
    const authenticatedSession = loginWithMockCredentials(role, credentials);
    setSession(authenticatedSession);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ doctor: session?.doctor ?? null, role: session?.role ?? null, login, logout }}
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
