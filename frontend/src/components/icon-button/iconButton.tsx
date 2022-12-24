import React, {Component} from 'react';
import {Icon} from '@blueprintjs/core';
import './iconButton.css';
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
      colour,
      clickHandler,
      iconName,
      menuBarBottomPosition,
    } = new IconButtonProps(this.props);

    const iconSize = getIconSize(size as string);

    const fontSize = String(iconSize) + 'px';

    const containerBackgroundColor = getContainerBackground(
      filled,
      menuBarBottomPosition,
      activityStatus
    );

    const containerClass = getClassName(menuBarBottomPosition);

    const iconColor = getIconColor(activityStatus, colour);

    const borderStyle = outlined ? '2px solid #B3B1EC' : '0px';

    return (
      <div
        className={containerClass}
        style={{
          fontSize: fontSize,
          backgroundColor: containerBackgroundColor,
          border: borderStyle,
        }}
        onClick={() => clickHandler(iconName)}
      >
        {buttonText && buttonText.textPosition === 'front' && buttonText.text}
        <Icon
          icon={iconName}
          size={iconSize}
          color={iconColor}
          onClick={() => clickHandler(iconName)}
        />
        {buttonText && buttonText.textPosition === 'back' && buttonText.text}
      </div>
    );
  }
}
