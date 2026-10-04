import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Camera, ChevronLeft, Plus, Trash2, UserRound } from 'lucide-react';
import { doctorsListData } from '../../data/mockData';
import type { DoctorListItem, DoctorProfile } from '../../types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Day = (typeof days)[number];
type TimeSlot = { session: string; from: string; to: string };
type Education = DoctorProfile['education'][number];
type Award = DoctorProfile['awards'][number];

const emptySchedule = (): Record<Day, TimeSlot[]> =>
  Object.fromEntries(days.map((day) => [day, [{ session: '', from: '', to: '' }]])) as Record<
    Day,
    TimeSlot[]
  >;

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10';

function Field({
  label,
  required = false,
  children,
  className = '',
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block min-w-0 space-y-1.5 text-xs font-medium text-slate-700 ${className}`}>
      <span>
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: string;
}) {
  return (
    <Field label={label} required={required}>
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
      />
    </Field>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <select
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function AddDoctor() {
  const navigate = useNavigate();
  const departments = [...new Set(doctorsListData.map((doctor) => doctor.department))].sort();
  const [selectedDay, setSelectedDay] = useState<Day>('Monday');
  const [avatar, setAvatar] = useState('');
  const [imageError, setImageError] = useState('');
  const [education, setEducation] = useState<Education[]>([
    { degree: '', university: '', from: '', to: '' },
  ]);
  const [awards, setAwards] = useState<Award[]>([{ name: '', from: '' }]);
  const [certifications, setCertifications] = useState<Award[]>([{ name: '', from: '' }]);
  const [schedule, setSchedule] = useState(emptySchedule);
  const [form, setForm] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    experienceYears: '',
    department: '',
    designation: '',
    medicalLicenseNumber: '',
    bloodGroup: '',
    gender: '',
    languages: '',
    bio: '',
    featured: false,
    address1: '',
    address2: '',
    country: '',
    city: '',
    state: '',
    pincode: '',
    appointmentType: '',
    advanceBookingDays: '',
    durationMinutes: '',
    consultationCharge: '',
    maxBookingsPerSlot: '',
    showChargeOnBookingPage: false,
  });

  const setValue = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateScheduleSlot = (index: number, key: keyof TimeSlot, value: string) => {
    setSchedule((current) => ({
      ...current,
      [selectedDay]: current[selectedDay].map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot,
      ),
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }

    setImageError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatar(reader.result);
    };
    reader.onerror = () => setImageError('The selected image could not be read.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const doctor: DoctorListItem = {
      id: String(Math.max(0, ...doctorsListData.map((item) => Number(item.id) || 0)) + 1),
      name: form.name.trim(),
      designation: form.designation.trim(),
      department: form.department,
      phone: form.phone.trim(),
      email: form.email.trim(),
      fees: `$${form.consultationCharge}`,
      status: 'Available',
      avatar: avatar || doctorsListData[0]?.avatar || '',
      profile: {
        username: form.username.trim(),
        dateOfBirth: form.dateOfBirth,
        experienceYears: form.experienceYears,
        medicalLicenseNumber: form.medicalLicenseNumber.trim(),
        bloodGroup: form.bloodGroup,
        gender: form.gender,
        languages: form.languages.trim(),
        bio: form.bio.trim(),
        featured: form.featured,
        address: {
          address1: form.address1.trim(),
          address2: form.address2.trim(),
          country: form.country.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },
        schedule,
        appointment: {
          type: form.appointmentType,
          advanceBookingDays: form.advanceBookingDays,
          durationMinutes: form.durationMinutes,
          maxBookingsPerSlot: form.maxBookingsPerSlot,
          showChargeOnBookingPage: form.showChargeOnBookingPage,
        },
        education: education.filter((item) => item.degree || item.university),
        awards: awards.filter((item) => item.name),
        certifications: certifications.filter((item) => item.name),
      },
    };

    doctorsListData.push(doctor);
    navigate('/doctors');
  };

  const updateRow = <T,>(
    setter: (update: (rows: T[]) => T[]) => void,
    index: number,
    key: keyof T,
    value: string,
  ) => {
    setter((rows) => rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [key]: value } : row,
    ));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-6">
      <button
        type="button"
        onClick={() => navigate('/doctors')}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-indigo-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Doctor
      </button>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
        <header className="border-b border-slate-200 pb-3">
          <h1 className="text-base font-bold text-slate-900">New Doctor</h1>
        </header>

        <Section title="Contact Information">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-medium text-slate-700">Profile Image</span>
            <label className="relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
              {avatar ? (
                <img src={avatar} alt="Doctor profile preview" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-6 w-6" />
              )}
              <span className="absolute inset-x-0 bottom-0 flex h-5 items-center justify-center bg-slate-900/80 text-white">
                <Camera className="h-3 w-3" />
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>
            {imageError && <p role="alert" className="text-xs text-rose-600">{imageError}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Name" value={form.name} onChange={(value) => setValue('name', value)} required />
            <TextField label="Username" value={form.username} onChange={(value) => setValue('username', value)} required />
            <TextField label="Phone Number" value={form.phone} onChange={(value) => setValue('phone', value)} type="tel" required />
            <TextField label="Email Address" value={form.email} onChange={(value) => setValue('email', value)} type="email" required />
            <TextField label="Date of Birth" value={form.dateOfBirth} onChange={(value) => setValue('dateOfBirth', value)} type="date" required />
            <TextField label="Year Of Experience" value={form.experienceYears} onChange={(value) => setValue('experienceYears', value)} type="number" min="0" required />
            <SelectField label="Department" value={form.department} onChange={(value) => setValue('department', value)} options={departments} required />
            <TextField label="Designation" value={form.designation} onChange={(value) => setValue('designation', value)} required />
            <TextField label="Medical License Number" value={form.medicalLicenseNumber} onChange={(value) => setValue('medicalLicenseNumber', value)} required />
            <TextField label="Language Spoken" value={form.languages} onChange={(value) => setValue('languages', value)} placeholder="English, French" />
            <SelectField label="Blood Group" value={form.bloodGroup} onChange={(value) => setValue('bloodGroup', value)} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} required />
            <SelectField label="Gender" value={form.gender} onChange={(value) => setValue('gender', value)} options={['Female', 'Male', 'Other']} required />
          </div>

          <Field label="Bio">
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={form.bio}
              onChange={(event) => setValue('bio', event.target.value)}
              placeholder="About Doctor"
              rows={3}
            />
          </Field>
          <label className="flex w-fit items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={form.featured} onChange={(event) => setValue('featured', event.target.checked)} />
            Feature On Website
          </label>
        </Section>

        <Section title="Address Information">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Address 1" value={form.address1} onChange={(value) => setValue('address1', value)} />
            <TextField label="Address 2" value={form.address2} onChange={(value) => setValue('address2', value)} />
            <TextField label="Country" value={form.country} onChange={(value) => setValue('country', value)} />
            <TextField label="City" value={form.city} onChange={(value) => setValue('city', value)} />
            <TextField label="State" value={form.state} onChange={(value) => setValue('state', value)} />
            <TextField label="Pincode" value={form.pincode} onChange={(value) => setValue('pincode', value)} />
          </div>
        </Section>

        <Section title="Availability">
          <div className="flex flex-wrap gap-1.5">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                aria-pressed={selectedDay === day}
                className={`rounded px-2.5 py-1.5 text-[11px] font-semibold ${selectedDay === day ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {schedule[selectedDay].map((slot, index) => (
              <div key={`${selectedDay}-${index}`} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <SelectField
                  label="Session"
                  value={slot.session}
                  onChange={(value) => updateScheduleSlot(index, 'session', value)}
                  options={['Morning', 'Afternoon', 'Evening']}
                />
                <TextField label="From" type="time" value={slot.from} onChange={(value) => updateScheduleSlot(index, 'from', value)} />
                <TextField label="To" type="time" value={slot.to} onChange={(value) => updateScheduleSlot(index, 'to', value)} />
                <button
                  type="button"
                  aria-label={`Remove ${selectedDay} time slot`}
                  disabled={schedule[selectedDay].length === 1}
                  onClick={() => setSchedule((current) => ({
                    ...current,
                    [selectedDay]: current[selectedDay].filter((_, slotIndex) => slotIndex !== index),
                  }))}
                  className="mb-0.5 rounded border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSchedule((current) => ({
                ...current,
                [selectedDay]: [...current[selectedDay], { session: '', from: '', to: '' }],
              }))}
              className="inline-flex items-center gap-1 rounded bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" /> Add time
            </button>
            <button
              type="button"
              onClick={() => setSchedule((current) => {
                const copiedSlots = current[selectedDay].map((slot) => ({ ...slot }));
                return Object.fromEntries(days.map((day) => [day, copiedSlots.map((slot) => ({ ...slot }))])) as Record<Day, TimeSlot[]>;
              })}
              className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Apply All
            </button>
          </div>
        </Section>

        <Section title="Appointment Information">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="Appointment Type" value={form.appointmentType} onChange={(value) => setValue('appointmentType', value)} options={['In-Person', 'Online', 'Both']} />
            <TextField label="Accept bookings (in Advance) — Days" value={form.advanceBookingDays} onChange={(value) => setValue('advanceBookingDays', value)} type="number" min="0" />
            <TextField label="Appointment Duration — Minutes" value={form.durationMinutes} onChange={(value) => setValue('durationMinutes', value)} type="number" min="1" />
            <TextField label="Consultation Charge" value={form.consultationCharge} onChange={(value) => setValue('consultationCharge', value)} type="number" min="0" required />
            <TextField label="Max Bookings Per Slot" value={form.maxBookingsPerSlot} onChange={(value) => setValue('maxBookingsPerSlot', value)} type="number" min="1" />
          </div>
          <label className="flex w-fit items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={form.showChargeOnBookingPage} onChange={(event) => setValue('showChargeOnBookingPage', event.target.checked)} />
            Display on Booking Page
          </label>
        </Section>

        <Section title="Educational Information">
          <div className="space-y-3">
            {education.map((item, index) => (
              <div key={`education-${index}`} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                <TextField label="Educational Degree" value={item.degree} onChange={(value) => updateRow(setEducation, index, 'degree', value)} />
                <TextField label="University" value={item.university} onChange={(value) => updateRow(setEducation, index, 'university', value)} />
                <TextField label="From" type="date" value={item.from} onChange={(value) => updateRow(setEducation, index, 'from', value)} />
                <TextField label="To" type="date" value={item.to} onChange={(value) => updateRow(setEducation, index, 'to', value)} />
                <button type="button" aria-label="Remove education" onClick={() => setEducation((rows) => rows.filter((_, rowIndex) => rowIndex !== index))} className="mb-0.5 rounded border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setEducation((rows) => [...rows, { degree: '', university: '', from: '', to: '' }])} className="inline-flex items-center gap-1 rounded bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
              <Plus className="h-3.5 w-3.5" /> Add education
            </button>
          </div>
        </Section>

        {([
          ['Awards & Recognition', awards, setAwards],
          ['Certifications', certifications, setCertifications],
        ] as const).map(([title, rows, setRows]) => (
          <Section key={title} title={title}>
            <div className="space-y-3">
              {rows.map((item, index) => (
                <div key={`${title}-${index}`} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <TextField label="Name" value={item.name} onChange={(value) => updateRow(setRows, index, 'name', value)} />
                  <TextField label="From" type="date" value={item.from} onChange={(value) => updateRow(setRows, index, 'from', value)} />
                  <button type="button" aria-label={`Remove ${title}`} onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} className="mb-0.5 rounded border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setRows((current) => [...current, { name: '', from: '' }])} className="inline-flex items-center gap-1 rounded bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                <Plus className="h-3.5 w-3.5" /> Add {title === 'Awards & Recognition' ? 'award' : 'certification'}
              </button>
            </div>
          </Section>
        ))}

        <footer className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button type="button" onClick={() => navigate('/doctors')} className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" style={{ background: 'var(--theme-accent)' }} className="rounded-md px-4 py-2 text-xs font-semibold text-white hover:brightness-90">
            Add Doctor
          </button>
        </footer>
      </form>
    </div>
  );
}
