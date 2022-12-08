import React, {Component, FormEvent} from 'react';
import InputComponent from './inputComponent';
import './loginForm.css';
import fileDownload from 'js-file-download';
import axios from 'axios';

function objectToMap(object: object) {
  // start a new map
  const map = new Map();

  // get the (passed) object's keys and values
  const keys = Object.keys(object);
  const values = Object.values(object);

  // map each key to the value in the object
  for (let i = 0; i < keys.length; i++) {
    map.set(keys[i], values[i]);
  }

  return map;
}

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
        //console.log(this.state);
      }
    }
  }

  async handleSubmit(event: FormEvent) {
    // Presvemt page refresh which is default
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    const authResponseObject = (await axios
      .post('/login', this.state)
      .catch(error => {
        // if login fails
        console.log(error);
        const authFailTextElement = document.createElement('p');
        authFailTextElement.textContent =
          'Login to the SMS failed, please try again using your SMS credentials';
        authFailTextElement.id = 'authFailText';
        document
          .getElementById('passwordInput')
          ?.parentElement?.append(authFailTextElement);
      })) as object;

    // if login succeds
    if (objectToMap(authResponseObject).get('status') === 200) {
      const authFailTextElement = document.getElementById('AuthFailText');
      if (authFailTextElement) {
        authFailTextElement.style.display = 'none';
      }

      const exportResponseObject = (await axios
        .get('/CSVExport')
        .catch(error => {
          console.log(error);
        })) as object;

      const exportResponseMap = objectToMap(exportResponseObject);
      const responseHeadersObject = exportResponseMap.get('headers') as object;
      const contenDisposition: string = objectToMap(responseHeadersObject).get(
        'content-disposition'
      );
      const substringStart: number = contenDisposition.indexOf('"') + 1;
      const substringEnd: number = contenDisposition.length - 1;
      const fileName = contenDisposition.substring(
        substringStart,
        substringEnd
      );
      const fileData = exportResponseMap.get('data');
      fileDownload(fileData, fileName);
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
