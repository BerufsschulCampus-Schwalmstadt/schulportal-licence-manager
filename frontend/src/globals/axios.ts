import axios from 'axios';

export function generateAxiosInstance(accessToken?: string) {
  const authAxios = axios.create();
  authAxios.defaults.headers.common['authorization'] = accessToken;
  authAxios.defaults.withCredentials = true;
  authAxios.defaults.baseURL = process.env.REACT_APP_APIBASEADDRESS + '/api';
  console.log(authAxios);
  return authAxios;
}
