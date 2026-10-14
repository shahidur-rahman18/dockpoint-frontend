import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { CircleAlert } from 'lucide-react';
import { LoaderOne } from '../common/LoaderOne';
import type { SettingsPageConfig, SettingsTabType } from '../../types/settings';
import { IntegrationsSection } from './sections/IntegrationsSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { PasswordSection } from './sections/PasswordSection';
import { ProfileSection } from './sections/ProfileSection';

interface SettingsLayoutProps {
  config: SettingsPageConfig;
  initialData?: Record<string, any>;
  onSave?: (data: Record<string, any>) => Promise<void> | void;
  isSaving?: boolean;
  saveError?: string | null;
  avatarUrl?: string | null;
  avatarBusy?: boolean;
  avatarError?: string | null;
  onAvatarUpload?: (image: File) => Promise<void>;
  onAvatarRemove?: () => Promise<void>;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  config,
  initialData = {},
  onSave,
  isSaving = false,
  saveError = null,
  avatarUrl,
  avatarBusy = false,
  avatarError = null,
  onAvatarUpload,
  onAvatarRemove,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [avatarRemovalPending, setAvatarRemovalPending] = useState(false);

  const settingsBasePath = config.role === 'doctor' ? '/doctor-dashboard/settings' : '/settings';
  const requestedSection = location.pathname.slice(settingsBasePath.length + 1);
  const activeTab = config.tabs.some((tab) => tab.id === requestedSection)
    ? requestedSection as SettingsTabType
    : config.tabs[0]?.id ?? 'profile';

  const handleFieldChange = (name: string, value: any) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (pendingAvatarFile) {
        await onAvatarUpload?.(pendingAvatarFile);
      } else if (avatarRemovalPending) {
        await onAvatarRemove?.();
      }
      await onSave?.(formData);
      setPendingAvatarFile(null);
      setAvatarRemovalPending(false);
      toast.success('Changes saved successfully.', { position: 'bottom-right' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save your settings.';
      setSubmitError(message);
      toast.error(message, { position: 'bottom-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSaving || isSubmitting || avatarBusy;

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection
            fields={config.fields}
            formData={formData}
            onChange={handleFieldChange}
            avatarUrl={avatarUrl}
            pendingAvatarFile={pendingAvatarFile}
            avatarRemovalPending={avatarRemovalPending}
            avatarBusy={isBusy}
            avatarError={avatarError}
            onAvatarSelect={(image) => {
              setPendingAvatarFile(image);
              setAvatarRemovalPending(false);
            }}
            onAvatarRemove={() => {
              setPendingAvatarFile(null);
              setAvatarRemovalPending(true);
            }}
          />
        );
      case 'security':
      case 'password':
        return <PasswordSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'integrations':
        return <IntegrationsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{config.title}</h1>
        {config.subtitle && <p className="mt-1 text-sm text-slate-500">{config.subtitle}</p>}
      </header>

      {(saveError || submitError) && (
        <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <CircleAlert className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{saveError || submitError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {renderActiveSection()}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => navigate(`${settingsBasePath}/${activeTab}`)}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="cursor-pointer rounded-lg bg-indigo-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {isBusy && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-8 py-6 shadow-lg" role="status" aria-live="polite">
            <LoaderOne />
            <p className="text-sm font-medium text-slate-600">Saving your changes...</p>
          </div>
        </div>
      )}
    </div>
  );
};
