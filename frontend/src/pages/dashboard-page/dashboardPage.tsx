import React, {Component} from 'react';
import {userContext} from '../../app/userContext';
import './dashboardPage.css';
import SideMenuBar from '../../components/organisms/side-menu-bar/sideMenuBar';
import DashboardHeader from './header/dashboardHeader';
import {
  GetAndSetLicenceData,
  getLicenceData,
  identifyLatestLicenceData,
  initialiseDataState,
  licenceDataState,
} from './licenceDataFunctions';
import {licenceDataContext} from './licenceDataContext';
import {licenceData} from '../../globals/global-types';
import LicenceDataTable from './licenceDataTable/licenceDataTable';

export default class Dashboard extends Component<{}, licenceDataState> {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;

  constructor(props: {}) {
    super(props);
    this.state = initialiseDataState();
    this.handleLicenceDataSync = this.handleLicenceDataSync.bind(this);
  }

  async handleLicenceDataSync() {
    this.setState({gettingData: true});
    const currentAccessToken = this.context.currentUserInfo.accessToken;
    const newLicenceData = await getLicenceData(currentAccessToken as string);
    this.setState({fetchedData: newLicenceData, gettingData: false});
  }

  render() {
    const latestLicenceData = identifyLatestLicenceData(this.state);
    const licenceDataContextValues: GetAndSetLicenceData = {
      currentLicenceData: latestLicenceData as licenceData,
      syncToLatestData: this.handleLicenceDataSync,
      gettingData: this.state.gettingData,
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
