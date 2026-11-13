import axios from 'axios';
import { apiClient } from '../api/apiClient';

export interface PatientApiResponse {
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
    profile_complete?: boolean;
    missing_fields?: string[];
  } | null;
}

export interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bloodGroup: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  isVerified: boolean;
  profileComplete: boolean;
  missingFields: string[];
}

export const mapPatientToRecord = (patient: PatientApiResponse): PatientRecord => {
  const firstName = patient.first_name?.trim() ?? '';
  const lastName = patient.last_name?.trim() ?? '';

  return {
    id: String(patient.id),
    name: [firstName, lastName].filter(Boolean).join(' ') || 'Name not provided',
    email: patient.email,
    phone: patient.phone_number?.trim() || '—',
    avatar: patient.avatar_url?.trim() || '',
    bloodGroup: patient.patient_profile?.blood_group || '—',
    gender: patient.patient_profile?.gender
      ? patient.patient_profile.gender.charAt(0) +
        patient.patient_profile.gender.slice(1).toLowerCase()
      : '—',
    dateOfBirth: patient.patient_profile?.date_of_birth || '—',
    address: patient.patient_profile?.address?.trim() || '—',
    emergencyContact: patient.patient_profile?.emergency_contact?.trim() || '—',
    isVerified: patient.is_verified ?? false,
    profileComplete: patient.patient_profile?.profile_complete ?? false,
    missingFields: patient.patient_profile?.missing_fields ?? [],
  };
};

export const getPatients = async (): Promise<PatientRecord[]> => {
  const { data } = await apiClient.get<PatientApiResponse[]>('/accounts/admin/patients/');
  return data.map(mapPatientToRecord);
};

export const getPatient = async (id: string): Promise<PatientRecord> => {
  const { data } = await apiClient.get<PatientApiResponse>(`/accounts/admin/patients/${id}/`);
  return mapPatientToRecord(data);
};

export const getPatientApiErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Unable to load patient data. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const data: unknown = error.response.data;
  if (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string') {
    return data.detail;
  }

  return `Unable to load patient data (HTTP ${error.response.status}). Please try again.`;
};
