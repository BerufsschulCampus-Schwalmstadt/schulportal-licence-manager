import React, {Component, FormEvent} from 'react';
import fileDownload from 'js-file-download';
import axios from 'axios';
import assert from 'assert';

// local files
import './loginForm.css';
import LoadAnimation from '../lotties/loadanimation.json';

// local elements
import InputComponent from './inputComponent';
import MyLottieElement from './lottieController';

// ---------------------  general helper functions ------------------------//

/**
 * It takes an object and returns a map
 * @param {object} object - the object to convert to a map
 * @returns A map with the keys and values of the passed object.
 */
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

/**
 * It takes an object, converts it to a map, gets the headers object, converts that to a map, gets the
 * content-disposition string, gets the file name from that string, and returns an object with the file
 * name and the data
 * @param {object} exportResponseObject - The response object from the export request.
 * @returns an object with two properties: fileName and fileData.
 */
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

/**
 * It hides all the input components and the submit button
 */
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

// -------------------------- API/Server Requests ----------------------------//

// API accesspoints
const railwayAPIAddress = 'https://spectrum.up.railway.app';
const localAPIAddress = 'http://localhost:3001';

// Address currently being used in the APP
const APIaddress = railwayAPIAddress;

/**
 * It sends a post request to the server with the login credentials, and returns true if the server
 * responds with a 200 status code
 * @param {loginFormState} login - loginFormState
 * @returns A boolean value.
 */
async function APIAuthRequest(
  loginCredentials: loginFormState
): Promise<boolean> {
  /* Get the wrong credentials 'p' (paragraph) element,
  assert that it exists, and then hide it. */
  const failTextElement = document.getElementById('failTextElement');
  assert(failTextElement);
  failTextElement.style.display = 'none';

  //---- axios post (login) request
  /* It's sending a post request to the server with the login credentials,
  and returns true if the server responds with a 200 status code.
  If the response is an error it returns false. */
  const authResponseObject = await axios
    .post(APIaddress + '/api/login', loginCredentials)
    .catch(error => {
      console.log(error);
    });

  if (authResponseObject) {
    const authResponseCode = objectToMap(authResponseObject as object).get(
      'status'
    );
    console.log(authResponseCode);
    if (authResponseCode === 200) {
      return true;
    }
  }

  failTextElement.style.display = 'block';
  return false;
}

/**
 * DownloadCSVFromAPI() is an async function that makes a get request to the
 * API, cleans the response, and then downloads the requested SMS export file
 */
async function DownloadCSVFromAPI(): Promise<void> {
  //---- axios get request
  const exportResponseObject = (await axios
    .get(APIaddress + '/api/CSVExport')
    .catch(error => {
      console.log(error);
    })) as object;

  // cleaned get request response
  const cleanResponseObject = cleanResponse(exportResponseObject);

  // download export file
  fileDownload(cleanResponseObject.fileData, cleanResponseObject.fileName);
}

// ---------------------------  Props and State ------------------------------//

/* It's a class that holds the state of the login form */
export class loginFormState {
  form?: string;
  username?: string | null;
  password?: string | null;

  constructor() {
    this.form = 'initial';
    this.username = null;
    this.password = null;
  }
}

/* It's a class that holds the login form's props */
export class loginFormProps {}

// ---------------------------  Class Component ------------------------------//

/* It's a class component that holds the login form */
export default class loginForm extends Component<
  loginFormProps,
  loginFormState
> {
  constructor(props: loginFormProps) {
    super(props);
    this.state = new loginFormState();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // ----------form input event handler
  /**
   * A function that handles the change of the input fields.
   * @param {FormEvent} e - FormEvent - this is the event that is triggered when
   * the form experiences a change (ex. input).
   */
  handleChange(e: FormEvent): void {
    const eventTriggerValue = (e.target as HTMLInputElement).value;
    const eventTriggerName = (e.target as HTMLInputElement).name;

    // change state when field is changed
    if (eventTriggerName === 'username' || eventTriggerName === 'password') {
      this.setState({[eventTriggerName]: eventTriggerValue});
    }
  }

  // ----------form submission event handler
  /**
   * It's checking if the login credentials are correct. If they are, it sets the state to load, hides
   * the input components and the submit button, and then downloads the export file
   * @param {FormEvent} event - FormEvent - This is the event that is triggered when the form is
   * submitted.
   */
  async handleSubmit(event: FormEvent): Promise<void> {
    // Prevent form refresh which is default
    event.preventDefault();

    //---- axios post request
    const authRequestResult = await APIAuthRequest(this.state);

    /* It's checking if the login credentials are correct. If they are, it sets the state to load,
    hides the input components and the submit button, and then downloads the export file. */
    if (authRequestResult) {
      // set load state
      this.setState({form: 'load'});
      enableLoadState();

      // download file
      await DownloadCSVFromAPI();
    }
  }

  // -------------rendered HTML
  render() {
    return (
      <div id="loginFormWrapper">
        <form
          id="loginForm"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        >
          <div className="loginFormContentWrapper">
            {this.state.form === 'load' && (
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
          {this.state.form === 'load' && (
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
