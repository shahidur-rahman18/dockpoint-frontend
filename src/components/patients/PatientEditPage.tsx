import { ArrowLeft, CircleAlert } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { Card } from '../common/Card';
import { LoaderOne } from '../common/LoaderOne';
import { SharedForm, type FormFieldConfig } from '../common/SharedForm';
import { usePatient, useUpdatePatient } from '../../hooks/usePatients';
import {
  getPatientApiErrorMessage,
  getPatientMutationErrorMessage,
} from '../../services/patientService';

const patientEditFields: FormFieldConfig[] = [
  { name: 'firstName', label: 'First Name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last Name', autoComplete: 'family-name' },
  { name: 'phone', label: 'Phone Number', type: 'tel', autoComplete: 'tel' },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', autoComplete: 'bday' },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    options: ['MALE', 'FEMALE', 'OTHER'].map((value) => ({ label: value, value })),
  },
  {
    name: 'bloodGroup',
    label: 'Blood Group',
    type: 'select',
    options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'].map((value) => ({
      label: value === 'UNKNOWN' ? 'Unknown / Not Tested' : value,
      value,
    })),
  },
  { name: 'emergencyContact', label: 'Emergency Contact', type: 'tel', autoComplete: 'tel' },
  { name: 'address', label: 'Address', type: 'textarea', span: 'full', autoComplete: 'street-address' },
];

export function PatientEditPage() {
  const { patientId = '' } = useParams();
  const navigate = useNavigate();
  const isValidPatientId = /^\d+$/.test(patientId);
  const patientQuery = usePatient(patientId);
  const updatePatient = useUpdatePatient();

  if (patientQuery.isPending && isValidPatientId) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-12">
        <LoaderOne />
        <p className="text-sm text-slate-500">Loading patient profile...</p>
      </div>
    );
  }

  if (!isValidPatientId || patientQuery.isError || !patientQuery.data) {
    return (
      <Card role="alert" className="mx-auto max-w-xl p-8 text-center">
        <div className="flex items-start gap-3 text-left">
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden="true" />
          <div>
            <h1 className="font-semibold text-slate-900">
              {patientQuery.isError ? 'Unable to load patient' : 'Patient not found'}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {patientQuery.isError
                ? getPatientApiErrorMessage(patientQuery.error)
                : 'The requested patient record could not be found.'}
            </p>
          </div>
        </div>
        <Link
          to="/admin-dashboard/patients"
          className="mt-5 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Patients
        </Link>
      </Card>
    );
  }

  const patient = patientQuery.data;
  const initialValues = {
    firstName: patient.firstName,
    lastName: patient.lastName,
    phone: patient.phone === '—' ? '' : patient.phone,
    dateOfBirth: patient.dateOfBirth === '—' ? '' : patient.dateOfBirth,
    gender: patient.gender === '—' ? '' : patient.gender.toUpperCase(),
    bloodGroup: patient.bloodGroup === '—' ? '' : patient.bloodGroup,
    emergencyContact: patient.emergencyContact === '—' ? '' : patient.emergencyContact,
    address: patient.address === '—' ? '' : patient.address,
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div>
        <Link
          to="/admin-dashboard/patients"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-700"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Patients
        </Link>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">Edit Patient</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the patient&apos;s contact and profile information.
        </p>
      </div>

      <Card className="p-4 sm:p-6 lg:p-7">
        <h2 className="text-base font-bold text-slate-800">Patient Information</h2>
        <div className="mt-5">
          <SharedForm
            fields={patientEditFields}
            initialValues={initialValues}
            submitLabel="Save Changes"
            isSubmitting={updatePatient.isPending}
            errorMessage={
              updatePatient.error
                ? getPatientMutationErrorMessage(updatePatient.error, 'update')
                : undefined
            }
            onCancel={() => navigate('/admin-dashboard/patients')}
            onSubmit={(values) => {
              updatePatient.reset();
              updatePatient.mutate(
                {
                  id: patient.id,
                  update: {
                    first_name: values.firstName.trim(),
                    last_name: values.lastName.trim(),
                    phone_number: values.phone.trim(),
                    patient_profile: {
                      date_of_birth: values.dateOfBirth || null,
                      gender: values.gender,
                      blood_group: values.bloodGroup,
                      address: values.address.trim(),
                      emergency_contact: values.emergencyContact.trim(),
                    },
                  },
                },
                {
                  onSuccess: () => {
                    toast.success('Patient updated successfully.', { position: 'bottom-right' });
                    navigate('/admin-dashboard/patients');
                  },
                },
              );
            }}
          />
        </div>
      </Card>
      <p className="border-t border-slate-200/70 py-3 text-center text-xs text-slate-500">
        2026 © Dockpoint, All Rights Reserved
      </p>
    </div>
  );
}
