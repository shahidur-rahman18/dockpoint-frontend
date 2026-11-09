import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthContext';
import {
  getDoctorSchedule,
  updateDoctorSchedule,
  type DoctorScheduleUpdate,
} from '../services/doctorScheduleService';

export const doctorScheduleQueryKey = (email: string | null) =>
  ['doctor-schedule', email] as const;

export const useDoctorSchedule = () => {
  const { email } = useAuth();

  return useQuery({
    queryKey: doctorScheduleQueryKey(email),
    queryFn: getDoctorSchedule,
    enabled: Boolean(email),
  });
};

export const useUpdateDoctorSchedule = () => {
  const queryClient = useQueryClient();
  const { email } = useAuth();

  return useMutation({
    mutationFn: (schedule: DoctorScheduleUpdate) => updateDoctorSchedule(schedule),
    retry: false,
    onSuccess: (schedule) => {
      queryClient.setQueryData(doctorScheduleQueryKey(email), schedule);
    },
  });
};
