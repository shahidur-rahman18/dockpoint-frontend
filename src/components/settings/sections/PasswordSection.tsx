import React from 'react';
import { Key } from 'lucide-react';

export const PasswordSection: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Key className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
          <p className="text-sm text-slate-500">Ensure your account is using a secure password.</p>
        </div>
      </div>

      <div className="max-w-xl space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Current Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordSection;
