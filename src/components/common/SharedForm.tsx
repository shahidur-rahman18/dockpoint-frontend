import { useId, type FormEvent } from 'react';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'password' | 'url' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  min?: string;
  max?: string;
  step?: string;
  rows?: number;
  span?: 'half' | 'full';
  options?: FormFieldOption[];
}

export interface SharedFormProps {
  fields: FormFieldConfig[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  isSubmitDisabled?: boolean;
  errorMessage?: string;
  onSubmit: (values: Record<string, string>, event: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

const fieldClass =
  'mt-1.5 min-h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20';

export function SharedForm({
  fields,
  initialValues = {},
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  isSubmitDisabled = false,
  errorMessage,
  onSubmit,
  onCancel,
}: SharedFormProps) {
  const formId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      fields.map((field) => [field.name, String(formData.get(field.name) ?? '')]),
    );
    onSubmit(values, event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onInput={(event) => {
        event.currentTarget.querySelectorAll('input').forEach((input) => {
          input.setCustomValidity('');
        });
      }}
    >
      {errorMessage && (
        <p
          className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${formId}-${field.name}`;
          const wrapperClass =
            field.span === 'full' ? 'col-span-full' : 'col-span-full sm:col-span-1';
          const commonProps = {
            id,
            name: field.name,
            required: field.required,
            placeholder: field.placeholder,
            autoComplete: field.autoComplete,
            className: field.type === 'textarea' ? `${fieldClass} min-h-24` : fieldClass,
          };

          return (
            <div key={field.name} className={wrapperClass}>
              <label
                htmlFor={id}
                className="block text-xs font-semibold text-[var(--text-secondary)]"
              >
                {field.label}
                {field.required && <span className="ml-1 text-rose-500">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  {...commonProps}
                  defaultValue={initialValues[field.name] ?? ''}
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
                  {...commonProps}
                  rows={field.rows ?? 3}
                  defaultValue={initialValues[field.name] ?? ''}
                />
              ) : (
                <input
                  {...commonProps}
                  type={field.type ?? 'text'}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  defaultValue={initialValues[field.name] ?? ''}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="my-5 h-px w-full bg-[var(--border-color)]" />

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-h-9 cursor-pointer whitespace-nowrap rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)] disabled:cursor-wait disabled:opacity-70"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || isSubmitDisabled}
          style={{ backgroundColor: 'var(--theme-accent)' }}
          className="min-h-9 cursor-pointer whitespace-nowrap rounded-md px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent)] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
