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

export default class inputComponent extends Component<{
  fieldName: string;
}> {
  // get properties
  fullProps = new fullPropsObject(this.props.fieldName);

  render() {
    return (
      <div id="inputComponentWrapper">
        <p className="inputLabels">{this.fullProps.label}</p>
        <input
          className="inputFields"
          name={this.fullProps.name}
          id={this.fullProps.id}
          placeholder={this.fullProps.placeholder}
          type={this.fullProps.type}
        ></input>
      </div>
    );
  }
}
