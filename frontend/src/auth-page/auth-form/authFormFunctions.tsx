import React, {MouseEventHandler} from 'react';
import axios, {AxiosError, AxiosResponse} from 'axios';
import validator from 'email-validator';
import {user} from '../../global-types';
const apiAddress = process.env.REACT_APP_APIBASEADDRESS;
console.log(apiAddress);

// ---------------- Constants (type, class, object) -------------------------//

export type authFaillure =
  | null
  | 'missing content'
  | 'email not valid'
  | 'auth failed'
  | 'user not found'
  | 'user already exists'
  | 'request not supported';

export const authFaillures = {
  // form
  204: 'missing content',
  422: 'email not valid',
  // signin
  401: 'auth failed',
  404: 'user not found',
  // signup
  409: 'user already exists',
  // server
  500: 'request not supported',
};

export class AuthFormState {
  hasEverLoggedIn: boolean;
  loginType: 'login' | 'signup';
  email?: string;
  password?: string;
  authFaillure: authFaillure;

  constructor() {
    this.hasEverLoggedIn =
      localStorage.getItem('hasEverLoggedIn') === 'true' ? true : false;
    this.loginType = this.hasEverLoggedIn ? 'login' : 'signup';
    this.authFaillure = null;
  }
}

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
        Please sign in below to continue!
      </p>
    );
  } else {
    return (
      <p className="authFormSubtitle" id="authInstructions">
        Please sign up below to get started!
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
        Don't have an account yet? {''}
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
  const failType = formState.authFaillure;
  if (!failType) {
    return '';
  } else if (failType === 'missing content') {
    return 'Please enter both an email and a password';
  } else if (failType === 'email not valid') {
    return 'Please enter a valid email';
  } else if (failType === 'user not found') {
    return 'No user exists with that email';
  } else if (failType === 'user already exists') {
    return 'An account already exists with that email';
  } else if (failType === 'auth failed') {
    return 'The password you have entered is invalid';
  } else if (failType === 'request not supported') {
    return "Sorry we're experiencing issues";
  }
}

// ---------------------- util function -------------------------///

/**
 * It checks if the form state is valid, and if it is, it returns
 * a string saying so, otherwise it returns a string saying
 * why it's not valid
 * @param {AuthFormState} formState - AuthFormState
 * @returns A string or an object
 */
export function checkSubmission(
  formState: AuthFormState
): 'valid submission' | authFaillure {
  const {email, password} = formState;
  const validate = validator.validate;
  console.log(email + ' ' + password);
  if (email && password) {
    if (validate(email)) {
      return 'valid submission';
    } else {
      return 'email not valid';
    }
  } else {
    return 'missing content';
  }
}

// export function objectToMap(object: object): Map<string, any> {
//   const map = new Map();
//   const keys = Object.keys(object);
//   const values = Object.values(object);

//   // map each key to the value in the object
//   for (let i = 0; i < keys.length; i++) {
//     map.set(keys[i], values[i]);
//   }
//   return map;
// }

// ----------------- API/Server access functions ---------------///

/**
 * It takes a form state object, and returns a user object
 * or an error code
 * @param {AuthFormState} formState - AuthFormState - This is the
 * state of the form that the user is submitting.
 * @returns a promise that resolves to either a user object or an error code.
 */
export async function apiAuthRequest(formState: AuthFormState) {
  const requestType = formState.loginType;
  const apiAddressToAccess = apiAddress + '/api/auth/' + requestType;
  const formInputs = {
    email: formState.email,
    password: formState.password,
  };

  const responseObject = (await axios
    .post(apiAddressToAccess, formInputs)
    .catch(error => {
      return error.toJSON();
    })) as AxiosResponse | AxiosError;

  const status = responseObject.status;

  if (status === 200) {
    return (responseObject as AxiosResponse).data as user;
  } else if (typeof status === 'number') {
    return status;
  } else {
    return 500;
  }
}

/**
 * It takes a response status code and returns the corresponding authFaillure type
 * @param {number | string} responseStatus - The response status code from the server.
 * @returns The value of the key in the object that matches the responseStatus.
 */
export function getFaillureType(responseStatus: number | string): authFaillure {
  if (typeof responseStatus === 'number') {
    responseStatus = String(responseStatus);
  }
  const failCodes = Object.keys(authFaillures);
  const index = failCodes.indexOf(responseStatus);
  return Object.values(authFaillures)[index] as authFaillure;
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
