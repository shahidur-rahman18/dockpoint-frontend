import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { components } from '../types/schema';

export type UserRole = 'admin' | 'doctor';

export interface AuthSession {
  role: UserRole;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

const getApiErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const data: unknown = error.response.data;

  if (data && typeof data === 'object') {
    if ('detail' in data && typeof data.detail === 'string') {
      return data.detail;
    }

    for (const value of Object.values(data)) {
      if (typeof value === 'string') {
        return value;
      }

      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
    }
  }

  return `Sign in failed (HTTP ${error.response.status}). Please try again.`;
};

export const loginWithApi = async (
  credentials: LoginCredentials,
  expectedRole: UserRole,
): Promise<{ session: AuthSession; tokens: AuthTokens }> => {
  try {
    const { data: tokens } = await apiClient.post<
      AuthTokens,
      { data: AuthTokens },
      Pick<components['schemas']['TokenObtainPair'], 'email' | 'password'>
    >('/api/accounts/login/', {
      email: credentials.email.trim(),
      password: credentials.password,
    });

    const { data: profile } = await apiClient.get<components['schemas']['UserProfile']>(
      '/api/accounts/me/',
      { headers: { Authorization: `Bearer ${tokens.access}` } },
    );

    const role = profile.role === 'ADMIN'
      ? 'admin'
      : profile.role === 'DOCTOR'
        ? 'doctor'
        : null;

    if (!role) {
      throw new Error('This account role is not supported by this dashboard.');
    }

    if (role !== expectedRole) {
      throw new Error(`This account does not have the ${expectedRole} role.`);
    }

    return {
      session: { role, email: profile.email },
      tokens,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem('dockpoint-demo-doctor-id');
  sessionStorage.removeItem('dockpoint-demo-doctor-id');
  localStorage.removeItem('dockpoint-demo-role');
  sessionStorage.removeItem('dockpoint-demo-role');
};
