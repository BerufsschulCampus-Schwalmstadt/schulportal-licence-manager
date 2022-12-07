import React, {Component} from 'react';
import InputComponent from './inputComponent';
import './loginForm.css';

export default class loginForm extends Component {
  render() {
    return (
      <div id="loginFormWrapper">
        <form id="loginForm" action="http://localhost:3001/login" method="POST">
          <div className="inputFieldContainer">
            <InputComponent fieldName="username" />
            <InputComponent fieldName="password" />
          </div>
          <button className="primaryButton" name="submit" id="submitButton">
            Export Licenses as cSV
          </button>
        </form>
      </div>
    );
  }
}
