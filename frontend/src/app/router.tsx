import {Navigate, createBrowserRouter} from 'react-router-dom';
import AuthPage from '../pages/auth-page/authPage';
import Dashboard from '../pages/dashboard-page/dashboardPage';

export const authRouter = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/*',
    element: <Navigate to="/" />,
  },
]);

export const appRouter = createBrowserRouter([
  {
    path: '/dashboard/*',
    element: <Dashboard />,
  },
  {
    path: '/*',
    element: <Navigate to="/dashboard" />,
  },
]);
