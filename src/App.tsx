import React from 'react';
import { RouterProvider } from 'react-router/dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router/routes';
import { AuthProvider } from './auth/AuthContext';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </>
    </AuthProvider>
  );
};

export default App;