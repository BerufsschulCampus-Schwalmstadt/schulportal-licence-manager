import React, {Component} from 'react';
import './tableConfigMenu.css';
import Dropdown from '../../../molecules/dropdown/dropdown';
import {IconName} from '@blueprintjs/core';
import {
  configMenuProps,
  configMenuState,
  initializeScrollContainer,
  updateConfigMenuScroll,
} from './tableConfigFunctions';
import InputComponent from '../../../molecules/input/inputComponent';
import IconButton from '../../../molecules/icon-button/iconButton';
import CheckboxListDropdown from '../../../molecules/dropdown/checkboxList-dropdown/checkboxListDropdown';

export default class TableConfigMenu extends Component<
  Partial<configMenuProps>,
  configMenuState
> {
  constructor(props: configMenuProps) {
    super(props);
    this.state = {scrolled: false};
    this.handleScrolling = this.handleScrolling.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('resize', this.handleScrolling);
    initializeScrollContainer();
  }

  handleScrolling() {
    const valueToSet = updateConfigMenuScroll(this.state);
    if (valueToSet) this.setState(valueToSet);
  }

  render() {
    const {inputHandler, inputName} = this.props;
    const inputNameToSet = inputName ? inputName : 'searchAndFilter';
    let nextButtonText: 'Back' | 'More',
      textPosition: 'back' | 'front',
      icon: IconName;
    if (this.state.scrolled) {
      nextButtonText = 'Back';
      textPosition = 'back';
      icon = 'chevron-left';
    } else {
      nextButtonText = 'More';
      textPosition = 'front';
      icon = 'chevron-right';
    }

    return (
      <div className="tableConfigContainer" onInput={inputHandler}>
        <div className="filler"></div>
        <InputComponent
          name={inputNameToSet}
          label={false}
          placeholder={'Search and filter'}
          icon={'search'}
          filled={'white'}
          boxshadow={true}
          size={'sm'}
        />
        <div className="horizontalScrollableDiv">
          <Dropdown
            id={'submittedDateRangeSelector'}
            listItems={['Submitted date: Dec 1, 2022 - Dec 12, 2022']}
            size={'sm'}
          />
          <Dropdown
            id={'licenceStartDateRangeSelector'}
            listItems={['Licence start date: Dec 1, 2022 - Dec 12, 2022']}
            size={'sm'}
          />
          <CheckboxListDropdown
            id={'columnSetup'}
            listItems={
              this.props.columnSetupOptions?.headings
                ? ['Columns Setup', ...this.props.columnSetupOptions.headings]
                : ['Columns Setup']
            }
            indicesToSelect={this.props.columnSetupOptions?.indicesToSelect}
            columnToSelectEditor={
              this.props.columnSetupOptions?.columnToSelectEditor
            }
            size={'sm'}
          />
        </div>
        <div id="nextButton" onClick={this.handleScrolling}>
          <IconButton
            iconName={icon}
            clickHandler={() => {}}
            buttonText={{
              text: nextButtonText,
              textColor: 'black',
              textPosition: textPosition,
            }}
            fillColor={'white'}
            size={'sm'}
          />
          <div className="filler"></div>
        </div>
      </div>
    );
  }
}
