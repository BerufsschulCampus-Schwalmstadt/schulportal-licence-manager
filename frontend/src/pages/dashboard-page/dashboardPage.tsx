import React, {Component} from 'react';
import {userContext} from '../../globals/contexts';
import {GetAndSetUserInfo} from '../../globals/global-types';

export default class Dashboard extends Component {
  static contextType = userContext;
  render() {
    const {...currentUserInfo} = (this.context as GetAndSetUserInfo)
      .currentUserInfo;
    return <div>Current user info: {JSON.stringify(currentUserInfo)}</div>;
  }
}
