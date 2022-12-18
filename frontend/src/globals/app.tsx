import React, {Component} from 'react';
import {RouterProvider} from 'react-router-dom';
import {userContext} from './contexts';
import {UserInfo} from './global-types';
import router from './router';

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
        <RouterProvider router={router} />
      </userContext.Provider>
    );
  }
}
