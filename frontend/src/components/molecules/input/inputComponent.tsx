import React from 'react';
import {ChangeEvent, Component} from 'react';
import './inputComponent.css';
import {Icon, IconName} from '@blueprintjs/core';
import {getIconSize} from '../icon-button/iconButton-functions';
import {size} from '../../../globals/global-types';

// ---------------------------  Class Prop def ------------------------------//

/* A class that defines the props that will be passed to the component. */

class InputComponentProps {
  name: string;
  icon?: IconName;
  label?: boolean;
  labelText?: string;
  size?: size;
  outlined?: string;
  boxshadow?: boolean;
  filled?: string;
  placeholder?: string;
  id?: string;
  type?: string;

  constructor(passedProps: InputComponentProps) {
    const {
      name,
      icon,
      label,
      outlined,
      filled,
      boxshadow,
      size,
      labelText,
      placeholder,
      id,
      type,
    } = passedProps;
    this.name = name;
    this.icon = icon;
    if (label) {
      this.labelText = labelText || name;
    }
    this.boxshadow = boxshadow;
    this.outlined = outlined ? outlined : '0px';
    this.size = size ? size : 'md';
    this.filled = filled;
    this.placeholder = placeholder
      ? placeholder
      : 'Enter your ' + name + ' here';
    this.id = id ? id : name + 'Input';
    this.type = type ? type : 'text';
  }
}

/* A class that holds the state of the component. */
type InputComponentState = {
  inputFieldValue: string;
};

// ---------------------------  Class Component ------------------------------//

export default class InputComponent extends Component<
  InputComponentProps,
  InputComponentState
> {
  fullprops: InputComponentProps;
  constructor(props: InputComponentProps) {
    super(props);
    this.fullprops = new InputComponentProps(this.props);
    this.state = {inputFieldValue: ''};
    this.handlechange = this.handlechange.bind(this);
  }

  handlechange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({inputFieldValue: event.target.value});
  }

  // -------------rendered HTML
  render() {
    const {
      name,
      icon,
      outlined,
      filled,
      size,
      boxshadow,
      labelText,
      placeholder,
      id,
      type,
    } = this.fullprops;
    const {inputFieldValue} = this.state;
    const iconSize = getIconSize(size as string);
    const fontSize = iconSize + 'px';
    let borderRadius;
    if (size === 'md') {
      borderRadius = '7px';
    } else if (size === 'lg') {
      borderRadius = '14px';
    } else {
      borderRadius = '6px';
    }

    let iconPosition;

    if (size === 'md') {
      iconPosition = {transform: 'translateY(7px)', marginLeft: '25px'};
    } else if (size === 'sm') {
      iconPosition = {transform: 'translateY(1px)', marginLeft: '15px'};
    }

    return (
      <div
        className="inputComponentWrapper"
        style={{gap: labelText ? '9.11px' : 0}}
      >
        <p className="inputLabels">{labelText}</p>
        <Icon icon={icon} size={iconSize} style={iconPosition} />
        <input
          className="inputFields"
          name={name}
          id={id}
          placeholder={placeholder}
          type={type}
          onChange={this.handlechange}
          value={inputFieldValue}
          style={{
            border: outlined,
            fontSize: fontSize,
            padding: icon
              ? size === 'sm'
                ? '10px 20px 10px 55px'
                : '10px 20px 10px 80px'
              : '9px 18px',
            background: filled ? filled : 'transparent',
            boxShadow: boxshadow ? '0px 4px 30px rgba(0, 0, 0, 0.05)' : 'none',
            borderRadius: borderRadius,
          }}
        ></input>
      </div>
    );
  }
}
