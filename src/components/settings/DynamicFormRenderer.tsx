import React from 'react';
import type { FormFieldConfig } from '../../types/settings';
import { Camera } from 'lucide-react';

interface DynamicFormRendererProps {
  fields: FormFieldConfig[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  section: 'basic' | 'address' | 'security' | 'notifications';
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  fields,
  formData,
  onChange,
  section,
}) => {
  const sectionFields = fields.filter((f) => f.section === section);

  if (sectionFields.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {sectionFields.map((field) => {
        const value = formData[field.name] || '';

        if (field.type === 'image') {
          return (
            <div key={field.name} className="col-span-2 flex items-center gap-5 py-2">
              <label className="text-sm font-medium text-slate-700 w-32">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
                  {value ? (
                    <img src={value} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="Default Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-600 shadow-md transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        onChange(field.name, url);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.name} className={field.colSpan === 2 ? 'col-span-2' : 'col-span-1'}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>
              <select
                value={value}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                <option value="">{field.placeholder || 'Select...'}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <div key={field.name} className={field.colSpan === 2 ? 'col-span-2' : 'col-span-1'}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>
        );
      })}
    </div>
  );
};
