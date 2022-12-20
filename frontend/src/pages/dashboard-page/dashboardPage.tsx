import React, {Component} from 'react';
import {userContext} from '../../globals/app-contexts';
import './dashboardPage.css';
import SideMenuBar from '../../components/side-menu-bar/sideMenuBar';

export default class Dashboard extends Component {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  render() {
    return (
      <div>
        <SideMenuBar />
        <div className="dashboardWrapper"></div>
      </div>
    );
  }
}
