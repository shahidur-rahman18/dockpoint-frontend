import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { DoctorListItem } from '../../types';

interface EditDoctorDrawerProps {
  open: boolean;
  doctor: DoctorListItem | null;
  onClose: () => void;
  onSave: (doctor: DoctorListItem) => void;
}

export function EditDoctorDrawer({
  open,
  doctor,
  onClose,
  onSave,
}: EditDoctorDrawerProps) {
  const [formData, setFormData] = useState<DoctorListItem>(
    doctor ?? {
      id: '',
      name: '',
      designation: '',
      department: '',
      phone: '',
      email: '',
      fees: '',
      status: 'Available',
      avatar: '',
    },
  );

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const handleChange = (field: keyof DoctorListItem, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        aria-label="Close drawer"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 bg-black/50 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Edit Doctor</h2>
            <p className="text-[11px] text-slate-400">Update doctor information</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form className="flex-1 space-y-4 overflow-y-auto p-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <img
              src={formData.avatar || '/placeholder-avatar.png'}
              alt={formData.name}
              className="h-16 w-16 shrink-0 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Avatar URL
              </label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => handleChange('avatar', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Designation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Fees
            </label>
            <input
              type="text"
              value={formData.fees}
              onChange={(e) => handleChange('fees', e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'Available' | 'Unavailable')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </form>

        <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{ background: 'var(--theme-accent)' }}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-xs hover:brightness-90 transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </footer>
      </aside>
    </div>
  );
}