import React from 'react';
import {ChangeEvent, Component} from 'react';
import './inputComponent.css';

// ---------------------------  Class Prop def ------------------------------//

/* A class that defines the props that will be passed to the component. */
class InputComponentProps {
  name: string;
  label?: string;
  placeholder?: string;
  id?: string;
  type?: string;

  constructor(passedProps: InputComponentProps) {
    const {name, label, placeholder, id, type} = passedProps;
    this.name = name;
    this.label = label ? label : name;
    this.placeholder = placeholder
      ? placeholder
      : 'Enter your ' + name + ' here';
    this.id = id ? id : name + 'Input';
    this.type = type ? type : 'text';
  }
}

/* A class that holds the state of the component. */
class InputComponentState {
  inputFieldValue: string;

  constructor() {
    this.inputFieldValue = '';
  }
}

// ---------------------------  Class Component ------------------------------//

export default class inputComponent extends Component<
  InputComponentProps,
  InputComponentState
> {
  fullprops: InputComponentProps;
  constructor(props: InputComponentProps) {
    super(props);
    this.fullprops = new InputComponentProps(this.props);
    this.state = new InputComponentState();
    this.handlechange = this.handlechange.bind(this);
  }

  // ----------Input event handler
  /**
   * A function that handles the change of the input fields.
   * @param {ChangeEvent<HTMLInputElement>} event -
   * ChangeEvent<HTMLInputElement> - this is the event that
   * is triggered when the input field changes
   */
  handlechange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({inputFieldValue: event.target.value});
  }

  // -------------rendered HTML
  render() {
    const {name, label, placeholder, id, type} = this.fullprops;
    const {inputFieldValue} = this.state;
    return (
      <div id="inputComponentWrapper">
        <p className="inputLabels">{label}</p>
        <input
          className="inputFields"
          name={name}
          id={id}
          placeholder={placeholder}
          type={type}
          onChange={this.handlechange}
          value={inputFieldValue}
        ></input>
      </div>
    );
  }
}
