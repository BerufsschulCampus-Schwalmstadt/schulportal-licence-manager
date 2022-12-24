import {IconName} from '@blueprintjs/core';

export class DropdownProps {
  id: string;
  options?: string[];
  iconName?: IconName;
  clickHandler?: (iconName: IconName) => void;
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
