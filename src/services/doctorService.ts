import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { components, operations } from '../types/schema';
import type { DoctorListItem } from '../types';

type AdminDoctorCreate = components['schemas']['AdminDoctorCreate'];
type DoctorProfile = components['schemas']['DoctorProfile'];
type PatchedDoctorProfile = components['schemas']['PatchedDoctorProfile'];
export type DoctorListQuery = NonNullable<operations['doctors_list']['parameters']['query']>;

const getDoctorAvatarUrl = (userDetails: unknown): string => {
  if (!userDetails || typeof userDetails !== 'object' || !('avatar_url' in userDetails)) {
    return '';
  }

  const avatarUrl = userDetails.avatar_url;
  return typeof avatarUrl === 'string' ? avatarUrl.trim() : '';
};

export const mapDoctorProfileToListItem = (doctor: DoctorProfile): DoctorListItem => {
  const firstName = doctor.user_details.first_name?.trim() ?? '';
  const lastName = doctor.user_details.last_name?.trim() ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const specialization = doctor.specialization?.trim() ?? '';

  return {
    id: String(doctor.id),
    name: fullName ? `Dr. ${fullName}` : 'Name not provided',
    designation: doctor.qualification?.trim() || specialization || '—',
    department: specialization || '—',
    phone: doctor.user_details.phone_number?.trim() || '—',
    email: doctor.user_details.email,
    fees: doctor.consultation_fee ?? '—',
    status: doctor.is_available ? 'Available' : 'Unavailable',
    avatar: getDoctorAvatarUrl(doctor.user_details),
    chamberAddress: doctor.chamber_address?.trim() || '—',
  };
};

export const getDoctors = async (query?: DoctorListQuery): Promise<DoctorListItem[]> => {
  const { data } = await apiClient.get<DoctorProfile[]>('/api/doctors/', {
    params: query,
  });

  return data.map(mapDoctorProfileToListItem);
};

export const updateDoctorAvailability = async (
  doctorId: string,
  isAvailable: boolean,
): Promise<DoctorProfile> => {
  const payload: Pick<PatchedDoctorProfile, 'is_available'> = {
    is_available: isAvailable,
  };
  const { data } = await apiClient.patch<DoctorProfile>(
    `/api/doctors/${doctorId}/`,
    payload,
  );

  return data;
};

export const getDoctorListErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Unable to load doctors. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const data: unknown = error.response.data;

  if (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string') {
    return data.detail;
  }

  return `Unable to load doctors (HTTP ${error.response.status}). Please try again.`;
};

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
