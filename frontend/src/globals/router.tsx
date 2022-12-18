import React from 'react';
import {createBrowserRouter} from 'react-router-dom';
import AuthPage from '../pages/auth-page/authPage';
import Dashboard from '../pages/dashboard-page/dashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/dashboard/*',
    element: <Dashboard />,
  },
]);

export default router;
