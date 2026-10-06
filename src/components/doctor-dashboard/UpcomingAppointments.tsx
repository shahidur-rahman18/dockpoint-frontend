import {
  ArrowRight,
  CalendarPlus,
  MessageCircle,
  Video,
} from 'lucide-react';
import { doctorUpcomingAppointmentsData } from '../../data/doctorMockData';

export const UpcomingAppointments = () => (
  <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
    <div className="mb-5 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-slate-900">Upcoming Appointments</h2>
        <p className="mt-1 text-xs text-slate-500">Your next scheduled patient visits</p>
      </div>
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:text-indigo-900"
      >
        View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>

    <div className="divide-y divide-slate-100">
      {doctorUpcomingAppointmentsData.map((appointment) => (
        <article key={appointment.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={appointment.avatar}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-800">
                  {appointment.patientName}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  ID: {appointment.patientId}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">
                {appointment.department}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                {appointment.consultationType}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                <CalendarPlus className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {appointment.time}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 sm:pl-14">
            <button
              type="button"
              className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800"
            >
              Start Appointment
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Chat Now
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-700"
            >
              <Video className="h-3.5 w-3.5" aria-hidden="true" />
              Video Consultation
            </button>
          </div>
        </article>
      ))}
    </div>
  </section>
);
