import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDoctorSettingsProfile,
  updateDoctorSettingsProfile,
  type DoctorSettingsUpdate,
} from '../services/accountService';

export const doctorSettingsProfileQueryKey = ['doctor-settings-profile'] as const;

export const useDoctorSettingsProfile = () =>
  useQuery({
    queryKey: doctorSettingsProfileQueryKey,
    queryFn: getDoctorSettingsProfile,
  });

export const useUpdateDoctorSettingsProfile = () => {
  const queryClient = useQueryClient();
  const profileQuery = useDoctorSettingsProfile();

  return useMutation({
    mutationFn: (update: DoctorSettingsUpdate) => {
      const doctorId = profileQuery.data?.doctor.id;

      if (doctorId === undefined) {
        throw new Error('Doctor profile is not loaded. Please reload and try again.');
      }

      return updateDoctorSettingsProfile(doctorId, update);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: doctorSettingsProfileQueryKey }),
  });
};
