import type { FormEvent } from 'react';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'password' | 'url' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  min?: string;
  max?: string;
  span?: 'half' | 'full';
  options?: FormFieldOption[];
}

export interface FormLayout01Props {
  title?: string;
  subtitle?: string;
  fields: FormFieldConfig[];
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: (values: Record<string, string>, event: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

export function FormLayout01({
  title = 'Register to workspace',
  subtitle,
  fields,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
}: FormLayout01Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      fields.map((field) => [field.name, String(formData.get(field.name) ?? '')]),
    );

    onSubmit(values, event);
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {fields.map((field) => {
              const id = `form-${field.name}`;
              const className =
                'mt-2 h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)] shadow-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20';
              const wrapperClass =
                field.span === 'full' ? 'col-span-full' : 'col-span-full sm:col-span-1';

              return (
                <div key={field.name} className={wrapperClass}>
                  <label
                    htmlFor={id}
                    className="text-sm font-medium text-[var(--text-secondary)]"
                  >
                    {field.label}
                    {field.required && <span className="ml-1 text-rose-500">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={id}
                      name={field.name}
                      className={className}
                      required={field.required}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {field.placeholder ?? 'Select an option'}
                      </option>
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={id}
                      name={field.name}
                      className={`${className} h-auto min-h-24 py-2`}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      required={field.required}
                    />
                  ) : (
                    <input
                      id={id}
                      name={field.name}
                      type={field.type ?? 'text'}
                      className={className}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      min={field.min}
                      max={field.max}
                      required={field.required}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="my-6 h-px w-full bg-[var(--border-color)]" />

          <div className="flex items-center justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="whitespace-nowrap rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="submit"
              style={{ backgroundColor: 'var(--theme-accent)' }}
              className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)]"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormLayout01;
