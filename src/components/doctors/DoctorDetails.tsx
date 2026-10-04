import React, { useState } from 'react';
import {
  Award,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { doctorsListData } from '../../data/mockData';

const schedule = [
  { day: 'Monday', slots: ['11:30 AM - 12:30 PM', '04:30 PM - 05:30 PM'] },
  { day: 'Tuesday', slots: ['12:30 PM - 01:30 PM', '06:00 PM - 07:30 PM'] },
  { day: 'Wednesday', slots: ['02:30 PM - 03:30 PM', '07:00 PM - 08:30 PM'] },
  { day: 'Thursday', slots: ['09:00 AM - 11:00 AM'] },
  { day: 'Friday', slots: ['11:00 PM - 11:30 PM'] },
];

const education = [
  { title: 'Boston Medicine Institution - MD', dates: '25 May 1990 - 29 Jan 1992' },
  { title: 'Harvard Medical School, Boston - MBBS', dates: '25 May 1985 - 29 Jan 1990' },
];

const awards = [
  {
    title: 'Top Doctor Award (2023)',
    description: 'Recognized for outstanding achievements in cardiology.',
  },
  {
    title: 'Patient Choice Award (2022)',
    description: 'Awarded for consistently receiving high patient ratings in satisfaction and care.',
  },
];

const certifications = [
  {
    title: 'Certification by the American Board of Cardiology, 2015',
    description: 'Demonstrates mastery of comprehensive, ongoing cardiovascular care.',
  },
  {
    title: 'American Heart Association, 2024',
    description: 'Certification in performing life-saving techniques, including CPR.',
  },
];

export const DoctorDetails: React.FC = () => {
  const { doctorId } = useParams();
  const [selectedDay, setSelectedDay] = useState(schedule[0].day);
  const doctor = doctorsListData.find(({ id }) => id === doctorId);

  if (!doctor) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-lg font-bold text-slate-900">Doctor not found</h1>
        <p className="mt-2 text-sm text-slate-500">The requested doctor profile could not be found.</p>
        <Link
          to="/doctors"
          className="mt-4 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ background: 'var(--theme-accent)' }}
        >
          Back to Doctors
        </Link>
      </section>
    );
  }

  const doctorSchedule = doctor.profile?.schedule;
  const displayedSchedule = doctorSchedule
    ? Object.entries(doctorSchedule).map(([day, slots]) => ({
        day,
        slots: slots
          .filter((slot) => slot.from && slot.to)
          .map((slot) => `${slot.session ? `${slot.session}: ` : ''}${slot.from} - ${slot.to}`),
      }))
    : schedule;
  const selectedSlots = displayedSchedule.find(({ day }) => day === selectedDay)?.slots ?? [];
  const profileDetails = [
    { label: 'Phone Number', value: doctor.phone, Icon: Phone },
    { label: 'Email Address', value: doctor.email, Icon: Mail },
    { label: 'Specialty', value: doctor.department, Icon: Stethoscope },
    { label: 'Availability', value: doctor.status, Icon: UserRound },
  ];
  const hasSupplementalProfile = Boolean(doctor.profile) || doctor.id === doctorsListData[0]?.id;

  return (
    <div className="space-y-5">
      <Link
        to="/doctors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-700"
      >
        <span aria-hidden="true">‹</span>
        Doctors
      </Link>

      <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs sm:flex-row sm:items-center sm:p-6">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="h-28 w-28 shrink-0 rounded-lg bg-slate-100 object-cover sm:h-30 sm:w-30"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">{doctor.name}</h1>
            <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
              {doctor.department}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">MBBS, M.D., {doctor.department}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4" />
              Clinic: Downtown Medical Clinic
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {doctor.status}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-col sm:items-start sm:border-0 sm:pt-0">
          <div>
            <p className="text-sm text-slate-500">Consultation Charge</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {doctor.fees} <span className="text-sm font-normal text-slate-500">/ 30 Min</span>
            </p>
          </div>
          <Link
            to="/appointments"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-90"
            style={{ background: 'var(--theme-accent)' }}
          >
            <CalendarDays className="h-4 w-4" />
            Book Appointment
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-indigo-700" />
              <h2 className="text-lg font-bold text-slate-900">Availability</h2>
            </div>
            <div
              aria-label="Availability by day"
              role="tablist"
              className="flex gap-2 overflow-x-auto border-b border-slate-200"
            >
              {displayedSchedule.map(({ day }) => (
                <button
                  key={day}
                  type="button"
                  role="tab"
                  aria-selected={selectedDay === day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-w-24 shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? 'border-indigo-700 text-indigo-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div role="tabpanel" className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {hasSupplementalProfile && selectedSlots.length > 0 ? (
                selectedSlots.map((slot) => (
                  <div
                    key={slot}
                    className="rounded-md bg-slate-100 px-3 py-2.5 text-center text-sm font-medium text-slate-700"
                  >
                    {slot}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Availability schedule has not been added for this doctor.</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Short Bio</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {doctor.name} is listed in the {doctor.department} department. Contact the clinic for more
              information about this doctor.
            </p>
          </section>

          {hasSupplementalProfile ? (
            <>
              <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-base font-bold text-slate-900">Education Information</h2>
                <ol className="mt-4 space-y-4">
                  {education.map((item, index) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-indigo-700">
                        {index === 0 && <span className="h-1.5 w-1.5 rounded-full bg-indigo-700" />}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.dates}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <InfoSection title="Awards & Recognition" items={awards} Icon={Award} />
              <InfoSection title="Certifications" items={certifications} Icon={Check} />
            </>
          ) : (
            <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900">Additional Information</h2>
              <p className="mt-2 text-sm text-slate-500">
                Education, awards, and certifications have not been added for this doctor.
              </p>
            </section>
          )}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900">About</h2>
          <dl className="mt-4 space-y-4">
            {profileDetails.map(({ label, value, Icon }) => (
              <div key={label} className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <dt className="text-sm font-semibold text-slate-800">{label}</dt>
                  <dd className="mt-0.5 break-words text-sm leading-5 text-slate-500">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
};

interface InfoSectionProps {
  title: string;
  items: { title: string; description: string }[];
  Icon: typeof Award;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, items, Icon }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
    <ul className="mt-3 space-y-3">
      {items.map((item) => (
        <li key={item.title}>
          <h3 className="flex items-start gap-2 text-sm font-semibold text-slate-800">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            {item.title}
          </h3>
          <p className="mt-1 pl-6 text-xs leading-5 text-slate-500">{item.description}</p>
        </li>
      ))}
    </ul>
  </section>
);
