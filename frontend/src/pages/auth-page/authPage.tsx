import React, {Component} from 'react';
import AuthForm from './auth-form/authForm';
import TeaserPanel from './teaser-panel/teaserPanel';
import './authPage.css';
import {userContext} from '../../globals/app-contexts';
import {Navigate} from 'react-router-dom';

export default class AuthPage extends Component {
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
      <div id="loginSignupPage">
        {this.context.currentUserInfo.authenticated && (
          <Navigate to="/dashboard" />
        )}
        <TeaserPanel />
        <AuthForm />
      </div>
    );
  }
}
