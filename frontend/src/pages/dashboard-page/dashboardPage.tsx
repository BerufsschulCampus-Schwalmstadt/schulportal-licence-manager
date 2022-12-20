import React, {Component} from 'react';
import {userContext} from '../../globals/app-contexts';
import './dashboardPage.css';
import {Icon} from '@blueprintjs/core';

export default class Dashboard extends Component {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  render() {
    return (
      <div>
        <div className="sideBarContainer">
          <div className="verticalIconButtonContainer">
            <Icon icon="home" size={20} />
            <Icon icon="pie-chart" size={20} />
          </div>
          <div>
            <Icon icon="cog" size={20} />
          </div>
        </div>
        <div className="dashboardWrapper"></div>
      </div>
    );
  }
}
