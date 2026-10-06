import React from 'react';
import { DynamicFormRenderer } from '../DynamicFormRenderer';
import type { FormFieldConfig } from '../../../types/settings';

interface ProfileSectionProps {
  fields: FormFieldConfig[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ fields, formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          <p className="mt-1 text-sm text-slate-500">Update your photo and personal details.</p>
        </div>
        <div className="pt-5">
          <DynamicFormRenderer fields={fields} formData={formData} onChange={onChange} section="basic" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Address Information</h2>
          <p className="mt-1 text-sm text-slate-500">Where can people reach you or your clinic?</p>
        </div>
        <div className="pt-5">
          <DynamicFormRenderer fields={fields} formData={formData} onChange={onChange} section="address" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
