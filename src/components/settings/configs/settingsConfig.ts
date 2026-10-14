import type { SettingsPageConfig } from '../../../types/settings';

export const adminSettingsConfig: SettingsPageConfig = {
  role: 'admin',
  title: 'Settings',
  subtitle: 'Manage your admin profile, security and preferences',
  tabs: [
    { id: 'profile', label: 'Profile', iconName: 'User', description: 'Basic account information' },
    { id: 'security', label: 'Security', iconName: 'Lock', description: 'Change password and security options' },
    { id: 'notifications', label: 'Notifications', iconName: 'Bell', description: 'Manage notification preferences' },
    { id: 'integrations', label: 'Integrations', iconName: 'Link', description: 'Connected apps and APIs' },
  ],
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name', required: true, section: 'basic', colSpan: 1 },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name', required: true, section: 'basic', colSpan: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email address', required: true, section: 'basic', colSpan: 1, readOnly: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', required: true, section: 'basic', colSpan: 1 },
  ]
};

export const doctorSettingsConfig: SettingsPageConfig = {
  role: 'doctor',
  title: 'Settings',
  subtitle: 'Manage doctor profile, schedule preferences and account settings',
  tabs: [
    { id: 'profile', label: 'Profile Settings', iconName: 'User', description: 'Doctor personal and practice info' },
    { id: 'password', label: 'Change Password', iconName: 'Key', description: 'Update your login password' },
    { id: 'notifications', label: 'Notifications', iconName: 'Bell', description: 'Appointment alerts and notifications' },
  ],
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name', required: true, section: 'basic', colSpan: 1 },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name', required: true, section: 'basic', colSpan: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email address', required: true, section: 'basic', colSpan: 1, readOnly: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', required: true, section: 'basic', colSpan: 1 },
    { name: 'specialization', label: 'Specialization', type: 'text', placeholder: 'Enter specialization', section: 'basic', colSpan: 1 },
    { name: 'qualification', label: 'Qualification', type: 'text', placeholder: 'Enter qualification', section: 'basic', colSpan: 1 },
    { name: 'consultationFee', label: 'Consultation Fee', type: 'text', placeholder: 'Enter consultation fee', section: 'basic', colSpan: 1 },
    { name: 'chamberAddress', label: 'Chamber Address', type: 'text', placeholder: 'Enter chamber address', section: 'address', colSpan: 2 },
  ]
};
