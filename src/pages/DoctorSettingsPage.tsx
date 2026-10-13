import React from 'react';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { doctorSettingsConfig } from '../components/settings/configs/settingsConfig';
import {
  getDoctorSettingsErrorMessage,
  type DoctorSettingsUpdate,
} from '../services/accountService';
import {
  useDoctorSettingsProfile,
  useUpdateDoctorSettingsProfile,
} from '../hooks/useDoctorSettingsProfile';

export const DoctorSettingsPage: React.FC = () => {
  const profileQuery = useDoctorSettingsProfile();
  const updateProfile = useUpdateDoctorSettingsProfile();

  if (profileQuery.isPending) {
    return <p role="status" className="py-8 text-center text-sm text-slate-500">Loading your profile...</p>;
  }

  if (profileQuery.isError) {
    return (
      <div role="alert" className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        <p>{getDoctorSettingsErrorMessage(profileQuery.error)}</p>
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
        ? getDoctorSettingsErrorMessage(updateProfile.error)
        : null}
    />
  );
};
