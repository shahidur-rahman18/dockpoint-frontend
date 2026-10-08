import { doctorsListData } from '../data/mockData';
import type { DoctorListItem } from '../types';

export type UserRole = 'admin' | 'doctor';

export interface AuthSession {
  role: UserRole;
  doctor: DoctorListItem | null;
}

const DEMO_ADMIN_EMAIL = 'admin@example.com';
const DEMO_ADMIN_PASSWORD = 'Admin123!';
const DEMO_DOCTOR_EMAIL = 'mick@example.com';
const DEMO_DOCTOR_PASSWORD = 'Doctor123!';
const DOCTOR_STORAGE_KEY = 'dockpoint-demo-doctor-id';
const ROLE_STORAGE_KEY = 'dockpoint-demo-role';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

const findDoctorById = (id: string | null): DoctorListItem | null =>
  doctorsListData.find((doctor) => doctor.id === id) ?? null;

export const getStoredAuth = (): AuthSession | null => {
  const storedRole =
    localStorage.getItem(ROLE_STORAGE_KEY) ??
    sessionStorage.getItem(ROLE_STORAGE_KEY);
  const storedDoctorId =
    localStorage.getItem(DOCTOR_STORAGE_KEY) ??
    sessionStorage.getItem(DOCTOR_STORAGE_KEY);

  if (storedRole === 'admin') {
    return { role: 'admin', doctor: null };
  }

  if (storedRole === 'doctor' || (!storedRole && storedDoctorId)) {
    const doctor = findDoctorById(storedDoctorId);
    return doctor ? { role: 'doctor', doctor } : null;
  }

  return null;
};

export const loginWithMockCredentials = (
  role: UserRole,
  credentials: LoginCredentials,
): AuthSession => {
  const email = credentials.email.trim().toLowerCase();
  const passwordIsValid =
    role === 'admin'
      ? email === DEMO_ADMIN_EMAIL && credentials.password === DEMO_ADMIN_PASSWORD
      : email === DEMO_DOCTOR_EMAIL && credentials.password === DEMO_DOCTOR_PASSWORD;

  if (!passwordIsValid) {
    throw new Error('Email or password is incorrect.');
  }

  const doctor =
    role === 'doctor'
      ? doctorsListData.find(
          (item) => item.email.toLowerCase() === DEMO_DOCTOR_EMAIL,
        ) ?? null
      : null;

  if (role === 'doctor' && !doctor) {
    throw new Error('The demo doctor account could not be found.');
  }

  const targetStorage = credentials.rememberMe ? localStorage : sessionStorage;
  const otherStorage = credentials.rememberMe ? sessionStorage : localStorage;
  otherStorage.removeItem(DOCTOR_STORAGE_KEY);
  otherStorage.removeItem(ROLE_STORAGE_KEY);
  targetStorage.removeItem(DOCTOR_STORAGE_KEY);
  targetStorage.setItem(ROLE_STORAGE_KEY, role);

  if (doctor) {
    targetStorage.setItem(DOCTOR_STORAGE_KEY, doctor.id);
  }

  return { role, doctor };
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(DOCTOR_STORAGE_KEY);
  sessionStorage.removeItem(DOCTOR_STORAGE_KEY);
  localStorage.removeItem(ROLE_STORAGE_KEY);
  sessionStorage.removeItem(ROLE_STORAGE_KEY);
};
