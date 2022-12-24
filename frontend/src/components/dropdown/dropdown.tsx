import React, {Component} from 'react';
import IconButton from '../icon-button/iconButton';
import './dropdown.css';
import assert from 'assert';
import {DropdownProps} from './dropdownFunctions';
import {getIconSize} from '../icon-button/IconButtonFunctions';

export default class Dropdown extends Component<
  DropdownProps,
  {listVisible: 'none' | 'flex'}
> {
  constructor(props: DropdownProps) {
    super(props);
    this.state = {listVisible: 'none'};
    this.handleclick = this.handleclick.bind(this);
  }

  createOptions() {}

  handleclick() {
    if (this.state.listVisible === 'none') {
      this.setState({listVisible: 'flex'});
      document.addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
        this.handleclick;
      });
    } else if (this.state.listVisible === 'flex') {
      console.log('heylo');
      this.setState({listVisible: 'none'});
      document.removeEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
        this.handleclick;
      });
    }
  }

  render() {
    const {
      id,
      options,
      iconName,
      clickHandler,
      colour,
      filled,
      outlined,
      size,
    } = new DropdownProps(this.props);
    assert(iconName);
    assert(options);

    return (
      <div className="dropDownWrapper" id={id}>
        <IconButton
          iconName={iconName}
          buttonText={{text: options[0], textPosition: 'front'}}
          clickHandler={this.handleclick}
          colour={colour}
          outlined={outlined}
          filled={filled}
        />
        <div className="dropdownList" style={{display: this.state.listVisible}}>
          <p
            style={{fontSize: String(getIconSize(size as string)) + 'px'}}
            className="dropdownListItem"
          >
            {this.props.options}
          </p>
        </div>
      </div>
    );
  }
}
