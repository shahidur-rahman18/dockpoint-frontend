import { doctorsListData } from '../data/mockData';
import type { DoctorListItem } from '../types';

const DEMO_DOCTOR_EMAIL = 'mick@example.com';
const DEMO_DOCTOR_PASSWORD = 'Doctor123!';
const AUTH_STORAGE_KEY = 'dockpoint-demo-doctor-id';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

const findDoctorById = (id: string | null): DoctorListItem | null =>
  doctorsListData.find((doctor) => doctor.id === id) ?? null;

export const getStoredDoctor = (): DoctorListItem | null =>
  findDoctorById(
    localStorage.getItem(AUTH_STORAGE_KEY) ??
      sessionStorage.getItem(AUTH_STORAGE_KEY),
  );

export const loginWithMockCredentials = (
  credentials: LoginCredentials,
): DoctorListItem => {
  const doctor = doctorsListData.find(
    (item) => item.email.toLowerCase() === DEMO_DOCTOR_EMAIL,
  );

  if (
    !doctor ||
    credentials.email.trim().toLowerCase() !== DEMO_DOCTOR_EMAIL ||
    credentials.password !== DEMO_DOCTOR_PASSWORD
  ) {
    throw new Error('Email or password is incorrect.');
  }

  const targetStorage = credentials.rememberMe ? localStorage : sessionStorage;
  const otherStorage = credentials.rememberMe ? sessionStorage : localStorage;
  otherStorage.removeItem(AUTH_STORAGE_KEY);
  targetStorage.setItem(AUTH_STORAGE_KEY, doctor.id);

  return doctor;
};

export const clearStoredDoctor = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
};
