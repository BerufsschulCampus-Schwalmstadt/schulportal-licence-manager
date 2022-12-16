import React, {Component, FormEvent} from 'react';
import './authForm.css';
import InputComponent from '../../../components/inputComponent';
import validator from 'email-validator';
import {user} from '../../../global-types';
import assert from 'assert';
import {
  AuthFormState,
  apiAuthRequest,
  authFormFailText,
  authFormSubmitText,
  authGreeting,
  authInstructions,
  checkSubmission,
  authToggleText,
  getFaillureType,
  newAuthType,
  loginUser,
} from './authFormFunctions';

// ---------------------------  Class Component ------------------------------//

export default class AuthForm extends Component<{}, AuthFormState> {
  constructor(props: {}) {
    super(props);
    this.state = new AuthFormState();
    this.handleFormToggle = this.handleFormToggle.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFormToggle() {
    this.setState({authFaillure: null});
    this.setState({authType: newAuthType(this.state)});
  }

  handleInputs(event: FormEvent): void {
    const trigger = event.target as HTMLInputElement;
    const validate = validator.validate;
    // change state when field is changed
    if (trigger.name === 'email') {
      if (validate(trigger.value)) {
        this.setState({authFaillure: null});
      }
      this.setState({email: trigger.value});
    } else if (trigger.name === 'password') {
      this.setState({password: trigger.value});
    }
  }

  async handleSubmit(event: FormEvent) {
    event.preventDefault();
    this.setState({authFaillure: null});
    console.log(this.state.authType);
    const submission = checkSubmission(this.state);

    if (submission === 'valid submission') {
      const response = await apiAuthRequest(this.state);
      assert(response);
      if (typeof response !== 'number') {
        const accessToken = response.accessToken;
        const refreshToken = response.refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
        await loginUser(accessToken);
      } else {
        this.setState({authFaillure: getFaillureType(response)});
      }
    } else {
      this.setState({authFaillure: submission});
    }
  }

  // ---------------------------  Rendered HTML ------------------------------//

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
            {authToggleText(this.state, this.handleFormToggle)}
          </div>
        </form>
      </div>
    );
  }
}
