import React from 'react';
import {createBrowserRouter} from 'react-router-dom';
import AuthPage from '../pages/auth-page/authPage';
import Dashboard from '../pages/dashboard-page/dashboardPage';
import {AxiosError, AxiosResponse} from 'axios';
import {UserInfo} from './global-types';
import {generateAxiosInstance} from './axios';

export async function getNewAccessToken() {
  const refreshRoute = '/refresh';
  const axios = generateAxiosInstance();
  const refreshResponseObject = await axios.get(refreshRoute).catch(error => {
    console.log(error.toJSON() as AxiosError);
  });

  if (refreshResponseObject) {
    const newAccessToken = (
      (refreshResponseObject as AxiosResponse).data as UserInfo
    ).accessToken as string;

    return newAccessToken;
  }
}

export async function testAuth(accessToken: string) {
  // navigate
  const authAxios = generateAxiosInstance(accessToken);
  return (await authAxios.get('/dashboard')).status === 200 ? true : false;
}

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
