import React, {Component} from 'react';
import {Icon, IconName} from '@blueprintjs/core';
import './iconButton.css';

class IconButtonProps {
  iconName: IconName;
  clickHandler: (iconName: IconName) => void;
  text?: {
    text: string;
    textPosition: 'front' | 'back';
  };
  filled?: string;
  outlined?: {colour: string};
  menuBarBottomPosition?: boolean;
  size?: 'lg' | 'md' | 'sm';
  colour?: string;
  activityStatus?: 'default' | 'active';

  constructor(passedProps: IconButtonProps) {
    const {
      iconName,
      size,
      text,
      outlined,
      filled,
      colour,
      activityStatus,
      clickHandler,
      menuBarBottomPosition,
    } = passedProps;
    this.iconName = iconName;
    this.clickHandler = clickHandler;
    this.text = text ? text : undefined;
    if (text) {
      this.filled = filled || '#E6E6E6';
    } else if (filled) {
      this.filled = filled;
    }
    this.outlined = outlined;
    this.size = size ? size : 'md';
    this.activityStatus = activityStatus ? activityStatus : 'default';
    this.colour = colour ? colour : 'black';
    this.menuBarBottomPosition = menuBarBottomPosition
      ? menuBarBottomPosition
      : false;
  }
}

export default class IconButton extends Component<IconButtonProps> {
  constructor(props: IconButtonProps) {
    super(props);
  }

  render() {
    const {
      activityStatus,
      size,
      text,
      outlined,
      filled,
      colour,
      clickHandler,
      iconName,
      menuBarBottomPosition,
    } = new IconButtonProps(this.props);

    // icon
    let iconSize: 16 | 20 | 26;
    if (size === 'lg') {
      iconSize = 26;
    } else if (size === 'md') {
      iconSize = 20;
    } else {
      iconSize = 16;
    }
    const fontSize = String(iconSize) + 'px';

    // container params initialisation
    let containerBackgroundColor: string;

    if (filled) {
      if (filled === 'default') {
        containerBackgroundColor = '#E6E6E6';
      } else {
        containerBackgroundColor = filled;
      }
    } else {
      containerBackgroundColor = 'transparent';
    }

    let containerClass: string;

    let iconColor: string;
    if (menuBarBottomPosition) {
      containerClass = 'bottomIconButtonContainer';
      if (activityStatus === 'active') {
        containerBackgroundColor = 'white';
        iconColor = '#302CCC';
      } else {
        iconColor = colour as string;
      }
    } else {
      containerClass = 'iconButtonContainer';
      if (activityStatus === 'active') {
        containerBackgroundColor = '#B3B1EC';
        iconColor = '#302CCC';
      } else {
        iconColor = colour as string;
      }
    }

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
        {text && text.textPosition === 'front' && text.text}
        <Icon
          icon={iconName}
          size={iconSize}
          color={iconColor}
          onClick={() => clickHandler(iconName)}
        />
        {text && text.textPosition === 'back' && text.text}
      </div>
    );
  }
}
