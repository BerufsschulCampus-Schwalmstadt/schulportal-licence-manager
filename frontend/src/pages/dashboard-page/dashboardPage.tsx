import React, {Component} from 'react';
import {userContext} from '../../globals/app-contexts';
import {Navigate} from 'react-router-dom';

export default class Dashboard extends Component {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  constructor(props: {}) {
    super(props);
  }
  async componentDidMount() {
    await this.context.getUserInfo();
  }

  render() {
    return (
      <div>
        {!this.context.currentUserInfo.authenticated && <Navigate to="/" />}
        Current user info: {JSON.stringify(this.context.currentUserInfo)}
      </div>
    );
  }
}
