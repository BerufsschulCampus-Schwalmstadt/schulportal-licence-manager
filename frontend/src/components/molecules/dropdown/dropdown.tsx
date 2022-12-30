import React, {Component} from 'react';
import IconButton from '../icon-button/iconButton';
import './dropdown.css';
import {
  DropdownState,
  FullDropdownProps,
  defaultOptionalDropdownProps,
} from './dropdown-types';
import {generateOptions} from './dropdown-functions';

export default class Dropdown extends Component<
  FullDropdownProps,
  DropdownState
> {
  static defaultProps = defaultOptionalDropdownProps;
  constructor(props: FullDropdownProps) {
    super(props);
    this.state = {
      listVisibility: 'closed',
      selectedOption: 0,
    };
    this.handleDropdownButtonClick = this.handleDropdownButtonClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDocumentClickClose = this.handleDocumentClickClose.bind(this);
  }

  handleDropdownButtonClick(event: React.MouseEvent) {
    event.stopPropagation();
    if (this.state.listVisibility === 'open') {
      document.removeEventListener('click', this.handleDocumentClickClose);
      this.handleSelect(event.target as HTMLElement);
      this.setState({listVisibility: 'closed'});
    } else {
      document.addEventListener('click', this.handleDocumentClickClose);
      this.setState({listVisibility: 'open'});
    }
  }

  handleDocumentClickClose(event: MouseEvent) {
    event.stopPropagation();
    this.handleSelect(event.target as HTMLElement);
    this.setState({listVisibility: 'closed'});
  }

  handleSelect(trigger: HTMLElement) {
    const triggerText = trigger.textContent;
    console.log(triggerText);
    if (!triggerText) return;
    const selectionIndex = this.props.listItems.indexOf(triggerText);
    if (selectionIndex === undefined || selectionIndex === -1) return;
    this.setState({selectedOption: selectionIndex});
  }

  render() {
    const {
      fillColor,
      iconColor,
      iconName,
      id,
      listItems,
      outlineColor,
      size,
      clickHandler,
    } = this.props;
    const {listVisibility, selectedOption} = this.state;

    return (
      <div
        className="dropDownWrapper"
        id={id}
        onClick={this.handleDropdownButtonClick}
      >
        <IconButton
          iconName={iconName}
          buttonText={{
            text: listItems[selectedOption],
            textColor: 'black',
            textPosition: 'front',
          }}
          clickHandler={clickHandler}
          iconColor={iconColor}
          outlineColor={outlineColor}
          fillColor={fillColor}
          isDropdown={true}
          size={'sm'}
        />
        <div
          className="dropdownList"
          style={{display: listVisibility === 'open' ? 'flex' : 'none'}}
        >
          {generateOptions(listItems, size, this.state.selectedOption)}
        </div>
      </div>
    );
  }
}
