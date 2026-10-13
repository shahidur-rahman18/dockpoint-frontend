import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDoctors,
  updateDoctorAvailability,
  type DoctorListQuery,
} from '../services/doctorService';

export const doctorQueryKeys = {
  all: ['doctors'] as const,
  list: (query?: DoctorListQuery) => [...doctorQueryKeys.all, 'list', query] as const,
};

export const useDoctors = (query?: DoctorListQuery) =>
  useQuery({
    queryKey: doctorQueryKeys.list(query),
    queryFn: () => getDoctors(query),
  });

export const useUpdateDoctorAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      isAvailable,
    }: {
      doctorId: string;
      isAvailable: boolean;
    }) => updateDoctorAvailability(doctorId, isAvailable),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: doctorQueryKeys.all }),
  });
};
