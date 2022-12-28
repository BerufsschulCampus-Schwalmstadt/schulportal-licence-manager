import React, {Component} from 'react';
import IconButton from '../../molecules/icon-button/iconButton';
import {IconName} from '@blueprintjs/core';
import assert from 'assert';
import './sideMenuBar.css';
import HorizontalDivider from '../../atoms/horizontalDivider';

class SideMenuBarProps {
  iconNames?: IconName[];
  bottomIconName?: IconName;

  constructor(passedProps: SideMenuBarProps) {
    const {iconNames, bottomIconName} = passedProps;
    this.iconNames = iconNames ? iconNames : ['home', 'pie-chart'];
    this.bottomIconName = bottomIconName ? bottomIconName : 'cog';
  }
}

type SideMenuBarState = {
  activeIcon: IconName;
};

export default class SideMenuBar extends Component<
  SideMenuBarProps,
  SideMenuBarState
> {
  fullprops: SideMenuBarProps;
  constructor(props: SideMenuBarProps) {
    super(props);
    this.fullprops = new SideMenuBarProps(this.props);
    const iconNames = this.fullprops.iconNames;
    assert(iconNames);
    this.state = {
      activeIcon: localStorage.getItem('sideMenuBarActiveIcon')
        ? (localStorage.getItem('sideMenuBarActiveIcon') as IconName)
        : iconNames[0],
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
    const {iconNames, bottomIconName} = this.fullprops;
    assert(iconNames);
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
            this.state.activeIcon === currentIcon ? 'active' : 'default'
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
              this.state.activeIcon === bottomIconName ? 'active' : 'default'
            }
            iconColour="white"
            clickHandler={this.handleToggling}
            menuBarBottomPosition={true}
          />
        </div>
      </div>
    );
  }
}
