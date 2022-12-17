import React from 'react';
import AuthForm from './auth-form/authForm';
import TeaserPanel from './teaser-panel/teaserPanel';
import './auth.css';
import {GetAndSetUserInfo} from '../../router';

export default function AuthPage(props: GetAndSetUserInfo) {
  return (
    <div id="loginSignupPage">
      <TeaserPanel />
      <AuthForm {...props} />
    </div>
  );
}
