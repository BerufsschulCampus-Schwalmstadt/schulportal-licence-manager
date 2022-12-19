import React, {Component} from 'react';
import {RouterProvider} from 'react-router-dom';
import {userContext} from './app-contexts';
import {UserInfo} from './global-types';
import router from './router';
import {
  apiUserInfoRequest,
  logoutUser,
  updateUserInfo,
} from './global-functions';

export default class App extends Component<{}, UserInfo> {
  constructor(props: {}) {
    super(props);
    this.state = {authenticated: false};
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  async getUserInfo() {
    const response = await apiUserInfoRequest();
    if (response) {
      updateUserInfo(this.handleUserInfoChange, response, true);
    } else {
      this.setState({authenticated: false});
    }
  }

  handleUserInfoChange(
    propertyToSet: keyof UserInfo,
    propertyValue: string | boolean
  ) {
    localStorage.setItem(propertyToSet, propertyValue as string);
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
    }
  }

  async handleLogout() {
    logoutUser();
    this.setState({authenticated: false});
  }

  render() {
    const UserInfoGetterAndSetter = {
      currentUserInfo: this.state,
      editUserInfo: this.handleUserInfoChange,
      getUserInfo: this.getUserInfo,
    };
    return (
      <userContext.Provider value={UserInfoGetterAndSetter}>
        <RouterProvider router={router} />
      </userContext.Provider>
    );
  }
}
