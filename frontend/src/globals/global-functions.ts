import {generateAxiosInstance} from './axios-config';
import {UserInfo, UserInfoEditor} from './global-types';

export async function apiUserInfoRequest(accessToken: string) {
  const refreshRoute = '/dashboard';
  const axios = generateAxiosInstance(accessToken);
  const refreshResponseObject = await axios.get(refreshRoute).catch(error => {
    if (error) {
      console.log('Cannot get user info, make sure the user has logged in');
    }
  });
  if (refreshResponseObject) {
    return refreshResponseObject.data as UserInfo;
  }
  return undefined;
}

export function updateUserInfo(
  userInfoEditor: UserInfoEditor,
  response: UserInfo,
  authenticationStatus: boolean
) {
  console.log(authenticationStatus);
  userInfoEditor('authenticated', authenticationStatus);
  userInfoEditor('userId', response.userId as string);
  userInfoEditor('userEmail', response.userEmail as string);
  userInfoEditor('userRole', response.userRole as string);
  userInfoEditor('accessToken', response.accessToken as string);
}

export async function logoutUser() {
  const axios = generateAxiosInstance();
  await axios.delete('/auth/logout');
}
