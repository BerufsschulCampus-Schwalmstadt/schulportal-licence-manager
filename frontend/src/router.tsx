import React from 'react';
import {createBrowserRouter} from 'react-router-dom';
import AuthPage from './pages/auth-page/auth';
import Dashboard from './pages/dashboard-page/dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: AuthPage(),
  },
  {
    path: '/dashboard/*',
    element: <Dashboard />,
  },
]);
