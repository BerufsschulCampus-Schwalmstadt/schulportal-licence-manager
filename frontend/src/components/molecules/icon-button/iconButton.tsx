import React, {Component} from 'react';
import './iconButton.css';
import {
  FullIconButtonProps,
  defaultIconButtonOptionalProps,
} from './IconButton-types';
import {getClassName, generateContainerProps} from './iconButton-functions';
import {Icon} from '@blueprintjs/core';

export default class IconButton extends Component<FullIconButtonProps> {
  static defaultProps = defaultIconButtonOptionalProps;
  constructor(props: FullIconButtonProps) {
    super(props);
  }

  render() {
    const {
      size,
      iconName,
      outlineColor,
      activityStatus,
      buttonId,
      buttonText,
      clickHandler,
      fillColor,
      iconColor,
      iconId,
      isDropdown,
      isBottomOfMenuBar,
    } = this.props;

    const containerClass = getClassName(isBottomOfMenuBar, isDropdown);

    const propsToSet = generateContainerProps(
      iconName,
      iconColor,
      size,
      activityStatus,
      buttonText,
      fillColor,
      outlineColor,
      isBottomOfMenuBar,
      clickHandler
    );

    return (
      <div
        className={containerClass}
        style={{...propsToSet.containerPropsToSet}}
        onClick={clickHandler ? () => clickHandler(iconName) : undefined}
        id={buttonId}
      >
        {buttonText?.textPosition === 'front' && buttonText.text}
        <Icon {...propsToSet.iconPropsToSet} id={iconId} />
        {buttonText?.textPosition === 'back' && buttonText.text}
      </div>
    );
  }
}
