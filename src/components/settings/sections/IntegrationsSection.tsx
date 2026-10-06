import React from 'react';
import { Link2 } from 'lucide-react';

export const IntegrationsSection: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Link2 className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Third-Party Integrations</h2>
          <p className="text-sm text-slate-500">Connect external services and APIs.</p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
        No active integrations. Connect Google Calendar or Zoom for appointment sync.
      </div>
    </div>
  );
};

export default IntegrationsSection;
