import React, {Component} from 'react';
import {userContext} from '../../app/userContext';
import './dashboardPage.css';
import SideMenuBar from '../../components/side-menu-bar/sideMenuBar';
import DashboardHeader from './header/dashboardHeader';

export default class Dashboard extends Component {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  render() {
    return (
      <div className="dashboardWrapper">
        <SideMenuBar />
        <div className="dashboardContentContainer">
          <DashboardHeader />
        </div>
      </div>
    );
  }
}
