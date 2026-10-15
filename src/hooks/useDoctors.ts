import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteDoctor,
  getDoctors,
  updateDoctorAvailability,
  updateDoctorProfile,
  type DoctorListQuery,
  type DoctorProfileUpdate,
} from '../services/doctorService';
import { getDoctorProfile } from '../services/accountService';

export const doctorQueryKeys = {
  all: ['doctors'] as const,
  list: (query?: DoctorListQuery) => [...doctorQueryKeys.all, 'list', query] as const,
  detail: (doctorId: number) => [...doctorQueryKeys.all, 'detail', doctorId] as const,
};

export const useDoctors = (query?: DoctorListQuery) =>
  useQuery({
    queryKey: doctorQueryKeys.list(query),
    queryFn: () => getDoctors(query),
  });

export const useDoctorDetails = (doctorId: number, enabled = true) =>
  useQuery({
    queryKey: doctorQueryKeys.detail(doctorId),
    queryFn: () => getDoctorProfile(doctorId),
    enabled: enabled && Number.isSafeInteger(doctorId) && doctorId > 0,
  });

export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorId, update }: { doctorId: number; update: DoctorProfileUpdate }) =>
      updateDoctorProfile(doctorId, update),
    onSuccess: async (doctor) => {
      queryClient.setQueryData(doctorQueryKeys.detail(doctor.id), doctor);
      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.all });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: async (_data, doctorId) => {
      queryClient.removeQueries({ queryKey: doctorQueryKeys.detail(doctorId) });
      await queryClient.invalidateQueries({ queryKey: doctorQueryKeys.all });
    },
  });
};

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
