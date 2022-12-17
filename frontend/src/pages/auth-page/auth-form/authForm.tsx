import React, {Component, FormEvent} from 'react';
import './authForm.css';
import InputComponent from '../../../components/inputComponent';
import validator from 'email-validator';
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
  logoutUser,
  updateUserInfo,
} from './authFormFunctions';
import {Navigate} from 'react-router-dom';
import {GetAndSetUserInfo} from '../../../router';

// ---------------------------  Class Component ------------------------------//

export default class AuthForm extends Component<
  GetAndSetUserInfo,
  AuthFormState
> {
  constructor(props: GetAndSetUserInfo) {
    super(props);
    this.state = new AuthFormState();
    this.handleFormToggle = this.handleFormToggle.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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
        updateUserInfo(this.props.editUserInfo, response);
      } else {
        this.setState({authFaillure: getFaillureType(response)});
      }
    } else {
      this.setState({authFaillure: submission});
    }
  }

  async handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken');
    logoutUser(refreshToken);
    this.setState({authenticated: false});
  }

  // ---------------------------  Rendered HTML ------------------------------//
  authRef = React.createRef();
  render() {
    return (
      <div id="loginFormWrapper">
        {this.props.currentUserInfo.authenticated && (
          <Navigate to="/dashboard" />
        )}
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
