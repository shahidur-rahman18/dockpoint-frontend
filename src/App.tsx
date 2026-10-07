import React from 'react';
import { RouterProvider } from 'react-router/dom';
import { router } from './router/routes';
import { AuthProvider } from './auth/AuthContext';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;