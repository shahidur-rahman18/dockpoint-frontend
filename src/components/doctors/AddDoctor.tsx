import { useNavigate } from 'react-router';
import FormLayout01, { type FormFieldConfig } from '../common/FormLayout01';
import { doctorsListData } from '../../data/mockData';
import type { DoctorListItem } from '../../types';

const fields: FormFieldConfig[] = [
  {
    name: 'firstName',
    label: 'First name',
    autoComplete: 'given-name',
    placeholder: 'First name',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last name',
    autoComplete: 'family-name',
    placeholder: 'Last name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'Email address',
    required: true,
    span: 'full',
  },
  {
    name: 'designation',
    label: 'Designation',
    placeholder: 'Designation',
    required: true,
    span: 'full',
  },
];

export function AddDoctor() {
  const navigate = useNavigate();

  const handleSubmit = (values: Record<string, string>) => {
    const doctor: DoctorListItem = {
      id: String(Math.max(0, ...doctorsListData.map((item) => Number(item.id) || 0)) + 1),
      name: `Dr. ${values.firstName.trim()} ${values.lastName.trim()}`,
      designation: values.designation.trim(),
      department: '',
      phone: '',
      email: values.email.trim(),
      fees: '',
      status: 'Available',
      avatar: '',
      profile: {
        username: '',
        dateOfBirth: '',
        experienceYears: '',
        medicalLicenseNumber: '',
        bloodGroup: '',
        gender: '',
        languages: '',
        bio: '',
        featured: false,
        address: {
          address1: '',
          address2: '',
          country: '',
          city: '',
          state: '',
          pincode: '',
        },
        schedule: {},
        appointment: {
          type: '',
          advanceBookingDays: '',
          durationMinutes: '',
          maxBookingsPerSlot: '',
          showChargeOnBookingPage: false,
        },
        education: [],
        awards: [],
        certifications: [],
      },
    };

    doctorsListData.push(doctor);
    navigate('/doctors');
  };

  return (
    <FormLayout01
      title="New Doctor"
      subtitle="Add the doctor's basic contact information."
      fields={fields}
      submitLabel="Add Doctor"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/doctors')}
    />
  );
}
