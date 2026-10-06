import React from 'react';

export interface FormLayout01Props {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

export const FormLayout01: React.FC<FormLayout01Props> = ({
  title = 'Register to workspace',
  subtitle = "Take a few moments to register for your company's workspace",
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      onSubmit(event);
      return;
    }

    event.preventDefault();
  };

  return (
    <div className="flex items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-8" noValidate>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="first-name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                First name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="text"
                id="first-name"
                name="first-name"
                autoComplete="given-name"
                placeholder="First name"
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
            </div>

            <div className="col-span-full sm:col-span-3">
              <label htmlFor="last-name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Last name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="text"
                id="last-name"
                name="last-name"
                autoComplete="family-name"
                placeholder="Last name"
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                autoComplete="street-address"
                placeholder="Address"
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="col-span-full sm:col-span-2">
              <label htmlFor="city" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="col-span-full sm:col-span-2">
              <label htmlFor="state" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="col-span-full sm:col-span-2">
              <label htmlFor="postal-code" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Postal code
              </label>
              <input
                id="postal-code"
                name="postal-code"
                autoComplete="postal-code"
                placeholder="Postal code"
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="my-6 h-px w-full bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="whitespace-nowrap rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-3 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/20"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormLayout01;
