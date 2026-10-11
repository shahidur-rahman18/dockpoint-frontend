import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { components } from '../types/schema';

type AdminDoctorCreate = components['schemas']['AdminDoctorCreate'];

export const createDoctor = async (payload: AdminDoctorCreate): Promise<AdminDoctorCreate> => {
  const { data } = await apiClient.post<AdminDoctorCreate>(
    '/api/accounts/admin/doctors/create/',
    payload,
  );

  return data;
};

export const getDoctorCreationErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Unable to create the doctor. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const data: unknown = error.response.data;

  if (data && typeof data === 'object') {
    if ('detail' in data && typeof data.detail === 'string') {
      return data.detail;
    }

    for (const [field, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        return `${field}: ${value}`;
      }

      if (Array.isArray(value) && typeof value[0] === 'string') {
        return `${field}: ${value[0]}`;
      }
    }
  }

  return `Unable to create the doctor (HTTP ${error.response.status}). Please try again.`;
};
