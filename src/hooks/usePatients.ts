import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../services/patientService';

export const patientQueryKeys = {
  all: ['patients'] as const,
  list: () => [...patientQueryKeys.all, 'list'] as const,
};

export const usePatients = () =>
  useQuery({
    queryKey: patientQueryKeys.list(),
    queryFn: getPatients,
  });
