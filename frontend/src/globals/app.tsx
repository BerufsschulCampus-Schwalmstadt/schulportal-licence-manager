import React, {Component} from 'react';
import {userContext} from './app-contexts';
import {UserInfo} from './global-types';
import {
  apiUserInfoRequest,
  logoutUser,
  updateUserInfo,
} from './global-functions';
import {RouterProvider} from 'react-router-dom';
import {appRouter, authRouter} from './router';

export default class App extends Component<{}, {authenticated?: boolean}> {
  public userInfo: UserInfo;
  constructor(props: {}) {
    super(props);
    this.userInfo = {infoAcquired: false};
    this.getUserInfo = this.getUserInfo.bind(this);
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRouterSelection = this.handleRouterSelection.bind(this);
  }

  async componentDidMount() {
    if (!this.userInfo.infoAcquired) {
      this.userInfo.infoAcquired = true;
      await this.getUserInfo();
    }
  }

  async getUserInfo() {
    const response = await apiUserInfoRequest(
      localStorage.getItem('accessToken') as string
    );
    if (response) {
      updateUserInfo(this.handleUserInfoChange, response as UserInfo);
    }
    this.setState({authenticated: false});
    this.userInfo.infoAcquired = true;
  }

  handleUserInfoChange(
    propertyToSet: keyof UserInfo,
    propertyValue: string | boolean
  ) {
    console.log(propertyToSet + ' ' + propertyValue);
    localStorage.setItem(propertyToSet, propertyValue as string);
    if (propertyToSet === 'authenticated') {
      this.userInfo.authenticated = propertyValue as boolean;
      this.setState({authenticated: propertyValue as boolean});
    } else if (propertyToSet === 'userId') {
      this.userInfo.userId = propertyValue as string;
    } else if (propertyToSet === 'userEmail') {
      this.userInfo.userEmail = propertyValue as string;
    } else if (propertyToSet === 'userRole') {
      this.userInfo.userRole = propertyValue as string;
    } else if (propertyToSet === 'accessToken') {
      this.userInfo.accessToken = propertyValue as string;
    }
    this.userInfo.infoAcquired = true;
  }

  async handleLogout() {
    await logoutUser();
    this.userInfo.authenticated = false;
  }

  handleRouterSelection() {
    return this.userInfo.authenticated ? appRouter : authRouter;
  }

  render() {
    const UserInfoGetterAndSetter = {
      currentUserInfo: this.userInfo,
      editUserInfo: this.handleUserInfoChange,
      getUserInfo: this.getUserInfo,
    };

    return (
      <userContext.Provider value={UserInfoGetterAndSetter}>
        {this.userInfo.infoAcquired ? (
          <RouterProvider router={this.handleRouterSelection()} />
        ) : (
          <div></div>
        )}
      </userContext.Provider>
    );
  }
}
