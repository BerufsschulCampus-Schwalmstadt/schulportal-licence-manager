import React, {Component, FormEvent} from 'react';
import InputComponent from './inputComponent';
import axios from 'axios';
import './loginForm.css';

export default class loginForm extends Component<{}, {authResponse: string}> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {authResponse: 'initial'};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: FormEvent) {
    // Presvemt page refresh which is default
    event.preventDefault();
    axios.post('/login');
  }

  render() {
    // const response = this.state.authResponse;
    return (
      <div id="loginFormWrapper">
        <form id="loginForm" onSubmit={this.handleSubmit}>
          <div className="inputFieldContainer">
            <InputComponent fieldName="username" />
            <InputComponent fieldName="password" />
          </div>
          <button className="primaryButton" name="submit" id="submitButton">
            Export Licenses as CSV
          </button>
        </form>
      </div>
    );
  }
}
