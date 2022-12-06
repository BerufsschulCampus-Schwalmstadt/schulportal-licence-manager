import React, {Component} from 'react';

export default class loginForm extends Component {
  render() {
    return (
      <form action="http://localhost:3000/login" method="POST">
        <input
          name="username"
          id="userrnameInput"
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
