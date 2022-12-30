import {IconName} from '@blueprintjs/core';
import {size, status} from '../../../globals/global-types';

export function getIconSize(size: string) {
  if (size === 'lg') {
    return 26;
  } else if (size === 'md') {
    return 20;
  } else {
    return 16;
  }
}

function getContainerBackground(
  fillColor?: string,
  isBottomOfMenuBar?: boolean,
  activityStatus?: status
) {
  if (activityStatus === 'active') {
    if (isBottomOfMenuBar) return 'white';
    return '#B3B1EC';
  } else if (fillColor) {
    if (fillColor === 'default') return '#E6E6E6';
    return fillColor;
  } else {
    return 'transparent';
  }
}

export function getIconColor(iconColor: string, activityStatus: status) {
  if (activityStatus === 'active') return '#302CCC';
  return iconColor;
}

export function getPadding(size: size) {
  if (size === 'md') {
    return '10px 20px';
  } else if (size === 'lg') {
    return '16px 18px';
  } else {
    return '10px 20px';
  }
}

export function getClassName(
  isBottomOfMenuBar?: boolean,
  isDropdown?: boolean
) {
  if (isBottomOfMenuBar) return 'iconButtonContainer bottom';
  else if (isDropdown) return 'iconButtonContainer dropdown';
  return 'iconButtonContainer';
}

export function generateContainerProps(
  iconName: IconName,
  iconColor: string,
  size: size,
  activityStatus: status,
  buttonText?: {
    text: string;
    textColor?: string;
    textPosition: 'front' | 'back';
  },
  fillColor?: string,
  outlineColor?: string,
  isBottomOfMenuBar?: boolean,
  clickHandler?: (iconName: IconName) => void
) {
  // determine border styling
  const borderStyle = outlineColor ? '2px solid ' + outlineColor : '0px';

  // determine conteiner background color
  const containerBackgroundColor = getContainerBackground(
    fillColor,
    isBottomOfMenuBar,
    activityStatus
  );

  // infer icon size
  const iconSize = getIconSize(size);

  // infer fot size
  const fontSize = String(iconSize) + 'px';

  // define icon color
  const iconColorToSet = getIconColor(iconColor, activityStatus);

  // define padding
  const padding = getPadding(size);

  // ------- Container props ----------//
  const noTextContainerProps = {
    fontSize: fontSize,
    backgroundColor: containerBackgroundColor,
    border: borderStyle,
  };

  const textPresentContainerProps = {
    ...noTextContainerProps,
    padding: padding,
    color: buttonText?.textColor,
  };

  // -----------Icon Props------------//
  const iconProps = {
    icon: iconName,
    size: iconSize,
    color: iconColorToSet,
    onClick: () => clickHandler,
  };

  const props = {
    iconPropsToSet: iconProps,
    containerPropsToSet: buttonText
      ? textPresentContainerProps
      : noTextContainerProps,
  };

  return props;
}
