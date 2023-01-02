import React, {Component, createRef} from 'react';
import IconButton from '../../icon-button/iconButton';
import '../dropdown.css';
import {defaultOptionalDropdownProps} from '../dropdown-types';
import {
  CheckboxListDropdownProps,
  CheckboxListDropdownState,
} from './checkboxList-dropdown-types';
import {
  checkboxClickToggle,
  generateCheckboxOptions,
  listItemClickToggle,
} from './checkboxList-dropdown-functions';

export default class CheckboxListDropdown extends Component<
  CheckboxListDropdownProps,
  CheckboxListDropdownState
> {
  static defaultProps = defaultOptionalDropdownProps;
  private componentRef = createRef<HTMLDivElement>();
  constructor(props: CheckboxListDropdownProps) {
    super(props);
    this.handleDropdownButtonClick = this.handleDropdownButtonClick.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleDocumentClickClose = this.handleDocumentClickClose.bind(this);
    this.state = {
      listVisibility: 'closed',
      selectedOption: 0,
      options: generateCheckboxOptions(
        this.props,
        this.handleCheckboxChange,
        this.handleListItemClick
      ),
    };
  }

  handleDropdownButtonClick(event: React.MouseEvent) {
    event.stopPropagation();
    if (this.state.listVisibility === 'open') {
      document.removeEventListener('click', this.handleDocumentClickClose);
      this.setState({listVisibility: 'closed'});
    } else {
      document.addEventListener('click', this.handleDocumentClickClose);
      this.setState({listVisibility: 'open'});
    }
  }

  handleListItemClick(event: React.FormEvent) {
    event.stopPropagation();
    listItemClickToggle(event, this.props.columnToSelectEditor);
    this.setState({listVisibility: 'open'});
  }

  handleCheckboxChange(event: React.FormEvent) {
    event.stopPropagation();
    checkboxClickToggle(event, this.props.columnToSelectEditor);
    this.setState({listVisibility: 'open'});
  }

  handleDocumentClickClose(event: MouseEvent) {
    event.stopPropagation();
    this.setState({listVisibility: 'closed'});
  }

  componentDidUpdate(
    prevProps: Readonly<CheckboxListDropdownProps>,
    prevState: Readonly<CheckboxListDropdownState>
  ): void {
    if (
      JSON.stringify(prevProps.indicesToSelect) !==
      JSON.stringify(this.props.indicesToSelect)
    ) {
      this.setState({
        options: generateCheckboxOptions(
          this.props,
          this.handleCheckboxChange,
          this.handleListItemClick
        ),
      });
    }
  }

  render() {
    const {
      id,
      listItems,
      iconName,
      iconColor,
      fillColor,
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
          size={size}
        />
        <div
          className="dropdownList"
          style={{display: listVisibility === 'open' ? 'flex' : 'none'}}
          ref={this.componentRef}
        >
          {this.state.options}
        </div>
      </div>
    );
  }
}
