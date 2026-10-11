import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { AuthTokens } from '../auth/authService';
import type { components } from '../types/schema';

type PasswordSetupPayload = components['schemas']['PasswordSetup'];

export const setupPassword = async (
  payload: PasswordSetupPayload,
): Promise<AuthTokens | null> => {
  const { data } = await apiClient.post<unknown>(
    '/api/accounts/setup-password/',
    payload,
  );

  if (data && typeof data === 'object' && 'access' in data && 'refresh' in data) {
    const access = data.access;
    const refresh = data.refresh;

    if (typeof access === 'string' && typeof refresh === 'string') {
      return { access, refresh };
    }
  }

  return null;
};

export const getPasswordSetupErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : 'Unable to set your password. Please try again.';
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

  return `Unable to set your password (HTTP ${error.response.status}). Please try again.`;
};
