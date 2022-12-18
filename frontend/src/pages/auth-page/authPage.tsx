import React from 'react';
import AuthForm from './auth-form/authForm';
import TeaserPanel from './teaser-panel/teaserPanel';
import './auth.css';

export default function AuthPage() {
  return (
    <div id="loginSignupPage">
      <TeaserPanel />
      <AuthForm />
    </div>
  );
}
