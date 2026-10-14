import React from 'react';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { adminSettingsConfig } from '../components/settings/configs/settingsConfig';
import { useMyAccountProfile, useUpdateMyAvatar } from '../hooks/useMyAccountProfile';
import { getProfileApiErrorMessage } from '../services/accountService';

export const AdminSettingsPage: React.FC = () => {
  const accountQuery = useMyAccountProfile();
  const updateAvatar = useUpdateMyAvatar();

  const initialAdminData = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@preclinic.com',
    phoneNumber: '+1 (555) 019-2834',
    address1: '123 Healthcare Ave',
    address2: 'Suite 400',
    country: 'US',
    state: 'CA',
    city: 'LA',
    pincode: '90001',
  };

  const handleSave = (data: Record<string, any>) => {
    console.log('Saving Admin Settings:', data);
  };

  return (
    <SettingsLayout
      config={adminSettingsConfig}
      initialData={initialAdminData}
      onSave={handleSave}
      avatarUrl={accountQuery.data?.avatar_url}
      avatarBusy={updateAvatar.isPending}
      avatarError={updateAvatar.error
        ? getProfileApiErrorMessage(updateAvatar.error)
        : accountQuery.error
          ? getProfileApiErrorMessage(accountQuery.error)
          : null}
      onAvatarUpload={(image) => updateAvatar.mutateAsync(image)}
      onAvatarRemove={() => updateAvatar.mutateAsync(null)}
    />
  );
};
