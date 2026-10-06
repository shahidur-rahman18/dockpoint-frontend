export type SettingsTabType = 'profile' | 'password' | 'notifications' | 'integrations' | 'security';

export type SettingsTabItem = {
  id: SettingsTabType;
  label: string;
  iconName: string;
  description?: string;
};

export type FormFieldConfig = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'image' | 'password' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  colSpan?: 1 | 2;
  section: 'basic' | 'address' | 'security' | 'notifications';
};

export type SettingsPageConfig = {
  role: 'admin' | 'doctor' | 'patient' | 'other';
  title: string;
  subtitle?: string;
  tabs: SettingsTabItem[];
  fields: FormFieldConfig[];
};
