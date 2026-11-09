import axios from 'axios';
import { apiClient } from '../api/apiClient';
import type { components } from '../types/schema';

export type DoctorSchedule = components['schemas']['DoctorSchedule'];
export const scheduleDays = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const satisfies readonly (keyof DoctorSchedule['weekly_schedule'])[];
export type ScheduleDay = (typeof scheduleDays)[number];
export type DoctorScheduleSlot =
  DoctorSchedule['weekly_schedule'][ScheduleDay][number];

export type DoctorScheduleUpdate = Omit<DoctorSchedule, 'effective_from'> & {
  effective_from: string;
};

const doctorScheduleEndpoint = '/doctors/me/schedule/';

export const getDoctorSchedule = async (): Promise<DoctorSchedule> => {
  const { data } = await apiClient.get<DoctorSchedule>(doctorScheduleEndpoint);
  return data;
};

export const updateDoctorSchedule = async (
  schedule: DoctorScheduleUpdate,
): Promise<DoctorSchedule> => {
  const { data } = await apiClient.put<DoctorSchedule>(
    doctorScheduleEndpoint,
    schedule,
  );
  return data;
};

const findApiErrorMessage = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = findApiErrorMessage(item);
      if (message) return message;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const [field, nestedValue] of Object.entries(value)) {
      const message = findApiErrorMessage(nestedValue);
      if (message) return `${field}: ${message}`;
    }
  }
  return null;
};

export const getDoctorScheduleErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : 'Unable to load your schedule. Please try again.';
  }

  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const responseData: unknown = error.response.data;
  if (responseData && typeof responseData === 'object') {
    if ('detail' in responseData && typeof responseData.detail === 'string') {
      return responseData.detail;
    }

    const message = findApiErrorMessage(responseData);
    if (message) return message;
  }

  return `The schedule request failed (HTTP ${error.response.status}). Please try again.`;
};
