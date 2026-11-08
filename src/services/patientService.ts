import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { PatientListItem } from '../types';

interface PatientApiResponse {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  is_verified?: boolean;
  patient_profile?: {
    id: number;
    date_of_birth?: string | null;
    gender?: string;
    blood_group?: string;
    address?: string;
    emergency_contact?: string | null;
  } | null;
}

export const mapPatientToListItem = (patient: PatientApiResponse): PatientListItem => {
  const firstName = patient.first_name?.trim() ?? '';
  const lastName = patient.last_name?.trim() ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  return {
    id: String(patient.id),
    name: fullName || 'Name not provided',
    email: patient.email,
    phone: patient.phone_number?.trim() || '—',
    avatar: patient.avatar_url?.trim() || '',
    bloodGroup: patient.patient_profile?.blood_group || '—',
    gender: patient.patient_profile?.gender || '—',
    isVerified: patient.is_verified ?? false,
  };
};

export const getPatients = async (): Promise<PatientListItem[]> => {
  const { data } = await apiClient.get<PatientApiResponse[]>('/accounts/admin/patients/');
  return data.map(mapPatientToListItem);
};

export const getPatientListErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Unable to load patients. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const data: unknown = error.response.data;
  if (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string') {
    return data.detail;
  }

  return `Unable to load patients (HTTP ${error.response.status}). Please try again.`;
};
