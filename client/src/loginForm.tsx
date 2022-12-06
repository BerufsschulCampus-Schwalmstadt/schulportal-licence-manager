import React, {Component} from 'react';
import InputComponent from './inputComponent';
import './loginForm.css';

export default class loginForm extends Component {
  render() {
    return (
      <form
        id="loginFormWrapper"
        action="http://localhost:3000/login"
        method="POST"
      >
        <InputComponent fieldName="username" />
        <input
          name="username"
          id="usernameInput"
          placeholder="Enter Username"
        ></input>
        <input
          name="password"
          id="passwordInput"
          placeholder="Enter Password"
        ></input>
        <button name="submit" id="submitBttn">
          Export Licence Applications as CSV
        </button>
      </form>
    );
  }
}
