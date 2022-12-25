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
