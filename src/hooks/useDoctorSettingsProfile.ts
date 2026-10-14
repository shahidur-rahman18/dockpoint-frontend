import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDoctorProfile,
  getMyAccountProfile,
  updateDoctorSettingsProfile,
  type DoctorSettingsUpdate,
} from '../services/accountService';
import { myAccountProfileQueryKey } from './useMyAccountProfile';
import { useAuth } from '../auth/AuthContext';

export const doctorSettingsProfileQueryKey = (email: string | null) =>
  ['doctor-settings-profile', email] as const;

export const useDoctorSettingsProfile = () => {
  const queryClient = useQueryClient();
  const { email } = useAuth();

  return useQuery({
    queryKey: doctorSettingsProfileQueryKey(email),
    queryFn: async () => {
      const account = await queryClient.ensureQueryData({
        queryKey: myAccountProfileQueryKey(email),
        queryFn: getMyAccountProfile,
      });

      if (account.role !== 'DOCTOR' || !account.doctor_profile?.id) {
        throw new Error('The signed-in account does not have a doctor profile.');
      }

      const doctor = await getDoctorProfile(account.doctor_profile.id);
      return { account, doctor };
    },
  });
};

export const useUpdateDoctorSettingsProfile = () => {
  const queryClient = useQueryClient();
  const { email } = useAuth();
  const profileQuery = useDoctorSettingsProfile();

  return useMutation({
    mutationFn: (update: DoctorSettingsUpdate) => {
      const doctorId = profileQuery.data?.doctor.id;

      if (doctorId === undefined) {
        throw new Error('Doctor profile is not loaded. Please reload and try again.');
      }

      return updateDoctorSettingsProfile(doctorId, update);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: doctorSettingsProfileQueryKey(email) }),
  });
};
