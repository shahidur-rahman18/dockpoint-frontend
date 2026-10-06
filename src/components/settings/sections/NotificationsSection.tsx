import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationsSection: React.FC = () => {
  const items = [
    { title: 'Email Notifications', description: 'Receive email updates about appointments and reminders.' },
    { title: 'SMS Alerts', description: 'Get text alerts for urgent schedule changes.' },
    { title: 'Promotional Offers', description: 'Receive news about new features and discounts.' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Bell className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
          <p className="text-sm text-slate-500">Choose what updates you want to receive.</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0 last:pb-0">
            <div>
              <div className="text-sm font-medium text-slate-800">{item.title}</div>
              <div className="mt-1 text-xs text-slate-500">{item.description}</div>
            </div>
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSection;
