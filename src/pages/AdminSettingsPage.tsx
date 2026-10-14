import React from 'react';
import { CircleAlert } from 'lucide-react';
import { LoaderOne } from '../components/common/LoaderOne';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { adminSettingsConfig } from '../components/settings/configs/settingsConfig';
import {
  useMyAccountProfile,
  useUpdateMyAccountProfile,
  useUpdateMyAvatar,
} from '../hooks/useMyAccountProfile';
import { getProfileApiErrorMessage } from '../services/accountService';

export const AdminSettingsPage: React.FC = () => {
  const accountQuery = useMyAccountProfile();
  const updateProfile = useUpdateMyAccountProfile();
  const updateAvatar = useUpdateMyAvatar();

  if (accountQuery.isPending) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <LoaderOne />
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  if (accountQuery.isError) {
    return (
      <div role="alert" className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        <div className="flex items-center gap-2">
          <CircleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{getProfileApiErrorMessage(accountQuery.error)}</p>
        </div>
        <button
          type="button"
          onClick={() => accountQuery.refetch()}
          className="rounded-lg border border-rose-300 px-4 py-2 font-medium hover:bg-rose-100"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <SettingsLayout
      config={adminSettingsConfig}
      initialData={{
        firstName: accountQuery.data.first_name ?? '',
        lastName: accountQuery.data.last_name ?? '',
        email: accountQuery.data.email,
        phoneNumber: accountQuery.data.phone_number ?? '',
      }}
      onSave={(data) => updateProfile.mutateAsync({
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
      })}
      isSaving={updateProfile.isPending}
      saveError={updateProfile.error
        ? getProfileApiErrorMessage(updateProfile.error)
        : null}
      avatarUrl={accountQuery.data.avatar_url}
      avatarBusy={updateAvatar.isPending}
      avatarError={updateAvatar.error
        ? getProfileApiErrorMessage(updateAvatar.error)
        : null}
      onAvatarUpload={(image) => updateAvatar.mutateAsync(image)}
      onAvatarRemove={() => updateAvatar.mutateAsync(null)}
    />
  );
};
