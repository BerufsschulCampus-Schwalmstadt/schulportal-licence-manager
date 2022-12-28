import {IconName} from '@blueprintjs/core';

type iconButtonClickHandler =
  | ((iconName: IconName) => void)
  | ((event: IconName) => void);

export class IconButtonProps {
  iconName: IconName;
  clickHandler: iconButtonClickHandler;
  buttonText?: {
    text: string;
    textPosition: 'front' | 'back';
  };
  size?: 'lg' | 'md' | 'sm';
  filled?: string;
  outlined?: {colour: string};
  iconColour?: string;
  activityStatus?: 'default' | 'active';
  dropdown?: boolean;
  menuBarBottomPosition?: boolean;
  iconId?: string;
  buttonId?: string;
  textColour?: string;

  constructor(passedProps: IconButtonProps) {
    const {
      iconName,
      clickHandler,
      buttonText,
      size,
      filled,
      outlined,
      iconColour,
      textColour,
      activityStatus,
      dropdown,
      menuBarBottomPosition,
      iconId,
      buttonId,
    } = passedProps;
    this.iconName = iconName;
    this.clickHandler = clickHandler;
    this.buttonText = buttonText;
    this.size = size ? size : 'md';
    if (buttonText) {
      this.filled = filled || '#E6E6E6';
    } else {
      this.filled = filled;
    }
    this.outlined = outlined;
    this.iconColour = iconColour ? iconColour : 'black';
    this.textColour = textColour ? textColour : 'black';
    this.activityStatus = activityStatus ? activityStatus : 'default';
    this.dropdown = dropdown;
    this.menuBarBottomPosition = menuBarBottomPosition
      ? menuBarBottomPosition
      : false;
    this.iconId = iconId;
    this.buttonId = buttonId;
  }
}

export function getIconSize(size: string) {
  if (size === 'lg') {
    return 26;
  } else if (size === 'md') {
    return 20;
  } else {
    return 16;
  }
}

export function getContainerBackground(
  filled?: string,
  menuBarBottomPosition?: boolean,
  activityStatus?: 'default' | 'active'
) {
  if (activityStatus === 'active') {
    if (menuBarBottomPosition) return 'white';
    return '#B3B1EC';
  } else if (filled) {
    if (filled === 'default') return '#E6E6E6';
    return filled;
  } else {
    return 'transparent';
  }
}

export function getClassName(
  menuBarBottomPosition?: boolean,
  dropdown?: boolean
) {
  if (menuBarBottomPosition) return 'iconButtonContainer bottom';
  else if (dropdown) return 'iconButtonContainer dropdown';
  return 'iconButtonContainer';
}

export function getIconColor(
  activityStatus?: 'default' | 'active',
  colour?: string
) {
  if (activityStatus === 'active') return '#302CCC';
  return colour as string;
}

export function generateProps(
  fontSize: string,
  containerBackgroundColor: string,
  borderStyle: string,
  buttonText?: {
    text: string;
    textPosition: 'front' | 'back';
  },
  textColour?: string,
  padding?: string
) {
  const baseProps = {
    fontSize: fontSize,
    backgroundColor: containerBackgroundColor,
    border: borderStyle,
  };

  const altProps = {...baseProps, padding: padding, color: textColour};

  return buttonText && textColour ? altProps : baseProps;
}
