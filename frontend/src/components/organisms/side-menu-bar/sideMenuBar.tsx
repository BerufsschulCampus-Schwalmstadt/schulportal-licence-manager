import React, {Component} from 'react';
import IconButton from '../../molecules/icon-button/iconButton';
import {IconName} from '@blueprintjs/core';
import './sideMenuBar.css';
import HorizontalDivider from '../../atoms/horizontalDivider';

type SideMenuBarProps = {
  iconNames: IconName[];
  bottomIconName: IconName;
};

const defaultSideMenuProps: SideMenuBarProps = {
  iconNames: ['home', 'pie-chart'],
  bottomIconName: 'cog',
};

type SideMenuBarState = {
  activeIcon: IconName;
};

export default class SideMenuBar extends Component<
  SideMenuBarProps,
  SideMenuBarState
> {
  static defaultProps = defaultSideMenuProps;
  constructor(props: SideMenuBarProps) {
    super(props);
    this.state = {
      activeIcon: localStorage.getItem('sideMenuBarActiveIcon')
        ? (localStorage.getItem('sideMenuBarActiveIcon') as IconName)
        : this.props.iconNames[0],
    };
    this.handleToggling = this.handleToggling.bind(this);
  }

  handleToggling(triggerIconName: IconName) {
    console.log(triggerIconName);
    const curentActiveIcon = this.state.activeIcon;
    if (curentActiveIcon !== triggerIconName) {
      this.setState({activeIcon: triggerIconName});
      localStorage.setItem('sideMenuBarActiveIcon', triggerIconName);
    }
  }

  render() {
    const {iconNames, bottomIconName} = this.props;
    const iconButtonsToRender: JSX.Element[] = [];

    let dividerCount = 0;
    for (let i = 0; i < iconNames.length; i++) {
      const currentIcon = iconNames[i];
      if (i) {
        iconButtonsToRender[i + dividerCount] = (
          <HorizontalDivider key={'horizontalDivider' + {i}} />
        );
      }
      dividerCount++;
      iconButtonsToRender[i + dividerCount] = (
        <IconButton
          iconName={currentIcon}
          size="lg"
          activityStatus={
            this.state.activeIcon === currentIcon ? 'active' : 'idle'
          }
          clickHandler={this.handleToggling}
          key={currentIcon + i}
        />
      );
    }

    return (
      <div className="sideMenuBarContainer">
        <div className="verticalIconButtonContainer">{iconButtonsToRender}</div>
        <div className="sideMenuBarColouredBottomContainer">
          <IconButton
            iconName={bottomIconName as IconName}
            size="lg"
            activityStatus={
              this.state.activeIcon === bottomIconName ? 'active' : 'idle'
            }
            iconColor="white"
            clickHandler={this.handleToggling}
            isBottomOfMenuBar={true}
          />
        </div>
      </div>
    );
  }
}
