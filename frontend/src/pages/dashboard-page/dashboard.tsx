import React, {Component} from 'react';
import {GetAndSetUserInfo} from '../../router';

export default class Dashboard extends Component<GetAndSetUserInfo> {
  render() {
    console.log(this.props.currentUserInfo);
    return (
      <div>
        Current user info:{' '}
        {JSON.stringify(this.props.currentUserInfo.userEmail)}
      </div>
    );
  }
}
