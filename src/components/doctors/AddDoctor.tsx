import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { SharedForm, type FormFieldConfig } from '../common/SharedForm';
import { Modal } from '../common/Modal';
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
      <div className="flex items-center justify-center p-4 sm:p-8">
        <section className="w-full max-w-2xl rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">New Doctor</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Add the doctor's details. The backend handles the account setup email.
          </p>
          <div className="mt-8">
            <SharedForm
              fields={fields}
              submitLabel="Add Doctor"
              onSubmit={(values) => handleSubmit(values)}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              onCancel={() => navigate('/doctors')}
            />
          </div>
        </section>
      </div>
      <Modal
        open={isSuccessModalOpen}
        title="Doctor Created"
        size="sm"
        showHeader={false}
        contentClassName="!mt-0 -mx-1 text-center"
        onClose={() => navigate('/doctors')}
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 aria-hidden="true" className="size-8" />
        </div>
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Doctor Created</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Doctor account created. A password setup email was requested for {createdDoctorEmail}.
        </p>
        <button
          type="button"
          onClick={() => navigate('/doctors')}
          className="mt-5 min-h-10 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Go to Doctors
        </button>
      </Modal>
    </>
  );
}
