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
  loginWithApi,
  type LoginCredentials,
  type UserRole,
} from './authService';
import { apiClient } from '../api/apiClient';

interface AuthContextValue {
  email: string | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
  establishSession: (expectedRole: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{
    role: UserRole;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // অ্যাপ লোড বা রিফ্রেশ হওয়ার সাথে সাথে কুকি চেক করে সেশন রিস্টোর করা
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userSession = await fetchUserSession();
        setSession(userSession);
      } catch {
        // ইউজার লগইন করা না থাকলে সাইলেন্টলি নাল সেট করা হবে
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
      const { session: authenticatedSession } = await loginWithApi(credentials, role);
      clearStoredAuth();
      setSession(authenticatedSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const establishSession = useCallback(async (expectedRole: UserRole) => {
    setIsLoading(true);
    try {
      const authenticatedSession = await fetchUserSession();
      if (authenticatedSession.role !== expectedRole) {
        throw new Error(`This account does not have the ${expectedRole} role.`);
      }
      setSession(authenticatedSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // ব্যাকএন্ডে লগআউট কল করে কুকি ক্লিয়ার করা
      await apiClient.post('/accounts/logout/');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredAuth();
      setSession(null);
    }
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