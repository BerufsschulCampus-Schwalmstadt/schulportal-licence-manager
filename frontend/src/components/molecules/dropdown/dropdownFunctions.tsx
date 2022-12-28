import {IconName} from '@blueprintjs/core';
import {getIconSize} from '../icon-button/IconButtonFunctions';

export class DropdownProps {
  id: string;
  options?: string[];
  iconName?: IconName;
  clickHandler?: () => void;
  filled?: string;
  outlined?: {colour: string};
  size?: 'lg' | 'md' | 'sm';
  colour?: string;
  activityStatus?: 'default' | 'active';

  constructor(passedProps: DropdownProps) {
    const {
      id,
      options,
      iconName,
      clickHandler,
      filled,
      outlined,
      size,
      colour,
    } = passedProps;
    this.id = id;
    this.options = options ? options : ['No SMS account linked'];
    this.iconName = iconName ? iconName : 'caret-down';
    this.clickHandler = clickHandler;
    this.filled = filled;
    this.outlined = outlined;
    this.size = size ? size : 'md';
    this.colour = colour ? colour : 'black';
  }
}

export type DropdownState = {
  listVisibility: 'closed' | 'open';
  selectedOption: number;
};

export function toggleVisibility(dropdownState: DropdownState) {
  if (dropdownState.listVisibility === 'closed') return 'open';
  return 'closed';
}

export function getChildren(id: string) {
  const childrenSelector = '#' + id + ' ' + '*';
  return Array.from(document.querySelectorAll(childrenSelector));
}

export function generateOptions(
  options: string[],
  size: string,
  selectedOptionIndex: number
) {
  const optionElements = [];
  for (let i = 0; i < options.length; i++) {
    const classNameToUse =
      i === selectedOptionIndex
        ? 'dropdownListItem selected'
        : 'dropdownListItem';

    optionElements[i] = (
      <div
        style={{fontSize: String(getIconSize(size)) + 'px'}}
        className={classNameToUse}
        key={options[i]}
      >
        {options[i]}
      </div>
    );
  }
  return optionElements;
}

function toggle(event: React.MouseEvent, key: string) {
  const checkboxToToggleId = key + 'Checkbox';
  const checkboxToToggle = document.getElementById(
    checkboxToToggleId
  ) as HTMLInputElement;
  if (checkboxToToggle.checked) {
    checkboxToToggle.checked = false;
  } else {
    checkboxToToggle.checked = true;
  }
}

export function generateCheckboxOptions(options: string[], size: string) {
  const optionElements = [];
  for (let i = 1; i < options.length; i++) {
    const classNameToUse = 'dropdownListItem';

    optionElements[i] = (
      <div
        style={{
          fontSize: String(getIconSize(size)) + 'px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '5px',
        }}
        className={classNameToUse}
        key={options[i]}
        id={options[i]}
      >
        <input type={'checkbox'} id={options[i] + 'Checkbox'} defaultChecked />
        <p style={{marginTop: '-3px'}}>{options[i]}</p>
      </div>
    );
  }
  return optionElements;
}
