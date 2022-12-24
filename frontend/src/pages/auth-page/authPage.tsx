import React, {Component} from 'react';
import AuthForm from './auth-form/authForm';
import TeaserPanel from './teaser-panel/teaserPanel';
import './authPage.css';
import {userContext} from '../../app/userContext';

export default class AuthPage extends Component {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  render() {
    return (
      <div id="loginSignupPage">
        <TeaserPanel />
        <AuthForm />
      </div>
    );
  }
}
