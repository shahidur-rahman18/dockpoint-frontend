import { CalendarDays, Droplets, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Card } from '../common/Card';
import { DoctorAvatar } from '../doctors/DoctorAvatar';
import { usePatient } from '../../hooks/usePatients';
import { getPatientApiErrorMessage } from '../../services/patientService';

export function PatientDetails() {
  const { patientId = '' } = useParams();
  const isValidPatientId = /^\d+$/.test(patientId);
  const { data: patient, error, isError, isPending, refetch } = usePatient(patientId);

  if (isPending && isValidPatientId) {
    return (
      <Card role="status" className="flex min-h-48 items-center justify-center p-8 text-sm text-slate-500">
        Loading patient details…
      </Card>
    );
  }

  if (!isValidPatientId || isError || !patient) {
    return (
      <Card role="alert" className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-lg font-bold text-slate-900">
          {isError ? 'Unable to load patient' : 'Patient not found'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isError
            ? getPatientApiErrorMessage(error)
            : 'This patient record is not available.'}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          {isError && (
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex min-h-9 items-center rounded-md bg-[var(--theme-accent)] px-4 text-sm font-semibold text-white hover:brightness-110"
            >
              Retry
            </button>
          )}
          <Link
            to="/admin-dashboard/patients"
            className="inline-flex min-h-9 items-center rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Patients
          </Link>
        </div>
      </Card>
    );
  }

  const about = [
    { label: 'Date of Birth', value: patient.dateOfBirth, Icon: CalendarDays },
    { label: 'Blood Group', value: patient.bloodGroup, Icon: Droplets },
    { label: 'Gender', value: patient.gender, Icon: UserRound },
    { label: 'Email', value: patient.email, Icon: Mail },
    { label: 'Phone', value: patient.phone, Icon: Phone },
    { label: 'Emergency Contact', value: patient.emergencyContact, Icon: Phone },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Link to="/admin-dashboard/patients" className="text-sm font-medium text-slate-500 hover:text-indigo-700">
          ‹ Patients
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">Patient Details</h1>
      </div>

      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <DoctorAvatar
          src={patient.avatar}
          alt={patient.name}
          imageClassName="size-24 shrink-0 rounded-xl border border-slate-200 object-cover"
          fallbackClassName="grid size-24 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400"
          iconClassName="size-9"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-indigo-600">Patient #{patient.id}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              patient.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {patient.isVerified ? 'Email verified' : 'Email unverified'}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {patient.address}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Phone aria-hidden="true" className="size-4 text-slate-400" />
              {patient.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail aria-hidden="true" className="size-4 text-slate-400" />
              {patient.email}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-800">Patient Information</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            patient.profileComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {patient.profileComplete ? 'Profile complete' : 'Profile incomplete'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {about.map(({ label, value, Icon }) => (
            <div key={label} className="flex min-w-0 items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-indigo-600 shadow-sm">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-700">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <p className="border-t border-slate-200/70 py-3 text-center text-xs text-slate-500">
        2026 © Dockpoint, All Rights Reserved
      </p>
    </div>
  );
}
