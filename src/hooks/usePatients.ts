import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
  type PatientUpdatePayload,
} from '../services/patientService';

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

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: PatientUpdatePayload }) =>
      updatePatient(id, update),
    onSuccess: async (_data, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: patientQueryKeys.list() }),
        queryClient.invalidateQueries({ queryKey: patientQueryKeys.detail(id) }),
      ]);
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatient,
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: patientQueryKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: patientQueryKeys.all });
    },
  });
};
