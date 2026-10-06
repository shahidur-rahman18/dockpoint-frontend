import React, { useState } from 'react';
import type { SettingsPageConfig, SettingsTabType } from '../../types/settings';
import { SettingsTabs } from './SettingsTabs';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import { Key, Bell, CheckCircle2 } from 'lucide-react';

interface SettingsLayoutProps {
  config: SettingsPageConfig;
  initialData?: Record<string, any>;
  onSave?: (data: Record<string, any>) => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  config,
  initialData = {},
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>(config.tabs[0]?.id || 'profile');
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{config.title}</h1>
        {config.subtitle && <p className="text-sm text-slate-500 mt-1">{config.subtitle}</p>}
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings saved successfully! Changes have been updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <SettingsTabs
            tabs={config.tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main Content Form Area */}
        <div className="lg:col-span-9 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'profile' && (
              <>
                {/* Basic Information Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-semibold text-slate-900">Basic Information</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Update your photo and personal details.</p>
                  </div>
                  <DynamicFormRenderer
                    fields={config.fields}
                    formData={formData}
                    onChange={handleFieldChange}
                    section="basic"
                  />
                </div>

                {/* Address Information Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-semibold text-slate-900">Address Information</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Where can people reach you or your clinic?</p>
                  </div>
                  <DynamicFormRenderer
                    fields={config.fields}
                    formData={formData}
                    onChange={handleFieldChange}
                    section="address"
                  />
                </div>
              </>
            )}

            {activeTab === 'security' || activeTab === 'password' ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Ensure your account is using a secure password.</p>
                  </div>
                </div>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Notification Preferences</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Choose what updates you want to receive.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Email Notifications', desc: 'Receive email updates about appointments and reminders.' },
                    { title: 'SMS Alerts', desc: 'Get text alerts for urgent schedule changes.' },
                    { title: 'Promotional Offers', desc: 'Receive news about new features and discounts.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-slate-800">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-semibold text-slate-900">Third-Party Integrations</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Connect external services and APIs.</p>
                </div>
                <div className="text-sm text-slate-600 py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  No active integrations. Connect Google Calendar or Zoom for appointment sync.
                </div>
              </div>
            )}

            {/* Form Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-indigo-900 hover:bg-indigo-800 text-sm font-medium text-white shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
