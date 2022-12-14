import React from 'react';
import {Component, FormEvent} from 'react';
import './authForm.css';
import InputComponent from '../../components/inputComponent';
import validator from 'email-validator';
import {
  checkSubmission,
  authFormFailText,
  newLogginType,
  authFormSubmitText,
  apiAuthRequest,
  checkResponseObject,
  signInUser,
  authInstructions,
  authGreeting,
  formToggleText,
} from './authFormFunctions';

// ---------------------------  Class Props and State ------------------------------//

/* It's a class that holds the state of the login form */
export class AuthFormState {
  hasEverLoggedIn: boolean;
  loginType: 'login' | 'signup';
  email?: string;
  password?: string;
  formFailure: string | null;

  constructor() {
    this.hasEverLoggedIn =
      localStorage.getItem('hasEverLoggedIn') === 'true' ? true : false;
    this.loginType = this.hasEverLoggedIn ? 'login' : 'signup';
    this.formFailure = null;
  }
}

// ---------------------------  Class Component ------------------------------//

export default class AuthForm extends Component<{}, AuthFormState> {
  constructor(props: {}) {
    super(props);
    this.state = new AuthFormState();
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFormChange() {
    this.setState({formFailure: null});
    this.setState({loginType: newLogginType(this.state)});
  }

  handleInputs(event: FormEvent<HTMLFormElement>): void {
    const trigger = event.target as HTMLInputElement;
    const validate = validator.validate;
    // change state when field is changed
    if (trigger.name === 'email') {
      if (validate(trigger.value)) {
        this.setState({formFailure: null});
      }
      this.setState({email: trigger.value});
    } else if (trigger.name === 'password') {
      this.setState({password: trigger.value});
    }
  }

  async handleSubmit(event: FormEvent) {
    event.preventDefault();
    this.setState({formFailure: null});

    const isValidSubmission = checkSubmission(this.state);

    if (isValidSubmission === 'valid submission') {
      const responseObject = await apiAuthRequest(this.state);
      const authIsSuccessful = checkResponseObject(responseObject);

      if (authIsSuccessful) {
        await signInUser(this.state);
      } else {
        this.setState({formFailure: 'auth'});
      }
    } else {
      const failType = isValidSubmission.formFailure;
      this.setState({formFailure: failType});
    }
  }

  // -------------rendered HTML
  render() {
    return (
      <div id="loginFormWrapper">
        <form
          id="loginForm"
          onChange={this.handleInputs}
          onSubmit={this.handleSubmit}
        >
          <div className="loginFormHeadingContainer">
            {authGreeting(this.state)}
            {authInstructions(this.state)}
          </div>
          <div className="loginFormContentWrapper">
            <div className="inputFieldContainer">
              <InputComponent name="email" />
              <InputComponent name="password" type="password" />
            </div>
          </div>
          <p id="failTextElement">{authFormFailText(this.state)}</p>
          <div className="submissionContainer">
            <button
              className="primaryButton"
              type="submit"
              name="submit"
              id="submitButton"
            >
              {authFormSubmitText(this.state)}
            </button>
            {formToggleText(this.state, this.handleFormChange)}
          </div>
        </form>
      </div>
    );
  }
}
