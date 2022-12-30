import {IconName} from '@blueprintjs/core';

export type EssentialDropdownProps = {
  id: string;
};

export type OptionalDropdownProps = {
  iconName: IconName;
  listItems: string[];
  clickHandler: () => void;
  fillColor: string;
  outlineColor: string;
  size: 'lg' | 'md' | 'sm';
  iconColor: string;
  activityStatus: 'idle' | 'active';
};

export const defaultOptionalDropdownProps: OptionalDropdownProps = {
  iconName: 'caret-down',
  listItems: [''],
  clickHandler: () => {},
  fillColor: '#e6e6e6',
  outlineColor: 'transparent',
  size: 'md',
  iconColor: 'black',
  activityStatus: 'idle',
};

export type FullDropdownProps = EssentialDropdownProps & OptionalDropdownProps;

export type DropdownState = {
  listVisibility: 'closed' | 'open';
  selectedOption: number;
};
