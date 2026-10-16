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

// কুকিভিত্তিক লগইন কল (এখানে /api/ বাদ দিয়ে শুধু /accounts/login/ দেওয়া হয়েছে)
export const loginWithApi = async (
  credentials: LoginCredentials,
  expectedRole: UserRole,
): Promise<{ session: AuthSession }> => {
  try {
    const { data } = await apiClient.post<{
      access?: string;
      refresh?: string;
    }>('/accounts/login/', {
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (data?.access) {
      localStorage.setItem('dockpoint_access_token', data.access);
    }
    if (data?.refresh) {
      localStorage.setItem('dockpoint_refresh_token', data.refresh);
    }

    // লগইন সফল হওয়ার পর কুকি বা হেডার টোকেন ব্যবহার করে ইউজারের প্রফাইল ও রোল ফেচ করা হচ্ছে
    const session = await fetchUserSession();

    if (session.role !== expectedRole) {
      throw new Error(`This account does not have the ${expectedRole} role.`);
    }

    return { session };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

// কুকি বা হেডার টোকেন স্বয়ংক্রিয়ভাবে পাঠিয়ে ইউজারের তথ্য নিয়ে আসা
export const fetchUserSession = async (): Promise<AuthSession> => {
  const { data: profile } = await apiClient.get<components['schemas']['UserProfile']>(
    '/accounts/me/'
  );

  const role = profile.role === 'ADMIN'
    ? 'admin'
    : profile.role === 'DOCTOR'
      ? 'doctor'
      : null;

  if (!role) {
    throw new Error('This account role is not supported by this dashboard.');
  }

  return { role, email: profile.email };
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem('dockpoint_access_token');
  localStorage.removeItem('dockpoint_refresh_token');
  localStorage.removeItem('dockpoint-demo-doctor-id');
  sessionStorage.removeItem('dockpoint-demo-doctor-id');
  localStorage.removeItem('dockpoint-demo-role');
  sessionStorage.removeItem('dockpoint-demo-role');
};