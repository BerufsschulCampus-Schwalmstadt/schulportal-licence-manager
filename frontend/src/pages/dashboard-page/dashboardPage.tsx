import React, {Component} from 'react';
import {userContext} from '../../global/contexts';
import {GetAndSetUserInfo} from '../../global/global-types';

export default class Dashboard extends Component {
  static contextType = userContext;
  render() {
    const {...currentUserInfo} = (this.context as GetAndSetUserInfo)
      .currentUserInfo;
    return <div>Current user info: {JSON.stringify(currentUserInfo)}</div>;
  }
}
