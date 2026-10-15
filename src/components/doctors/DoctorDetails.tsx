import React from 'react';
import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { LoaderOne } from '../common/LoaderOne';
import { DoctorAvatar } from './DoctorAvatar';
import { useDoctorDetails } from '../../hooks/useDoctors';
import { mapDoctorProfileToListItem } from '../../services/doctorService';
import { getProfileApiErrorMessage } from '../../services/accountService';

export const DoctorDetails: React.FC = () => {
  const { doctorId } = useParams();
  const parsedDoctorId = doctorId ? Number(doctorId) : 0;
  const isValidDoctorId = Number.isSafeInteger(parsedDoctorId) && parsedDoctorId > 0;
  const doctorQuery = useDoctorDetails(parsedDoctorId, isValidDoctorId);

  if (doctorQuery.isPending && isValidDoctorId) {
    return (
      <div
        role="status"
        className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 text-sm text-[var(--text-muted)]"
      >
        <LoaderOne />
        Loading doctor details…
      </div>
    );
  }

  if (!isValidDoctorId || doctorQuery.isError || !doctorQuery.data) {
    return (
      <section
        role={doctorQuery.isError ? 'alert' : undefined}
        className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-8 text-center"
      >
        <h1 className="text-lg font-bold text-[var(--text-primary)]">
          {doctorQuery.isError ? 'Unable to load doctor details' : 'Doctor not found'}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {doctorQuery.isError
            ? getProfileApiErrorMessage(doctorQuery.error)
            : 'The requested doctor profile could not be found.'}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {doctorQuery.isError && (
            <button
              type="button"
              onClick={() => void doctorQuery.refetch()}
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--theme-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Try again
            </button>
          )}
          <Link
            to="/doctors"
            className="inline-flex min-h-10 items-center rounded-lg border border-[var(--border-color)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)]"
          >
            Back to Doctors
          </Link>
        </div>
      </section>
    );
  }

  const doctor = doctorQuery.data;
  const listItem = mapDoctorProfileToListItem(doctor);
  const name = [doctor.user_details.first_name, doctor.user_details.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
  const displayName = name ? `Dr. ${name}` : 'Doctor name not provided';
  const specialization = doctor.specialization?.trim() || '';
  const qualification = doctor.qualification?.trim() || '';
  const chamberAddress = doctor.chamber_address?.trim() || '';
  const isAvailable = doctor.is_available === true;
  const availabilityLabel =
    doctor.is_available === undefined
      ? 'Not provided'
      : isAvailable
        ? 'Available'
        : 'Unavailable';
  const profileDetails = [
    doctor.user_details.phone_number
      ? { label: 'Phone Number', value: doctor.user_details.phone_number, Icon: Phone }
      : null,
    doctor.user_details.email
      ? { label: 'Email Address', value: doctor.user_details.email, Icon: Mail }
      : null,
    specialization ? { label: 'Specialty', value: specialization, Icon: Stethoscope } : null,
    chamberAddress ? { label: 'Location', value: chamberAddress, Icon: MapPin } : null,
    {
      label: 'Availability',
      value: availabilityLabel,
      Icon: UserRound,
    },
  ].filter((item) => item !== null);

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--theme-accent)]"
        >
          <span aria-hidden="true">‹</span>
          Doctors
        </Link>
        <h1 className="mt-2 text-xl font-bold text-[var(--text-primary)]">Doctor Details</h1>
      </div>

      <section className="flex flex-col gap-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-2xs sm:flex-row sm:items-center sm:p-6">
        <DoctorAvatar
          src={listItem.avatar}
          alt={displayName}
          imageClassName="size-28 shrink-0 rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] object-cover sm:size-30"
          fallbackClassName="grid size-28 shrink-0 place-items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] text-[var(--text-muted)] sm:size-30"
          iconClassName="size-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{displayName}</h2>
            {specialization && (
              <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                {specialization}
              </span>
            )}
          </div>
          {qualification && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{qualification}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
            {chamberAddress && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4" />
                {chamberAddress}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-700'
                  : doctor.is_available === false
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-amber-50 text-amber-700'
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isAvailable
                    ? 'bg-emerald-500'
                    : doctor.is_available === false
                      ? 'bg-slate-400'
                      : 'bg-amber-500'
                }`}
              />
              {availabilityLabel}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-[var(--border-color)] pt-4 sm:flex-col sm:items-start sm:border-0 sm:pt-0">
          <div>
            <p className="text-sm text-[var(--text-muted)]">Consultation Charge</p>
            <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
              {doctor.consultation_fee ? `৳ ${doctor.consultation_fee}` : 'Not provided'}
            </p>
          </div>
          <Link
            to="/appointments"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90"
            style={{ background: 'var(--theme-accent)' }}
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            Book Appointment
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 aria-hidden="true" className="size-5 text-[var(--theme-accent)]" />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Availability</h2>
            </div>
            <p className="text-sm leading-6 text-[var(--text-muted)]">
              {doctor.is_available === undefined
                ? 'Availability information has not been provided for this doctor.'
                : isAvailable
                  ? 'This doctor is currently accepting appointments. A weekly schedule has not been provided.'
                  : 'This doctor is currently unavailable for appointments.'}
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Clinic Information</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              {chamberAddress || 'Clinic address has not been added for this doctor.'}
            </p>
          </section>
        </div>

        <aside className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6">
          <h2 className="text-base font-bold text-[var(--text-primary)]">About</h2>
          <dl className="mt-4 space-y-4">
            {profileDetails.map(({ label, value, Icon }) => (
              <div key={label} className="flex min-w-0 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <dt className="text-sm font-semibold text-[var(--text-primary)]">{label}</dt>
                  <dd className="mt-0.5 break-words text-sm leading-5 text-[var(--text-muted)]">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
};
