import React, {Component} from 'react';
import {Icon, IconName} from '@blueprintjs/core';
import './iconButton.css';

class IconButtonProps {
  iconName: IconName;
  clickHandler: (iconName: IconName) => void;
  menuBarBottomPosition?: boolean;
  size?: 'lg' | 'md' | 'sm';
  colour?: string;
  activityStatus?: 'default' | 'active';

  constructor(passedProps: IconButtonProps) {
    const {
      iconName,
      size,
      colour,
      activityStatus,
      clickHandler,
      menuBarBottomPosition,
    } = passedProps;
    this.iconName = iconName;
    this.clickHandler = clickHandler;
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

    // container
    let containerClass: string;

    let iconColor: string;
    if (menuBarBottomPosition) {
      if (activityStatus === 'active') {
        containerClass = 'bottomIconButtonContainer selected';
        iconColor = '#302CCC';
      } else {
        containerClass = 'bottomIconButtonContainer';
        iconColor = colour as string;
      }
    } else {
      if (activityStatus === 'active') {
        containerClass = 'iconButtonContainer selected';
        iconColor = '#302CCC';
      } else {
        containerClass = 'iconButtonContainer';
        iconColor = colour as string;
      }
    }

    return (
      <div className={containerClass}>
        <Icon
          icon={iconName}
          size={iconSize}
          color={iconColor}
          onClick={() => clickHandler(iconName)}
        />
      </div>
    );
  }
}
