import React, {Component} from 'react';
import './inputComponent.css';

class fullPropsObject {
  label: string;
  name: string;
  placeholder: string;
  id: string;
  type: string;

  constructor(fieldName: string) {
    this.label = fieldName;
    this.name = fieldName;
    this.placeholder = 'Enter your S.M.S ' + fieldName;
    this.id = fieldName + 'Input';
    this.type = fieldName.includes('password') ? 'password' : 'text';
  }
}

export default class inputComponent extends Component<{fieldName: string}> {
  constructor(props: {fieldName: string}) {
    super(props);
    this.fullProps = new fullPropsObject(this.props.fieldName);
  }

  getValue() {
    return (document.getElementById(this.fullProps.id) as HTMLInputElement)
      .value;
  }
  // get properties
  fullProps;
  render() {
    const {label, name, placeholder, id, type} = this.fullProps;
    return (
      <div id="inputComponentWrapper">
        <p className="inputLabels">{label}</p>
        <input
          className="inputFields"
          name={name}
          id={id}
          placeholder={placeholder}
          type={type}
        ></input>
      </div>
    );
  }
}
