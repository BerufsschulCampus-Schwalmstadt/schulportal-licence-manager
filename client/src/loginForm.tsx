import React, {Component, FormEvent} from 'react';
import './loginForm.css';
import fileDownload from 'js-file-download';
import axios from 'axios';
import assert from 'assert';

// local/created elements
import InputComponent from './inputComponent';
import MyLottieElement from './myLottieElement';
import LoadAnimation from './lotties/loadanimation.json';

// ---------------------  general helper functions ------------------------//

// objectToMap takes in any object and returns it in a map format
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

// cleanResponse takes in a response object and returns a clean object
// with the original response objects file name and data
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

// enableLoadState does the required dom manipulations to clear
// the way for load state elements
function enableLoadState(): void {
  // get reactinputcomponents
  const inputComponentsToHide = document.querySelector(
    '.loginFormContentWrapper'
  )?.children as HTMLCollectionOf<HTMLElement>;

  // hide reactinputcomponents
  if (inputComponentsToHide) {
    for (let i = 0; i < inputComponentsToHide?.length; i++) {
      inputComponentsToHide[i].style.display = 'none';
    }
  }

  // get submit button and hide it
  (document.querySelector('#submitButton') as HTMLButtonElement).style.display =
    'none';
}

// ---------------------------  Classe Component ------------------------------//

export default class loginForm extends Component<
  {},
  {formState: string; username: string | null; password: string | null}
> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      formState: 'initial',
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password'),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlechange = this.handlechange.bind(this);
  }

  // ----------form input event handler
  // handlechange update the current state variables on input
  handlechange(e: FormEvent) {
    const inputField = e.target as HTMLInputElement;

    // change state when field is changed
    if (inputField.name === 'username') {
      this.setState({username: inputField.value});
    } else if (inputField.name === 'password') {
      this.setState({password: inputField.value});
    }
  }

  // ----------form submission event handler
  // handleSubmit sends a post request for (login) that's followed
  // by a get request (for file export) if the initial
  // post call was successfull
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

    if (authResponseCode === 200) {
      // if no error was encountered set load state
      this.setState({formState: 'load'});
      enableLoadState();

      // axios get request
      const exportResponseObject = (await axios
        .get('/CSVExport')
        .catch(error => {
          console.log(error);
        })) as object;

      // cleaned get request response
      const cleanResponseObject = cleanResponse(exportResponseObject);

      // download export file
      fileDownload(cleanResponseObject.fileData, cleanResponseObject.fileName);
    }
  }

  // -------------rendered HTML
  render() {
    return (
      <div id="loginFormWrapper">
        <form
          id="loginForm"
          onChange={this.handlechange}
          onSubmit={this.handleSubmit}
        >
          <div className="loginFormContentWrapper">
            {this.state.formState === 'load' && (
              <MyLottieElement animationData={LoadAnimation} />
            )}
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
          {this.state.formState === 'load' && (
            <p id="loadText">We’re working on it...</p>
          )}
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
// when auth is back check if onclick on the button is better on submit
// ex. check if file downloads automatically now that we don't need "prevent default"
