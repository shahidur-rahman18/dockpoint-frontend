import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthContext';
import { getMyAccountProfile, updateMyAvatar } from '../services/accountService';

export const myAccountProfileQueryKey = (email: string | null) =>
  ['my-account-profile', email] as const;

export const useMyAccountProfile = () => {
  const { email } = useAuth();

  return useQuery({
    queryKey: myAccountProfileQueryKey(email),
    queryFn: getMyAccountProfile,
    enabled: Boolean(email),
  });
};

export const useUpdateMyAvatar = () => {
  const queryClient = useQueryClient();
  const { email } = useAuth();

  return useMutation({
    mutationFn: updateMyAvatar,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: myAccountProfileQueryKey(email) }),
        queryClient.invalidateQueries({ queryKey: ['doctor-settings-profile'] }),
      ]);
    },
  });
};
