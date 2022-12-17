import React, {Component} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import AuthPage from './pages/auth-page/auth';
import Dashboard from './pages/dashboard-page/dashboard';
import {userContext} from './global/contexts';

export type UserInfo = {
  authenticated: boolean;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type UserInfoEditor =
  | ((propertyToSet: keyof UserInfo, propertyValue: string | boolean) => void)
  | undefined;

export type GetAndSetUserInfo = {
  currentUserInfo: UserInfo;
  editUserInfo: UserInfoEditor;
};

export default class App extends Component<{}, UserInfo> {
  constructor(props: {}) {
    super(props);
    this.state = {authenticated: false};
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this);
  }

  handleUserInfoChange(
    propertyToSet: keyof UserInfo,
    propertyValue: string | boolean
  ) {
    if (propertyToSet === 'authenticated') {
      this.setState({authenticated: propertyValue as boolean});
    } else if (propertyToSet === 'userId') {
      this.setState({userId: propertyValue as string});
    } else if (propertyToSet === 'userEmail') {
      this.setState({userEmail: propertyValue as string});
    } else if (propertyToSet === 'userRole') {
      this.setState({userRole: propertyValue as string});
    } else if (propertyToSet === 'accessToken') {
      this.setState({accessToken: propertyValue as string});
    } else if (propertyToSet === 'refreshToken') {
      this.setState({refreshToken: propertyValue as string});
      localStorage.setItem('refreshToken', propertyValue as string);
    }
  }

  render() {
    const UserInfoGetterAndSetter = {
      currentUserInfo: this.state,
      editUserInfo: this.handleUserInfoChange,
    };
    return (
      <userContext.Provider value={UserInfoGetterAndSetter}>
        <RouterProvider router={createMyRouter(UserInfoGetterAndSetter)} />
      </userContext.Provider>
    );
  }
}

function createMyRouter(userInfoGetterAndSetter: GetAndSetUserInfo) {
  return createBrowserRouter([
    {
      path: '/',
      element: <AuthPage {...userInfoGetterAndSetter} />,
    },
    {
      path: '/dashboard/*',
      element: <Dashboard {...userInfoGetterAndSetter} />,
    },
  ]);
}
