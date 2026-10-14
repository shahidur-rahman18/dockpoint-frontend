import React, { useEffect, useState } from 'react';
import { Camera, Trash2, UserRound } from 'lucide-react';
import { DynamicFormRenderer } from '../DynamicFormRenderer';
import type { FormFieldConfig } from '../../../types/settings';

interface ProfileSectionProps {
  fields: FormFieldConfig[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  avatarUrl?: string | null;
  pendingAvatarFile: File | null;
  avatarRemovalPending: boolean;
  avatarBusy?: boolean;
  avatarError?: string | null;
  onAvatarSelect: (image: File) => void;
  onAvatarRemove: () => void;
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  fields,
  formData,
  onChange,
  avatarUrl,
  pendingAvatarFile,
  avatarRemovalPending,
  avatarBusy = false,
  avatarError = null,
  onAvatarSelect,
  onAvatarRemove,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);
  const shownAvatarUrl = previewUrl ?? (avatarRemovalPending ? null : avatarUrl ?? null);

  useEffect(() => {
    if (!pendingAvatarFile) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(pendingAvatarFile);
    setPreviewUrl(nextPreviewUrl);
    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [pendingAvatarFile]);

  useEffect(() => {
    setAvatarImageFailed(false);
  }, [shownAvatarUrl]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    event.target.value = '';
    setLocalError(null);

    if (!image) return;
    if (!ALLOWED_AVATAR_TYPES.has(image.type)) {
      setLocalError('Choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (image.size > MAX_AVATAR_SIZE) {
      setLocalError('Avatar image must be 5 MB or smaller.');
      return;
    }

    onAvatarSelect(image);
  };

  const handleAvatarRemove = () => {
    setLocalError(null);
    onAvatarRemove();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          <p className="mt-1 text-sm text-slate-500">
            {onAvatarSelect || fields.some((field) => field.type === 'image')
              ? 'Update your photo and personal details.'
              : 'Manage your personal and professional details.'}
          </p>
        </div>
        <div className="pt-5">
          {onAvatarSelect && (
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {shownAvatarUrl && !avatarImageFailed ? (
                  <img
                    src={shownAvatarUrl}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                    onError={() => setAvatarImageFailed(true)}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-slate-400">
                    <UserRound className="h-9 w-9" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="min-w-48 flex-1">
                <p className="text-sm font-medium text-slate-800">Profile photo</p>
                <p className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP. Maximum 5 MB.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-900 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-800 ${avatarBusy ? 'pointer-events-none opacity-60' : ''}`}>
                    <Camera className="h-4 w-4" aria-hidden="true" />
                    {avatarUrl || pendingAvatarFile ? 'Change photo' : 'Upload photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={avatarBusy}
                      onChange={handleAvatarChange}
                    />
                  </label>
                  {(avatarUrl || pendingAvatarFile) && !avatarRemovalPending && (
                    <button
                      type="button"
                      onClick={handleAvatarRemove}
                      disabled={avatarBusy}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className=" h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {(localError || avatarError) && (
            <p role="alert" className="mb-4 text-sm text-rose-700">
              {avatarError || localError}
            </p>
          )}
          <DynamicFormRenderer fields={fields} formData={formData} onChange={onChange} section="basic" />
        </div>
      </div>

      {fields.some((field) => field.section === 'address') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-semibold text-slate-900">Address Information</h2>
            <p className="mt-1 text-sm text-slate-500">Where can people reach you or your clinic?</p>
          </div>
          <div className="pt-5">
            <DynamicFormRenderer fields={fields} formData={formData} onChange={onChange} section="address" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
