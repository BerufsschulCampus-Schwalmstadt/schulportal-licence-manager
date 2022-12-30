import {FullDropdownProps, DropdownState} from '../dropdown-types';

export interface CheckboxListDropdownProps extends FullDropdownProps {
  indicesToSelect?: number[];
  columnToSelectEditor?: (index: number, operation: 'add' | 'remove') => void;
}

export interface CheckboxListDropdownState extends DropdownState {
  options: JSX.Element[];
}
