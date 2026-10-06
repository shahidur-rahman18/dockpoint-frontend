import type { SettingsPageConfig } from '../../../types/settings';

export const adminSettingsConfig: SettingsPageConfig = {
  role: 'admin',
  title: 'Settings',
  subtitle: 'Manage your admin account settings, security and preferences',
  tabs: [
    { id: 'profile', label: 'Profile', iconName: 'User', description: 'Basic information and address details' },
    { id: 'security', label: 'Security', iconName: 'Lock', description: 'Change password and security options' },
    { id: 'notifications', label: 'Notifications', iconName: 'Bell', description: 'Manage notification preferences' },
    { id: 'integrations', label: 'Integrations', iconName: 'Link', description: 'Connected apps and APIs' },
  ],
  fields: [
    // Basic Information
    { name: 'profileImage', label: 'Profile Image', type: 'image', section: 'basic', colSpan: 2 },
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name', required: true, section: 'basic', colSpan: 1 },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name', required: true, section: 'basic', colSpan: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address', required: true, section: 'basic', colSpan: 1 },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', required: true, section: 'basic', colSpan: 1 },

    // Address Information
    { name: 'address1', label: 'Address Line 1', type: 'text', placeholder: 'Enter address line 1', section: 'address', colSpan: 1 },
    { name: 'address2', label: 'Address Line 2', type: 'text', placeholder: 'Enter address line 2', section: 'address', colSpan: 1 },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: 'Select Country',
      section: 'address',
      colSpan: 1,
      options: [
        { label: 'United States', value: 'US' },
        { label: 'Bangladesh', value: 'BD' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Canada', value: 'CA' },
      ]
    },
    {
      name: 'state',
      label: 'State',
      type: 'select',
      placeholder: 'Select State',
      section: 'address',
      colSpan: 1,
      options: [
        { label: 'California', value: 'CA' },
        { label: 'Dhaka', value: 'DH' },
        { label: 'New York', value: 'NY' },
      ]
    },
    {
      name: 'city',
      label: 'City',
      type: 'select',
      placeholder: 'Select City',
      section: 'address',
      colSpan: 1,
      options: [
        { label: 'Los Angeles', value: 'LA' },
        { label: 'Dhaka', value: 'DH' },
        { label: 'New York City', value: 'NYC' },
      ]
    },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'Enter pincode', section: 'address', colSpan: 1 },
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
    // Basic Information
    { name: 'profileImage', label: 'Profile Image', type: 'image', section: 'basic', colSpan: 2 },
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name', required: true, section: 'basic', colSpan: 1 },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name', required: true, section: 'basic', colSpan: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address', required: true, section: 'basic', colSpan: 1 },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', required: true, section: 'basic', colSpan: 1 },

    // Address Information
    { name: 'address1', label: 'Address Line 1', type: 'text', placeholder: 'Enter clinic address 1', section: 'address', colSpan: 1 },
    { name: 'address2', label: 'Address Line 2', type: 'text', placeholder: 'Enter clinic address 2', section: 'address', colSpan: 1 },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: 'Select Country',
      section: 'address',
      colSpan: 1,
      options: [
        { label: 'United States', value: 'US' },
        { label: 'Bangladesh', value: 'BD' },
      ]
    },
    {
      name: 'state',
      label: 'State',
      type: 'select',
      placeholder: 'Select State',
      section: 'address',
      colSpan: 1,
      options: [
        { label: 'California', value: 'CA' },
        { label: 'Dhaka', value: 'DH' },
      ]
    },
    {
      name: 'city',
      label: 'City',
      type: 'select',
      placeholder: 'Select City',
      section: 'address',
      colSpan: 1,
      options: [
        { label: 'Los Angeles', value: 'LA' },
        { label: 'Dhaka', value: 'DH' },
      ]
    },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'Enter pincode', section: 'address', colSpan: 1 },
  ]
};
