import {AxiosError, AxiosResponse} from 'axios';
import {generateAxiosInstance} from './axios-config';
import {UserInfo, UserInfoEditor} from './global-types';

export async function apiUserInfoRequest() {
  const refreshRoute = '/refresh';
  const axios = generateAxiosInstance();
  const refreshResponseObject = await axios.get(refreshRoute).catch(error => {
    console.log(error.toJSON() as AxiosError);
  });

  const response = (refreshResponseObject as AxiosResponse).data;
  return response as UserInfo | undefined;
}

export function updateUserInfo(
  userInfoEditor: UserInfoEditor,
  response: UserInfo
) {
  userInfoEditor('authenticated', true);
  userInfoEditor('userId', response.userId as string);
  userInfoEditor('userEmail', response.userEmail as string);
  userInfoEditor('userRole', response.userRole as string);
  userInfoEditor('accessToken', response.accessToken as string);
}

export async function logoutUser() {
  const axios = generateAxiosInstance();
  await axios.delete('/auth/logout');
}
