import AuthForm from './authForm/authForm';
import TeaserPanel from './teaserPanel/teaserPanel';
import './authPage.css';

export default function AuthPage() {
  return (
    <div id="loginSignupPage">
      <TeaserPanel />
      <AuthForm />
    </div>
  );
}
