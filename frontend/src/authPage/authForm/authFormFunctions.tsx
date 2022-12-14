import axios, {AxiosResponse} from 'axios';
import validator from 'email-validator';
import {MouseEventHandler} from 'react';
import {AuthFormState} from './authForm';
const apiAddress = process.env.REACT_APP_APIBASEADDRESS + '/api/';
console.log(apiAddress);

// ---------------------------- JSX Elements -------------------------------//

export function newLogginType(formState: AuthFormState) {
  const loginType = formState.loginType;

  if (loginType === 'login') {
    return 'signup';
  } else {
    return 'login';
  }
}

export function authGreeting(formState: AuthFormState) {
  if (formState.loginType === 'login') {
    return <h1>Welcome Back!</h1>;
  } else {
    return <h1>Welcome!</h1>;
  }
}

export function authInstructions(formState: AuthFormState) {
  if (formState.loginType === 'login') {
    return (
      <p className="authFormSubtitle" id="authInstructions">
        Please sign in below to access your account
      </p>
    );
  } else {
    return (
      <p className="authFormSubtitle" id="authInstructions">
        Please sign up below to get started on JOYR!
      </p>
    );
  }
}

export function formToggleText(
  formState: AuthFormState,
  actionToPerform: MouseEventHandler
) {
  if (formState.loginType === 'login') {
    return (
      <p className="authFormSubtitle" id="formToggleText">
        Don't have an account yet?{' '}
        <span onClick={actionToPerform}>Sign Up</span>
      </p>
    );
  } else {
    return (
      <p className="authFormSubtitle" id="formToggleText">
        Already have an account? <span onClick={actionToPerform}>Sign In</span>
      </p>
    );
  }
}

export function authFormSubmitText(formState: AuthFormState) {
  if (formState.loginType === 'login') {
    return 'Log in';
  } else {
    return 'Sign up';
  }
}

export function authFormFailText(formState: AuthFormState) {
  const failType = formState.formFailure;
  if (!failType) {
    return '';
  } else if (failType === 'empty fields') {
    return 'Please enter both an email and a password';
  } else if (failType === 'email') {
    return 'Please enter a valid email';
  } else if (failType === 'auth') {
    return 'The username or password you’ve entered is incorrect.';
  }
}

// ---------------- form functions ------------------------------///

export function checkSubmission(formState: AuthFormState) {
  const {email, password} = formState;
  const validate = validator.validate;
  console.log(email + ' ' + password);
  if (email && password) {
    if (validate(email)) {
      return 'valid submission';
    } else {
      return {formFailure: 'email'};
    }
  } else {
    return {formFailure: 'empty fields'};
  }
}

export async function apiAuthRequest(formState: AuthFormState) {
  const requestType = formState.loginType;
  const apiAddressToAccess = apiAddress + requestType;
  const formInputs = {
    email: formState.email,
    passwords: formState.password,
  };

  return await axios
    .post(apiAddressToAccess, formInputs)
    .catch(error => console.log(error));
}

export function checkResponseObject(responseObject: AxiosResponse | void) {
  if (responseObject) {
    const responseCode = responseObject.status;
    console.log(responseCode);
    return responseCode === 200 ? true : false;
  } else {
    return false;
  }
}

export async function signInUser(formState: AuthFormState) {
  const userEmail = {
    email: formState.email,
  };
  const apiAddressToAccess = apiAddress + 'home';

  localStorage.setItem('hasEverLoggedIn', 'true');
  await axios
    .post(apiAddressToAccess, userEmail)
    .catch(error => console.log(error));
}
