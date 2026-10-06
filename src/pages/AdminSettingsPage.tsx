import React from 'react';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { adminSettingsConfig } from '../components/settings/configs/settingsConfig';

export const AdminSettingsPage: React.FC = () => {
  const initialAdminData = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@preclinic.com',
    phoneNumber: '+1 (555) 019-2834',
    address1: '123 Healthcare Ave',
    address2: 'Suite 400',
    country: 'US',
    state: 'CA',
    city: 'LA',
    pincode: '90001',
  };

  const handleSave = (data: Record<string, any>) => {
    console.log('Saving Admin Settings:', data);
  };

  return <SettingsLayout config={adminSettingsConfig} initialData={initialAdminData} onSave={handleSave} />;
};
