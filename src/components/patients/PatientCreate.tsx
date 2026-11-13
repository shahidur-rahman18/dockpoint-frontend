import { useState } from 'react';
import { ArrowLeft, ImagePlus, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Card } from '../common/Card';
import { SharedForm, type FormFieldConfig } from '../common/SharedForm';

const doctorOptions = [
  'Dr. Mick Thompson',
  'Dr. Sarah Johnson',
  'Dr. Emily Carter',
  'Dr. David Lee',
  'Dr. Anna Kim',
].map((name) => ({ label: name, value: name }));

const patientFields: FormFieldConfig[] = [
  { name: 'firstName', label: 'First Name', required: true, placeholder: 'Enter first name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last Name', required: true, placeholder: 'Enter last name', autoComplete: 'family-name' },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+1 (201) 555-0123', autoComplete: 'tel' },
  { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter email address', autoComplete: 'email' },
  { name: 'primaryDoctor', label: 'Primary Doctor', type: 'select', required: true, options: doctorOptions },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, autoComplete: 'bday' },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    required: true,
    options: ['Male', 'Female', 'Other'].map((value) => ({ label: value, value })),
  },
  {
    name: 'bloodGroup',
    label: 'Blood Group',
    type: 'select',
    required: true,
    options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((value) => ({ label: value, value })),
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: ['Available', 'Unavailable'].map((value) => ({ label: value, value })),
  },
  { name: 'address1', label: 'Address 1', required: true, placeholder: 'Street address', span: 'half', autoComplete: 'address-line1' },
  { name: 'address2', label: 'Address 2', placeholder: 'Apartment, suite, etc.', span: 'half', autoComplete: 'address-line2' },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    required: true,
    options: ['United States', 'Bangladesh', 'Canada', 'United Kingdom'].map((value) => ({ label: value, value })),
  },
  {
    name: 'state',
    label: 'State',
    type: 'select',
    required: true,
    options: ['Nevada', 'California', 'Texas', 'Florida', 'New York'].map((value) => ({ label: value, value })),
  },
  {
    name: 'city',
    label: 'City',
    type: 'select',
    required: true,
    options: ['Las Vegas', 'Los Angeles', 'Austin', 'Miami', 'New York'].map((value) => ({ label: value, value })),
  },
  { name: 'pincode', label: 'Pincode', required: true, placeholder: 'Enter ZIP / postal code', autoComplete: 'postal-code' },
];

export function PatientCreate() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState('');
  const [avatarName, setAvatarName] = useState('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
    setAvatarName(file.name);
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
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">Create Patient</h1>
        <p className="mt-1 text-sm text-slate-500">Enter patient details to create a new record.</p>
      </div>

      <Card className="p-4 sm:p-6 lg:p-7">
        <h2 className="text-base font-bold text-slate-800">Patient Information</h2>
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Patient creation is not connected to the backend yet. This form will not save a record.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6">
          {avatar ? (
            <img src={avatar} alt="Patient profile preview" className="size-16 rounded-full border border-slate-200 object-cover" />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-slate-100 text-slate-400">
              <UserRound aria-hidden="true" className="size-7" />
            </span>
          )}
          <div>
            <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
              <ImagePlus aria-hidden="true" className="size-4" />
              Upload Profile Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>
            <p className="mt-1.5 max-w-64 truncate text-xs text-slate-400">
              {avatarName || 'JPG or PNG, up to 5 MB'}
            </p>
          </div>
        </div>

        <div className="pt-6">
          <SharedForm
            fields={patientFields}
            submitLabel="Backend API not available"
            cancelLabel="Cancel"
            initialValues={{ status: 'Available' }}
            isSubmitDisabled
            onCancel={() => navigate('/admin-dashboard/patients')}
            onSubmit={() => undefined}
          />
        </div>
      </Card>
      <p className="border-t border-slate-200/70 py-3 text-center text-xs text-slate-500">
        2026 © Dockpoint, All Rights Reserved
      </p>
    </div>
  );
}
