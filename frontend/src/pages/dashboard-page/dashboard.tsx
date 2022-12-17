import React, {Component} from 'react';
import {GetAndSetUserInfo} from '../../router';
import {userContext} from '../../global/contexts';

export default class Dashboard extends Component<GetAndSetUserInfo> {
  render() {
    return (
      <userContext.Provider value={this.props}>
        <div>
          Current user info:{' '}
          {JSON.stringify(this.props.currentUserInfo.userEmail)}
        </div>
      </userContext.Provider>
    );
  }
}
