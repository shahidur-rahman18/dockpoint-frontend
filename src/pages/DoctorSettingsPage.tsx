import React from 'react';
import { LoaderOne } from '../components/common/LoaderOne';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { doctorSettingsConfig } from '../components/settings/configs/settingsConfig';
import {
  getProfileApiErrorMessage,
  type DoctorSettingsUpdate,
} from '../services/accountService';
import {
  useDoctorSettingsProfile,
  useUpdateDoctorSettingsProfile,
} from '../hooks/useDoctorSettingsProfile';
import { useUpdateMyAvatar } from '../hooks/useMyAccountProfile';

export const DoctorSettingsPage: React.FC = () => {
  const profileQuery = useDoctorSettingsProfile();
  const updateProfile = useUpdateDoctorSettingsProfile();
  const updateAvatar = useUpdateMyAvatar();

  if (profileQuery.isPending) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <LoaderOne />
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div role="alert" className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        <p>{getProfileApiErrorMessage(profileQuery.error)}</p>
        <button
          type="button"
          onClick={() => profileQuery.refetch()}
          className="rounded-lg border border-rose-300 px-4 py-2 font-medium hover:bg-rose-100"
        >
          Retry
        </button>
      </div>
    );
  }

  const { account, doctor } = profileQuery.data;
  const initialDoctorData = {
    firstName: account.first_name ?? '',
    lastName: account.last_name ?? '',
    email: account.email,
    phoneNumber: account.phone_number ?? '',
    specialization: doctor.specialization ?? '',
    qualification: doctor.qualification ?? '',
    consultationFee: doctor.consultation_fee ?? '',
    chamberAddress: doctor.chamber_address ?? '',
  };

  const handleSave = async (data: Record<string, any>) => {
    const update: DoctorSettingsUpdate = {
      account: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
      },
      doctor: {
        specialization: data.specialization,
        qualification: data.qualification,
        consultation_fee: data.consultationFee,
        chamber_address: data.chamberAddress,
      },
    };

    await updateProfile.mutateAsync(update);
  };

  return (
    <SettingsLayout
      config={doctorSettingsConfig}
      initialData={initialDoctorData}
      onSave={handleSave}
      isSaving={updateProfile.isPending}
      saveError={updateProfile.error
        ? getProfileApiErrorMessage(updateProfile.error)
        : null}
      avatarUrl={profileQuery.data.account.avatar_url}
      avatarBusy={updateAvatar.isPending}
      avatarError={updateAvatar.error
        ? getProfileApiErrorMessage(updateAvatar.error)
        : null}
      onAvatarUpload={(image) => updateAvatar.mutateAsync(image)}
      onAvatarRemove={() => updateAvatar.mutateAsync(null)}
    />
  );
};
