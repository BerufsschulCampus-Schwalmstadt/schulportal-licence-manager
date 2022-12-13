import {Component, FormEvent} from 'react';
import './authForm.css';
import InputComponent from './inputComponent';
import {newLogginType} from './authFormFunctions';
import {
  checkSubmission,
  authFormHeader,
  authFormSubtitle,
  authFormFailText,
  authFormSubmitText,
  apiAuthRequest,
  checkResponseObject,
  signInUser,
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
    this.setState({loginType: newLogginType(this.state)});
  }

  handleInputs(event: FormEvent<HTMLFormElement>): void {
    const trigger = event.target as HTMLInputElement;

    // change state when field is changed
    if (trigger.name === 'email') {
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
            {authFormHeader(this.state)}
            {authFormSubtitle(this.state, this.handleFormChange)}
          </div>
          <div className="loginFormContentWrapper">
            <div className="inputFieldContainer">
              <InputComponent name="email" />
              <InputComponent name="password" type="password" />
            </div>
            <div className="failTextContainer">
              <p id="failTextElement">{authFormFailText(this.state)}</p>
            </div>
          </div>
          <div className="submissionContainer">
            <button
              className="primaryButton"
              type="submit"
              name="submit"
              id="submitButton"
            >
              {authFormSubmitText(this.state)}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
