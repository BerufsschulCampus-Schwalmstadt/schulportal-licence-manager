import React, {Component} from 'react';
import {Icon} from '@blueprintjs/core';
import './iconButton.css';
import {generateProps} from './IconButtonFunctions';
import {
  IconButtonProps,
  getClassName,
  getContainerBackground,
  getIconColor,
  getIconSize,
} from './IconButtonFunctions';

export default class IconButton extends Component<IconButtonProps> {
  constructor(props: IconButtonProps) {
    super(props);
  }

  render() {
    const {
      activityStatus,
      size,
      buttonText,
      outlined,
      filled,
      iconColour,
      textColour,
      clickHandler,
      iconName,
      dropdown,
      menuBarBottomPosition,
      iconId,
      buttonId,
    } = new IconButtonProps(this.props);

    const iconSize = getIconSize(size as string);

    const fontSize = String(iconSize) + 'px';

    const containerBackgroundColor = getContainerBackground(
      filled,
      menuBarBottomPosition,
      activityStatus
    );

    const containerClass = getClassName(menuBarBottomPosition, dropdown);

    const iconColor = getIconColor(activityStatus, iconColour);

    const borderStyle = outlined ? '2px solid #B3B1EC' : '0px';

    let padding;
    if (size === 'md') {
      padding = '10px 20px';
    } else if (size === 'lg') {
      padding = '16px 18px';
    } else {
      padding = '10px 20px';
    }

    const containerPropsToUse = generateProps(
      fontSize,
      containerBackgroundColor,
      borderStyle,
      buttonText,
      textColour,
      padding
    );

    const iconPropsToUse = {
      icon: iconName,
      size: iconSize,
      color: iconColor,
      onClick: () => {},
    };

    return (
      <div
        className={containerClass}
        style={{...containerPropsToUse}}
        onClick={() => clickHandler(iconName)}
        id={buttonId}
      >
        {buttonText?.textPosition === 'front' && buttonText.text}
        <Icon {...iconPropsToUse} id={iconId} />
        {buttonText?.textPosition === 'back' && buttonText.text}
      </div>
    );
  }
}
