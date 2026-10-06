import React from 'react';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { doctorSettingsConfig } from '../components/settings/configs/settingsConfig';

export const DoctorSettingsPage: React.FC = () => {
  const initialDoctorData = {
    firstName: 'Dr. John',
    lastName: 'Doe',
    email: 'doctor.johndoe@preclinic.com',
    phoneNumber: '+1 (555) 432-8765',
    address1: '456 Medical Center Dr',
    address2: 'Building B, Floor 3',
    country: 'US',
    state: 'CA',
    city: 'LA',
    pincode: '90045',
  };

  const handleSave = (data: Record<string, any>) => {
    console.log('Saving Doctor Settings:', data);
  };

  return <SettingsLayout config={doctorSettingsConfig} initialData={initialDoctorData} onSave={handleSave} />;
};
