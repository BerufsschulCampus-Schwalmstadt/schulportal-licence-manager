import React, {Component, FormEvent} from 'react';
import InputComponent from './inputComponent';
import './loginForm.css';
import fileDownload from 'js-file-download';
import axios from 'axios';
import assert from 'assert';

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

function cleanResponse(exportResponseObject: object): {
  fileName: string;
  fileData: string;
} {
  const exportResponseMap = objectToMap(exportResponseObject);
  const responseHeadersObject = exportResponseMap.get('headers') as object;
  const contentDisposition: string = objectToMap(responseHeadersObject).get(
    'content-disposition'
  );
  const substringStart: number = contentDisposition.indexOf('"') + 1;
  const substringEnd: number = contentDisposition.length - 1;
  return {
    fileName: contentDisposition.substring(substringStart, substringEnd),
    fileData: exportResponseMap.get('data'),
  };
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

  handlechange(e: FormEvent) {
    const inputField = e.target as HTMLInputElement;

    // change state when field is changed
    if (inputField.name === 'username') {
      this.setState({['username']: inputField.value});
    } else if (inputField.name === 'password') {
      this.setState({['password']: inputField.value});
    }
  }

  async handleSubmit(event: FormEvent) {
    // Prevent form refresh which is default
    event.preventDefault();

    // wrong credentials p element
    const failTextElement = document.getElementById('failTextElement');
    assert(failTextElement);
    failTextElement.style.display = 'none';

    // axios post request
    const authResponseObject = (await axios
      .post('/login', this.state)
      .catch(error => {
        console.log(error);
        failTextElement.style.display = 'block';
      })) as object;

    // post request response code
    const authResponseCode = objectToMap(authResponseObject).get('status');
    console.log(authResponseCode);

    // axios get request
    const exportResponseObject = (await axios.get('/CSVExport').catch(error => {
      console.log(error);
    })) as object;

    // cleaned get request response
    const cleanResponseObject = cleanResponse(exportResponseObject);

    // download export file
    fileDownload(cleanResponseObject.fileData, cleanResponseObject.fileName);
  }

  render() {
    return (
      <div id="loginFormWrapper">
        <form
          id="loginForm"
          onChange={this.handlechange}
          onSubmit={this.handleSubmit}
        >
          <div className="loginFormContentWrapper">
            <div className="inputFieldContainer">
              <InputComponent name="username" />
              <InputComponent name="password" type="password" />
            </div>
            <div className="failTextContainer">
              <p id="failTextElement">
                The username or password you’ve entered is incorrect.{' '}
              </p>
            </div>
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
