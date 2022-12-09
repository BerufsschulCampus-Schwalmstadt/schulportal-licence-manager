import React, {ChangeEvent, Component} from 'react';
import './inputComponent.css';

// ---------------------------  Class Prop def ------------------------------//

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
    this.placeholder = placeholder ? placeholder : 'Enter your S.M.S ' + name;
    this.id = id ? id : name + 'Input';
    this.type = type ? type : 'text';
  }
}

// ---------------------------  Class Component ------------------------------//

export default class inputComponent extends Component<
  InputComponentProps,
  {value: string}
> {
  fullprops: InputComponentProps;
  constructor(props: InputComponentProps) {
    super(props);
    this.fullprops = new InputComponentProps(this.props);
    this.state = {
      value: '',
    };
    this.handlechange = this.handlechange.bind(this);
  }

  // ----------Input event handler
  // handlechange update the current state variable on input
  handlechange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({['value']: event.target.value});
  }

  // -------------rendered HTML
  render() {
    const {name, label, placeholder, id, type} = this.fullprops;
    const {value} = this.state;
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
          value={value}
        ></input>
      </div>
    );
  }
}
