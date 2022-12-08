import React, {ChangeEvent, Component} from 'react';
import './inputComponent.css';

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

export default class inputComponent extends Component<
  InputComponentProps,
  {value: string}
> {
  fullprops: InputComponentProps;
  constructor(props: InputComponentProps) {
    super(props);
    this.fullprops = new InputComponentProps(this.props as InputComponentProps);
    this.state = {
      value: '',
    };
    this.handlechange = this.handlechange.bind(this);
  }

  handlechange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({['value']: event.target.value});
  }

  // get properties
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
