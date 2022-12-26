import React, {Component} from 'react';
import {userContext} from '../../app/userContext';
import './dashboardPage.css';
import SideMenuBar from '../../components/organisms/side-menu-bar/sideMenuBar';
import DashboardHeader from './header/dashboardHeader';
import {
  GetAndSetLicenceData,
  getLicenceData,
  identifyLatestLicenceData,
  licenceDataOptions,
} from './licenceDataFunctions';
import {licenceDataContext} from './licenceDataContext';
import {licenceData} from '../../globals/global-types';
import LicenceDataTable from './licenceDataTable/licenceDataTable';

export default class Dashboard extends Component<{}, licenceDataOptions> {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  constructor(props: {}) {
    super(props);

    const previousDataString = localStorage.getItem('licenceData');
    if (previousDataString) {
      this.state = {previousData: JSON.parse(previousDataString)};
    }

    this.handleLicenceDataSync = this.handleLicenceDataSync.bind(this);
  }

  async handleLicenceDataSync() {
    const currentAccessToken = this.context.currentUserInfo.accessToken;
    const newLicenceData = await getLicenceData(currentAccessToken as string);
    this.setState({fetchedData: newLicenceData});
  }

  render() {
    const latestLicenceData = identifyLatestLicenceData(this.state);
    const licenceDataContextValues: GetAndSetLicenceData = {
      currentLicenceData: latestLicenceData as licenceData,
      syncToLatestData: this.handleLicenceDataSync,
    };

    return (
      <licenceDataContext.Provider value={licenceDataContextValues}>
        <div className="dashboardWrapper">
          <SideMenuBar />
          <div className="dashboardContentContainer">
            <DashboardHeader />
            <LicenceDataTable />
          </div>
        </div>
      </licenceDataContext.Provider>
    );
  }
}
