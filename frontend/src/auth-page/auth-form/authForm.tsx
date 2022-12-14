import React, {Component, FormEvent} from 'react';
import './authForm.css';
import InputComponent from '../../components/inputComponent';
import validator from 'email-validator';
import {user} from '../../global-types';
import assert from 'assert';
import {
  AuthFormState,
  apiAuthRequest,
  authFormFailText,
  authFormSubmitText,
  authGreeting,
  authInstructions,
  checkSubmission,
  formToggleText,
  getFaillureType,
  newLogginType,
} from './authFormFunctions';

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
    this.setState({authFaillure: null});
    this.setState({loginType: newLogginType(this.state)});
  }

  handleInputs(event: FormEvent<HTMLFormElement>): void {
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

    const submission = checkSubmission(this.state);

    if (submission === 'valid submission') {
      const response = await apiAuthRequest(this.state);
      assert(response);
      if (typeof response !== 'number') {
        const user = response as user;
        console.log(user);
        // await signInUser(this.state);
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
            {formToggleText(this.state, this.handleFormChange)}
          </div>
        </form>
      </div>
    );
  }
}
