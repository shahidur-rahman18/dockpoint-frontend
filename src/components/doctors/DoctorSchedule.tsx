import { useMemo, useState, type FormEvent } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, ChevronDown, Eye, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { doctorsListData } from '../../data/mockData';
import type { DoctorListItem, DoctorProfile } from '../../types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
type TimeSlot = DoctorProfile['schedule'][string][number];

const emptySchedule = (): DoctorProfile['schedule'] =>
  Object.fromEntries(days.map((day) => [day, []]));

function slotIsSet(slot: TimeSlot) {
  return Boolean(slot.from && slot.to);
}

function DoctorScheduleEditor({
  doctor,
  onClose,
  onSave,
}: {
  doctor: DoctorListItem;
  onClose: () => void;
  onSave: (schedule: DoctorProfile['schedule']) => void;
}) {
  const [schedule, setSchedule] = useState<DoctorProfile['schedule']>(() => ({
    ...emptySchedule(),
    ...doctor.profile?.schedule,
  }));

  const updateSlot = (day: string, index: number, key: keyof TimeSlot, value: string) => {
    setSchedule((current) => ({
      ...current,
      [day]: (current[day] ?? []).map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot,
      ),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(schedule);
  };

  return (
    <Modal
      open
      title="Edit Doctor Schedule"
      description={doctor.name}
      size="lg"
      showHeader={false}
      ariaLabelledBy="schedule-editor-title"
      contentClassName="!mt-0 -mx-5 -my-5 sm:-mx-6 sm:-my-6"
      onClose={onClose}
    >
      <div className="max-h-[85vh] overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 id="schedule-editor-title" className="text-base font-bold text-slate-900">
              Edit Doctor Schedule
            </h2>
            <p className="mt-1 text-xs text-slate-500">{doctor.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close schedule editor" className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {days.map((day) => (
            <fieldset key={day} className="space-y-2 border-b border-slate-100 pb-4 last:border-0">
              <legend className="text-xs font-semibold text-slate-800">{day}</legend>
              {(schedule[day] ?? []).map((slot, index) => (
                <div key={`${day}-${index}`} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <label className="space-y-1 text-[11px] font-medium text-slate-600">
                    Session
                    <select
                      value={slot.session}
                      onChange={(event) => updateSlot(day, index, 'session', event.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      <option value="">Select</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-[11px] font-medium text-slate-600">
                    From
                    <input type="time" value={slot.from} onChange={(event) => updateSlot(day, index, 'from', event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs" />
                  </label>
                  <label className="space-y-1 text-[11px] font-medium text-slate-600">
                    To
                    <input type="time" value={slot.to} onChange={(event) => updateSlot(day, index, 'to', event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs" />
                  </label>
                  <button
                    type="button"
                    aria-label={`Remove ${day} time`}
                    onClick={() => setSchedule((current) => ({
                      ...current,
                      [day]: (current[day] ?? []).filter((_, slotIndex) => slotIndex !== index),
                    }))}
                    className="mb-0.5 cursor-pointer rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSchedule((current) => ({
                  ...current,
                  [day]: [...(current[day] ?? []), { session: '', from: '', to: '' }],
                }))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
              >
                <Plus className="h-3.5 w-3.5" /> Add time
              </button>
            </fieldset>
          ))}

          <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white pt-4">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" style={{ background: 'var(--theme-accent)' }} className="cursor-pointer rounded-md px-4 py-2 text-xs font-semibold text-white hover:brightness-90">
              Save Schedule
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  );
}

function ScheduleDetailsModal({
  doctor,
  onClose,
  onSave,
}: {
  doctor: DoctorListItem;
  onClose: () => void;
  onSave: (
    schedule: DoctorProfile['schedule'],
    details: NonNullable<DoctorProfile['scheduleDetails']>,
  ) => void;
}) {
  const [schedule, setSchedule] = useState<DoctorProfile['schedule']>(() => ({
    ...emptySchedule(),
    ...doctor.profile?.schedule,
  }));
  const [details, setDetails] = useState<NonNullable<DoctorProfile['scheduleDetails']>>(
    doctor.profile?.scheduleDetails ?? {
      location: '',
      fromDate: '',
      toDate: '',
      recursEvery: '',
    },
  );
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const daySlots = schedule[selectedDay] ?? [];

  const updateSlot = (index: number, key: keyof TimeSlot, value: string) => {
    setSchedule((current) => ({
      ...current,
      [selectedDay]: (current[selectedDay] ?? []).map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot,
      ),
    }));
  };

  const updateDetails = (key: keyof typeof details, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(schedule, details);
  };

  return (
    <Modal
      open
      title="Schedule Details"
      size="lg"
      showHeader={false}
      ariaLabelledBy="schedule-details-title"
      contentClassName="!mt-0 -mx-5 -my-5 sm:-mx-6 sm:-my-6"
      onClose={onClose}
    >
      <div className="max-h-[85vh] overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
          <h2 id="schedule-details-title" className="text-sm font-semibold text-slate-900">
            Schedule Details
          </h2>
          <button type="button" onClick={onClose} aria-label="Close schedule details" className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
            <img src={doctor.avatar} alt="" className="h-14 w-14 rounded-md object-cover" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-indigo-700">#DT{doctor.id.padStart(4, '0')}</p>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{doctor.name}</h3>
                <span className="rounded border border-indigo-300 px-2 py-0.5 text-[10px] font-medium text-indigo-800">
                  {doctor.department}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-600">
                {doctor.profile?.bio || doctor.designation}
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Schedule Detail</h3>
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="space-y-1 text-[11px] font-medium text-slate-600">
                Location
                <input
                  value={details.location}
                  onChange={(event) => updateDetails('location', event.target.value)}
                  placeholder="Enter location"
                  className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-xs text-slate-800"
                />
              </label>
              <label className="space-y-1 text-[11px] font-medium text-slate-600">
                From
                <input type="date" value={details.fromDate} onChange={(event) => updateDetails('fromDate', event.target.value)} className="w-full min-w-0 rounded-md border border-slate-200 px-2 py-2 text-xs text-slate-800" />
              </label>
              <label className="space-y-1 text-[11px] font-medium text-slate-600">
                To
                <input type="date" value={details.toDate} min={details.fromDate || undefined} onChange={(event) => updateDetails('toDate', event.target.value)} className="w-full min-w-0 rounded-md border border-slate-200 px-2 py-2 text-xs text-slate-800" />
              </label>
              <label className="space-y-1 text-[11px] font-medium text-slate-600">
                Recurs Every
                <select value={details.recursEvery} onChange={(event) => updateDetails('recursEvery', event.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800">
                  <option value="">Select</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Biweekly">Biweekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-3">
            <h3 className="text-xs font-bold text-slate-800">Schedules</h3>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  aria-pressed={selectedDay === day}
                  className={`shrink-0 cursor-pointer rounded px-2.5 py-1.5 text-[11px] font-semibold ${selectedDay === day ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {day}
                </button>
              ))}
            </div>

            {daySlots.length === 0 && (
              <p className="text-xs text-slate-500">No session has been added for {selectedDay}.</p>
            )}
            <div className="space-y-2">
              {daySlots.map((slot, index) => (
                <div key={`${selectedDay}-${index}`} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <label className="space-y-1 text-[11px] font-medium text-slate-600">
                    Session
                    <select value={slot.session} onChange={(event) => updateSlot(index, 'session', event.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs">
                      <option value="">Select</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-[11px] font-medium text-slate-600">
                    From
                    <input type="time" value={slot.from} onChange={(event) => updateSlot(index, 'from', event.target.value)} className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-xs" />
                  </label>
                  <label className="space-y-1 text-[11px] font-medium text-slate-600">
                    To
                    <input type="time" value={slot.to} onChange={(event) => updateSlot(index, 'to', event.target.value)} className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-xs" />
                  </label>
                  <button type="button" aria-label={`Remove ${selectedDay} session`} onClick={() => setSchedule((current) => ({
                    ...current,
                    [selectedDay]: (current[selectedDay] ?? []).filter((_, slotIndex) => slotIndex !== index),
                  }))} className="mb-0.5 cursor-pointer rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label={`Add ${selectedDay} session`}
              onClick={() => setSchedule((current) => ({
                ...current,
                [selectedDay]: [...(current[selectedDay] ?? []), { session: '', from: '', to: '' }],
              }))}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </section>

          <footer className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-md border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" style={{ background: 'var(--theme-accent)' }} className="cursor-pointer rounded-md px-3.5 py-2 text-xs font-semibold text-white hover:brightness-90">
              Save Changes
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  );
}

export function DoctorSchedule() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('recent');
  const [editingDoctor, setEditingDoctor] = useState<DoctorListItem | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<DoctorListItem | null>(null);
  const [, refresh] = useState(0);
  const departments = useMemo(
    () => [...new Set(doctorsListData.map((doctor) => doctor.department))].sort(),
    [],
  );

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    const doctors = doctorsListData.filter((doctor) => {
      const matchesSearch = !query || [doctor.name, doctor.designation, doctor.department, doctor.phone]
        .some((value) => value.toLowerCase().includes(query));
      const hasSchedule = Object.values(doctor.profile?.schedule ?? {}).some((slots) =>
        slots.some(slotIsSet),
      );
      return matchesSearch &&
        (!department || doctor.department === department) &&
        (!availability || (availability === 'scheduled' ? hasSchedule : !hasSchedule));
    });

    if (sort === 'name') return [...doctors].sort((a, b) => a.name.localeCompare(b.name));
    return [...doctors].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
  }, [search, department, availability, sort]);

  const columns = useMemo<ColumnDef<DoctorListItem, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Doctor',
        size: 30,
        cell: ({ row }) => {
          const doctor = row.original;

          return (
            <button
              type="button"
              onClick={() => setViewingDoctor(doctor)}
              className="flex cursor-pointer items-center gap-2.5 text-left"
            >
              <img
                src={doctor.avatar}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover"
              />
              <span>
                <span className="block text-xs font-bold text-slate-800">{doctor.name}</span>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {doctor.designation}
                </span>
              </span>
            </button>
          );
        },
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 15,
        cell: ({ row }) => (
          <span className="text-xs text-slate-600">{row.original.department}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        size: 15,
        cell: ({ row }) => <span className="text-xs text-slate-600">{row.original.phone}</span>,
      },
      {
        id: 'availability',
        header: 'Availability',
        size: 28,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            {days.map((day) => {
              const slots = (row.original.profile?.schedule[day] ?? []).filter(slotIsSet);
              const set = slots.length > 0;
              return (
                <span
                  key={day}
                  title={`${day}${set ? `: ${slots.map((slot) => `${slot.from}-${slot.to}`).join(', ')}` : ': Not set'}`}
                  aria-label={`${day}: ${set ? 'Available' : 'Not set'}`}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${set ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {day[0]}
                </span>
              );
            })}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        size: 12,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setEditingDoctor(row.original)}
              aria-label={`Edit schedule for ${row.original.name}`}
              title="Edit schedule"
              className="cursor-pointer rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-indigo-700"
            >
              <CalendarDays className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewingDoctor(row.original)}
              aria-label={`View ${row.original.name}`}
              title="View schedule details"
              className="cursor-pointer rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-indigo-700"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const saveSchedule = (
    doctor: DoctorListItem,
    schedule: DoctorProfile['schedule'],
    scheduleDetails = doctor.profile?.scheduleDetails,
  ) => {
    const profile: DoctorProfile = doctor.profile ?? {
      username: '',
      dateOfBirth: '',
      experienceYears: '',
      medicalLicenseNumber: '',
      bloodGroup: '',
      gender: '',
      languages: '',
      bio: '',
      featured: false,
      address: { address1: '', address2: '', country: '', city: '', state: '', pincode: '' },
      schedule: emptySchedule(),
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
    };
    doctor.profile = {
      ...profile,
      schedule,
      ...(scheduleDetails ? { scheduleDetails } : {}),
    };
    setEditingDoctor(null);
    setViewingDoctor(null);
    refresh((value) => value + 1);
  };

  const exportCsv = () => {
    const rows = [
      ['Doctor', 'Designation', 'Department', 'Phone', ...days],
      ...filteredDoctors.map((doctor) => [
        doctor.name,
        doctor.designation,
        doctor.department,
        doctor.phone,
        ...days.map((day) => {
          const slots = (doctor.profile?.schedule[day] ?? []).filter(slotIsSet);
          return slots.map((slot) => `${slot.from}-${slot.to}`).join('; ') || 'Not set';
        }),
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'doctor-schedules.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full space-y-5 py-2 sm:py-4">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Doctor Schedule</h1>
          <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
            Total Doctors : {filteredDoctors.length}
          </span>
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:w-auto">
          Export <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <label className="relative block w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search doctors"
            aria-label="Search doctors"
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-indigo-400"
          />
        </label>
        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end">
          <label className="inline-flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)} className="min-w-0 flex-1 cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 sm:flex-none">
              <option value="">All Departments</option>
              {departments.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <select aria-label="Filter by availability" value={availability} onChange={(event) => setAvailability(event.target.value)} className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 sm:w-auto">
            <option value="">All Availability</option>
            <option value="scheduled">Schedule Set</option>
            <option value="unscheduled">Not Set</option>
          </select>
          <label className="flex min-w-0 items-center gap-1 text-xs text-slate-500">
            Sort By:
            <select aria-label="Sort doctors" value={sort} onChange={(event) => setSort(event.target.value)} className="min-w-0 flex-1 cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 sm:flex-none">
              <option value="recent">Recent</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      <DataTable
        data={filteredDoctors}
        columns={columns}
        fixedColumnWidths
        horizontalScrollOnSmallScreens
        initialPageSize={10}
        emptyState={
          <>
            <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-700">No doctors found</p>
            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or filters.
            </p>
          </>
        }
      />

      <p className="border-t border-slate-200/60 pt-3 text-center text-xs font-medium text-slate-500">
        2026 &copy;Preclinic, All Rights Reserved
      </p>

      {editingDoctor && (
        <DoctorScheduleEditor
          doctor={editingDoctor}
          onClose={() => setEditingDoctor(null)}
          onSave={(schedule) => saveSchedule(editingDoctor, schedule)}
        />
      )}
      {viewingDoctor && (
        <ScheduleDetailsModal
          doctor={viewingDoctor}
          onClose={() => setViewingDoctor(null)}
          onSave={(schedule, details) => saveSchedule(viewingDoctor, schedule, details)}
        />
      )}
    </div>
  );
}
