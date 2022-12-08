import React, {Component} from 'react';
import InputComponent from './inputComponent';
import './loginForm.css';
import axios from 'axios';

export default class loginForm extends Component<
  {},
  {username: string | null; password: string | null}
> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlechange = this.handlechange.bind(this);
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Presvemt page refresh which is default
    event.preventDefault();

    axios
      .post('/login', this.state)
      .then(response => console.log(response))
      .catch(error => {
        console.log(error);
      });
  }

  handlechange() {
    const reactInputComponents =
      document.getElementById('loginForm')?.children[0].children;

    if (reactInputComponents) {
      for (let i = 0; i < reactInputComponents.length; i++) {
        const htmlInputField = reactInputComponents[i]
          .children[1] as HTMLInputElement;

        // if id matches set state
        if (htmlInputField.id === 'usernameInput') {
          this.setState({username: htmlInputField.value});
          localStorage.setItem('username', htmlInputField.value);
        } else if (htmlInputField.id === 'passwordInput') {
          this.setState({password: htmlInputField.value});
          localStorage.setItem('password', htmlInputField.value);
        }
        console.log(this.state);
      }
    }
  }

  render() {
    return (
      <div id="loginFormWrapper">
        <form
          id="loginForm"
          onChange={this.handlechange}
          onSubmit={this.handleSubmit}
        >
          <div className="inputFieldContainer">
            <InputComponent fieldName="username" />
            <InputComponent fieldName="password" />
          </div>
          <button
            className="primaryButton"
            type="submit"
            name="submit"
            id="submitButton"
          >
            Export Licenses as CSV
          </button>
        </form>
      </div>
    );
  }
}
