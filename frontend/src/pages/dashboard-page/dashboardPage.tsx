import React, {Component} from 'react';
import {userContext} from '../../app/userContext';
import './dashboardPage.css';
import SideMenuBar from '../../components/organisms/side-menu-bar/sideMenuBar';
import DashboardHeader from './header/dashboardHeader';
import {
  GetAndSetLicenceData,
  downloadAsCSV,
  getLicenceData,
  getTimeSinceLastSync,
  identifyLatestLicenceData,
  initialiseDataState,
  licenceDataState,
} from './licenceDataFunctions';
import {licenceDataContext} from './licenceDataContext';
import {licenceData} from '../../globals/global-types';
import LicenceDataTable from './licenceDataTable/licenceDataTable';
import assert from 'assert';

export default class Dashboard extends Component<{}, licenceDataState> {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;
  private textUpdateTimeout?: NodeJS.Timeout;

  constructor(props: {}) {
    super(props);
    this.state = initialiseDataState();
    this.handleLicenceDataSync = this.handleLicenceDataSync.bind(this);
    this.handleLicenceDataExport = this.handleLicenceDataExport.bind(this);
    this.handleSyncTextUpdate = this.handleSyncTextUpdate.bind(this);
  }

  async handleLicenceDataSync() {
    clearTimeout(this.textUpdateTimeout);
    this.setState({
      gettingData: true,
      lastSyncedText: 'Getting latest licence data',
    });
    const currentAccessToken = this.context.currentUserInfo.accessToken;
    const newLicenceData = await getLicenceData(currentAccessToken as string);
    const lastSyncedTime = newLicenceData.lastSynced;
    const syncUpdateObject = getTimeSinceLastSync(lastSyncedTime);
    assert(syncUpdateObject !== 'Click here to get licence data ➜');
    const {lastSyncedString, nextSyncCheck} = syncUpdateObject;
    this.setState({
      fetchedData: newLicenceData.data,
      lastSynced: lastSyncedTime,
      lastSyncedText: lastSyncedString,
      gettingData: false,
    });
    this.textUpdateTimeout = setTimeout(
      this.handleSyncTextUpdate,
      nextSyncCheck
    );
  }

  handleSyncTextUpdate() {
    const textToSetObject = getTimeSinceLastSync(this.state.lastSynced);
    if (textToSetObject === 'Click here to get licence data ➜') {
      this.setState({lastSyncedText: textToSetObject});
    } else {
      this.setState({lastSyncedText: textToSetObject.lastSyncedString});
      this.textUpdateTimeout = setTimeout(
        this.handleSyncTextUpdate,
        textToSetObject.nextSyncCheck
      );
    }
  }

  async handleLicenceDataExport() {
    downloadAsCSV(this.state);
  }

  render() {
    const latestLicenceData = identifyLatestLicenceData(this.state);
    const licenceDataContextValues: GetAndSetLicenceData = {
      currentLicenceData: latestLicenceData as licenceData,
      syncToLatestData: this.handleLicenceDataSync,
      lastSynced: this.state.lastSynced,
      lastSyncedText: this.state.lastSyncedText,
      gettingData: this.state.gettingData,
      exportData: this.handleLicenceDataExport,
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
