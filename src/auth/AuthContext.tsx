import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  clearStoredDoctor,
  getStoredDoctor,
  loginWithMockCredentials,
  type LoginCredentials,
} from './authService';
import type { DoctorListItem } from '../types';

interface AuthContextValue {
  doctor: DoctorListItem | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<DoctorListItem | null>(getStoredDoctor);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const authenticatedDoctor = loginWithMockCredentials(credentials);
    setDoctor(authenticatedDoctor);
  }, []);

  const logout = useCallback(() => {
    clearStoredDoctor();
    setDoctor(null);
  }, []);

  return (
    <AuthContext.Provider value={{ doctor, login, logout }}>
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
