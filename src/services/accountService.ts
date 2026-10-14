import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { AuthTokens } from '../auth/authService';
import type { components } from '../types/schema';

type PasswordSetupPayload = components['schemas']['PasswordSetup'];
type UserProfile = components['schemas']['UserProfile'];
type PatchedUserProfile = components['schemas']['PatchedUserProfile'];
type DoctorProfile = components['schemas']['DoctorProfile'];
type PatchedDoctorProfile = components['schemas']['PatchedDoctorProfile'];

export type MyAccountProfile = UserProfile & { avatar_url: string | null };

export interface DoctorSettingsProfile {
  account: MyAccountProfile;
  doctor: DoctorProfile;
}

export interface DoctorSettingsUpdate {
  account: Pick<PatchedUserProfile, 'first_name' | 'last_name' | 'phone_number'>;
  doctor: Pick<
    PatchedDoctorProfile,
    'specialization' | 'qualification' | 'consultation_fee' | 'chamber_address'
  >;
}

export const getMyAccountProfile = async (): Promise<MyAccountProfile> => {
  const { data } = await apiClient.get<MyAccountProfile>('/api/accounts/me/');
  return data;
};

export const getDoctorProfile = async (doctorId: number): Promise<DoctorProfile> => {
  const { data: doctor } = await apiClient.get<DoctorProfile>(
    `/api/doctors/${doctorId}/`,
  );

  return doctor;
};

export const updateMyAvatar = async (image: File | null): Promise<void> => {
  if (image === null) {
    await apiClient.patch<MyAccountProfile>('/api/accounts/me/', { avatar: null });
    return;
  }

  const formData = new FormData();
  formData.append('avatar', image);
  await apiClient.patch<MyAccountProfile>('/api/accounts/me/', formData);
};

export const updateDoctorSettingsProfile = async (
  doctorId: number,
  update: DoctorSettingsUpdate,
): Promise<void> => {
  const requests: Promise<unknown>[] = [];

  if (Object.keys(update.account).length > 0) {
    requests.push(apiClient.patch<UserProfile>('/api/accounts/me/', update.account));
  }

  if (Object.keys(update.doctor).length > 0) {
    requests.push(apiClient.patch<DoctorProfile>(`/api/doctors/${doctorId}/`, update.doctor));
  }

  await Promise.all(requests);
};

export const getProfileApiErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Unable to load your profile. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const data: unknown = error.response.data;

  if (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string') {
    return data.detail;
  }

  if (data && typeof data === 'object') {
    for (const value of Object.values(data)) {
      if (typeof value === 'string') {
        return value;
      }

      if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
      }
    }
  }

  return `The server could not process the profile request (HTTP ${error.response.status}). Please try again.`;
};

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
