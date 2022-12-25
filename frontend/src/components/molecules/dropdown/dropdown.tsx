import React, {Component, createRef} from 'react';
import IconButton from '../icon-button/iconButton';
import './dropdown.css';
import assert from 'assert';
import {
  DropdownProps,
  DropdownState,
  generateOptions,
} from './dropdownFunctions';

export default class Dropdown extends Component<DropdownProps, DropdownState> {
  private fullprops: DropdownProps;
  private componentRef = createRef<HTMLDivElement>();
  private clickCount = 0;
  constructor(props: DropdownProps) {
    super(props);
    this.state = {
      listVisibility: 'closed',
      selectedOption: 0,
    };
    this.fullprops = new DropdownProps(this.props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount(): void {
    this.componentRef.current?.addEventListener(
      'click',
      (event: MouseEvent) => {
        console.log(event.target + 'mount');
        event.stopImmediatePropagation();
        if (this.clickCount === 1) {
          console.log(this.clickCount);
          this.handleClose(event);
        } else {
          this.setState({listVisibility: 'open'});
          this.clickCount++;
        }
      }
    );
  }

  handleClose(event: MouseEvent) {
    this.handleSelect(event.target as HTMLElement);
    this.setState({listVisibility: 'closed'});
    this.clickCount = 0;
  }

  componentDidUpdate(
    prevProps: Readonly<DropdownProps>,
    prevState: Readonly<DropdownState>
  ): void {
    if (
      prevState.listVisibility === 'closed' &&
      this.state.listVisibility === 'open'
    ) {
      document.addEventListener('click', this.handleClose);
    } else {
      document.removeEventListener('click', this.handleClose);
    }
  }

  handleSelect(trigger: HTMLElement) {
    const triggerText = trigger.textContent;
    console.log(triggerText);
    if (!triggerText) return;
    const selectionIndex = this.fullprops.options?.indexOf(triggerText);
    if (selectionIndex === undefined || selectionIndex === -1) return;
    this.setState({selectedOption: selectionIndex});
  }

  render() {
    const {id, options, iconName, colour, filled, outlined, size} =
      this.fullprops;
    assert(iconName);
    assert(options);

    const {listVisibility, selectedOption} = this.state;

    return (
      <div ref={this.componentRef} className="dropDownWrapper" id={id}>
        <IconButton
          iconName={iconName}
          buttonText={{text: options[selectedOption], textPosition: 'front'}}
          clickHandler={() => {}}
          colour={colour}
          outlined={outlined}
          filled={filled}
          dropdown={true}
        />
        <div
          className="dropdownList"
          style={{display: listVisibility === 'open' ? 'flex' : 'none'}}
        >
          {generateOptions(options, size as string, this.state.selectedOption)}
        </div>
      </div>
    );
  }
}
