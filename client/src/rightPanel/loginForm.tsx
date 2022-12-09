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
   * The function handles the form submission, and if the credentials are correct, it makes a get
   * request to the server to download the export file
   * @param {FormEvent} event - FormEvent - the event that is triggered when the form is submitted
   */
  async handleSubmit(event: FormEvent): Promise<void> {
    // Prevent form refresh which is default
    event.preventDefault();

    // wrong credentials p element
    const failTextElement = document.getElementById('failTextElement');
    assert(failTextElement);
    failTextElement.style.display = 'none';

    //---- axios post request
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
      this.setState({form: 'load'});
      enableLoadState();

      //---- axios get request
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
