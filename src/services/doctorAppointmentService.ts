import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { components } from '../types/schema';

export type Appointment = components['schemas']['Appointment'] & {
  readonly patient_detail?: {
    readonly id: number;
    readonly email: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly avatar_url: string | null;
  };
};

export const getDoctorAppointments = async (doctorId: number): Promise<Appointment[]> => {
  const { data } = await apiClient.get<Appointment[]>('/appointments/');
  return data.filter((appointment) => appointment.doctor === doctorId);
};

export const getDoctorAppointmentsErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : 'Unable to load appointments. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const data: unknown = error.response.data;
  if (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string') {
    return data.detail;
  }

  return `Unable to load appointments (HTTP ${error.response.status}). Please try again.`;
};
