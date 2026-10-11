import { useState } from 'react';
import { useNavigate } from 'react-router';
import FormLayout01, { type FormFieldConfig } from '../common/FormLayout01';
import { SuccessModal } from '../common/FeedbackModals';
import { createDoctor, getDoctorCreationErrorMessage } from '../../services/doctorService';

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
    name: 'specialization',
    label: 'Specialization',
    placeholder: 'Specialization',
    required: true,
    span: 'full',
  },
  {
    name: 'phoneNumber',
    label: 'Phone number',
    type: 'tel',
    autoComplete: 'tel',
    placeholder: 'Phone number',
  },
  {
    name: 'qualification',
    label: 'Qualification',
    placeholder: 'Qualification',
  },
  {
    name: 'consultationFee',
    label: 'Consultation fee',
    type: 'number',
    placeholder: '0.00',
    required: true,
    min: '0',
    step: '0.01',
  },
  {
    name: 'chamberAddress',
    label: 'Chamber address',
    placeholder: 'Chamber address',
    span: 'full',
  },
];

export function AddDoctor() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdDoctorEmail, setCreatedDoctorEmail] = useState('');

  const handleSubmit = async (values: Record<string, string>) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const specialization = values.specialization.trim();
      const phoneNumber = values.phoneNumber.trim();
      const qualification = values.qualification.trim();
      const chamberAddress = values.chamberAddress.trim();

      await createDoctor({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim(),
        consultation_fee: values.consultationFee,
        ...(specialization ? { specialization } : {}),
        ...(phoneNumber ? { phone_number: phoneNumber } : {}),
        ...(qualification ? { qualification } : {}),
        ...(chamberAddress ? { chamber_address: chamberAddress } : {}),
      });
      setCreatedDoctorEmail(values.email.trim());
      setIsSuccessModalOpen(true);
    } catch (error) {
      setErrorMessage(getDoctorCreationErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormLayout01
        title="New Doctor"
        subtitle="Add the doctor's details. The backend handles the account setup email."
        fields={fields}
        submitLabel="Add Doctor"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onCancel={() => navigate('/doctors')}
      />
      <SuccessModal
        open={isSuccessModalOpen}
        title="Doctor Created"
        description={`Doctor account created. A password setup email was requested for ${createdDoctorEmail}.`}
        buttonLabel="Go to Doctors"
        onClose={() => navigate('/doctors')}
      />
    </>
  );
}
