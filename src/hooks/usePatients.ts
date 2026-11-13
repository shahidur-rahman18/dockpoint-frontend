import { useQuery } from '@tanstack/react-query';
import { getPatient, getPatients } from '../services/patientService';

export const patientQueryKeys = {
  all: ['patients'] as const,
  list: () => [...patientQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...patientQueryKeys.all, 'detail', id] as const,
};

export const usePatients = () =>
  useQuery({
    queryKey: patientQueryKeys.list(),
    queryFn: getPatients,
  });

export const usePatient = (id: string) =>
  useQuery({
    queryKey: patientQueryKeys.detail(id),
    queryFn: () => getPatient(id),
    enabled: /^\d+$/.test(id),
  });
