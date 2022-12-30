import {IconName} from '@blueprintjs/core';
import {size, status} from '../../../globals/global-types';

export type IconButtonEssentialProps = {
  iconName: IconName;
  size: size;
  activityStatus: status;
  iconColor: string;
};

export type IconButtonOptionalProps = {
  clickHandler: (iconName: IconName) => void;
  buttonText: {
    text: string;
    textColor?: string;
    textPosition: 'front' | 'back';
  };
  fillColor: 'default' | string;
  outlineColor: string;
  isDropdown: boolean;
  isBottomOfMenuBar: boolean;
  iconId: string;
  buttonId: string;
};

export type FullIconButtonProps = IconButtonEssentialProps &
  Partial<IconButtonOptionalProps>;

export const defaultIconButtonOptionalProps = {
  size: 'md',
  activityStatus: 'idle',
  iconColor: 'black',
};
