import React, { useState } from 'react';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { LoaderOne } from '../common/LoaderOne';
import { ProfileSection } from '../settings/sections/ProfileSection';
import { DoctorAvatar } from './DoctorAvatar';
import type { FormFieldConfig } from '../../types/settings';
import type { components } from '../../types/schema';
import {
  useDoctorDetails,
  useUpdateDoctorProfile,
} from '../../hooks/useDoctors';
import { getProfileApiErrorMessage } from '../../services/accountService';
import {
  getDoctorMutationErrorMessage,
  mapDoctorProfileToListItem,
} from '../../services/doctorService';

type DoctorProfile = components['schemas']['DoctorProfile'];

const doctorEditFields: FormFieldConfig[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    section: 'basic',
    colSpan: 1,
    readOnly: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    section: 'basic',
    colSpan: 1,
    readOnly: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    section: 'basic',
    colSpan: 1,
    readOnly: true,
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    section: 'basic',
    colSpan: 1,
    readOnly: true,
  },
  {
    name: 'specialization',
    label: 'Specialization',
    type: 'text',
    placeholder: 'Enter specialization',
    section: 'basic',
    colSpan: 1,
  },
  {
    name: 'qualification',
    label: 'Qualification',
    type: 'text',
    placeholder: 'Enter qualification',
    section: 'basic',
    colSpan: 1,
  },
  {
    name: 'consultationFee',
    label: 'Consultation Fee',
    type: 'text',
    placeholder: 'Enter consultation fee',
    section: 'basic',
    colSpan: 1,
  },
  {
    name: 'isAvailable',
    label: 'Availability',
    type: 'select',
    section: 'basic',
    colSpan: 1,
    options: [
      { label: 'Available', value: 'true' },
      { label: 'Unavailable', value: 'false' },
    ],
  },
  {
    name: 'chamberAddress',
    label: 'Chamber Address',
    type: 'text',
    placeholder: 'Enter chamber address',
    section: 'address',
    colSpan: 2,
  },
];

export const DoctorEditPage: React.FC = () => {
  const { doctorId: doctorIdParam } = useParams();
  const doctorId = doctorIdParam ? Number(doctorIdParam) : 0;
  const isValidDoctorId = Number.isSafeInteger(doctorId) && doctorId > 0;
  const doctorQuery = useDoctorDetails(doctorId, isValidDoctorId);

  if (doctorQuery.isPending && isValidDoctorId) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-12">
        <LoaderOne />
        <p className="text-sm text-slate-500">Loading doctor profile...</p>
      </div>
    );
  }

  if (!isValidDoctorId || doctorQuery.isError || !doctorQuery.data) {
    return (
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div role={doctorQuery.isError ? 'alert' : undefined} className="flex items-start gap-3">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
          <div>
            <h1 className="font-semibold text-slate-900">
              {doctorQuery.isError ? 'Unable to load doctor profile' : 'Doctor not found'}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {doctorQuery.isError
                ? getProfileApiErrorMessage(doctorQuery.error)
                : 'The requested doctor profile could not be found.'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {doctorQuery.isError && (
            <button
              type="button"
              onClick={() => void doctorQuery.refetch()}
              className="rounded-lg bg-indigo-900 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
            >
              Try again
            </button>
          )}
          <Link
            to="/doctors"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Doctors
          </Link>
        </div>
      </section>
    );
  }

  return <DoctorEditForm doctor={doctorQuery.data} />;
};

interface DoctorEditFormProps {
  doctor: DoctorProfile;
}

const DoctorEditForm: React.FC<DoctorEditFormProps> = ({ doctor }) => {
  const navigate = useNavigate();
  const updateDoctor = useUpdateDoctorProfile();
  const doctorListItem = mapDoctorProfileToListItem(doctor);
  const [formData, setFormData] = useState<Record<string, string>>({
    firstName: doctor.user_details.first_name ?? '',
    lastName: doctor.user_details.last_name ?? '',
    email: doctor.user_details.email,
    phoneNumber: doctor.user_details.phone_number ?? '',
    specialization: doctor.specialization ?? '',
    qualification: doctor.qualification ?? '',
    consultationFee: doctor.consultation_fee ?? '',
    chamberAddress: doctor.chamber_address ?? '',
    isAvailable: doctor.is_available === undefined ? '' : String(doctor.is_available),
  });

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateDoctor.reset();
    updateDoctor.mutate(
      {
        doctorId: doctor.id,
        update: {
          specialization: formData.specialization.trim(),
          qualification: formData.qualification.trim(),
          consultation_fee: formData.consultationFee.trim(),
          chamber_address: formData.chamberAddress.trim(),
          ...(formData.isAvailable !== '' && {
            is_available: formData.isAvailable === 'true',
          }),
        },
      },
      {
        onSuccess: () => {
          toast.success('Doctor profile updated successfully.', { position: 'bottom-right' });
          navigate('/doctors');
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header>
        <Link
          to="/doctors"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-700"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Doctors
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Doctor</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the doctor&apos;s professional information. Account contact details are read-only.
        </p>
      </header>

      {updateDoctor.isError && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
          <p>{getDoctorMutationErrorMessage(updateDoctor.error, 'update')}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <DoctorAvatar
            src={doctorListItem.avatar}
            alt={doctorListItem.name}
            imageClassName="size-20 shrink-0 rounded-full border border-slate-200 bg-slate-100 object-cover"
            fallbackClassName="grid size-20 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-100 text-slate-400"
            iconClassName="size-9"
          />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-800">Profile photo</h2>
            <p className="mt-1 text-xs text-slate-500">
              This photo is managed from the doctor&apos;s account and cannot be changed here.
            </p>
          </div>
        </section>

        <ProfileSection
          fields={doctorEditFields}
          formData={formData}
          onChange={(name, value) =>
            setFormData((previous) => ({ ...previous, [name]: String(value) }))
          }
          pendingAvatarFile={null}
          avatarRemovalPending={false}
          avatarBusy={updateDoctor.isPending}
        />

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            disabled={updateDoctor.isPending}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateDoctor.isPending}
            className="cursor-pointer rounded-lg bg-indigo-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-60"
          >
            {updateDoctor.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
