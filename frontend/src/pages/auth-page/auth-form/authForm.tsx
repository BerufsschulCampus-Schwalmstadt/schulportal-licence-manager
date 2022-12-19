import React, {Component, FormEvent} from 'react';
import './authForm.css';
import InputComponent from '../../../components/inputComponent';
import validator from 'email-validator';
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
} from './authFormFunctions';
import {userContext} from '../../../globals/app-contexts';
import {GetAndSetUserInfo} from '../../../globals/global-types';
import {updateUserInfo} from '../../../globals/global-functions';

// ---------------------------  Class Component ------------------------------//

export default class AuthForm extends Component<{}, AuthFormState> {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

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
    const submission = checkSubmission(this.state);

    if (submission === 'valid submission') {
      const response = await apiAuthRequest(this.state);
      if (typeof response !== 'number') {
        const userInfoEditor = (this.context as GetAndSetUserInfo).editUserInfo;
        updateUserInfo(userInfoEditor, response);
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
