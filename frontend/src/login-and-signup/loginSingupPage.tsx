import AuthForm from './authForm/authForm';
import TeaserPanel from './teaserPanel/teaserPanel';
import './loginSingupPage.css';

export default function LoginSingupPage() {
  return (
    <div id="loginSignupPage">
      <TeaserPanel />
      <AuthForm />
    </div>
  );
}
