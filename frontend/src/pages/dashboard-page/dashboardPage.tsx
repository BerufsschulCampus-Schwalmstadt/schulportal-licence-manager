import React, {Component} from 'react';
import {userContext} from '../../globals/app-contexts';

export default class Dashboard extends Component {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  render() {
    return (
      <div>
        Current user info: {JSON.stringify(this.context.currentUserInfo)}
      </div>
    );
  }
}
