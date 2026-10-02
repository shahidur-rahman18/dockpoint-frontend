import React from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <DashboardLayout>
      <AdminDashboard />
    </DashboardLayout>
  );
};

export default App;
