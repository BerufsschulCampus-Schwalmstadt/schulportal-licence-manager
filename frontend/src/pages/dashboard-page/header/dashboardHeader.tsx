import Dropdown from '../../../components/molecules/dropdown/dropdown';
import IconButton from '../../../components/molecules/icon-button/iconButton';
import './dashboardHeader.css';
import React, {Component} from 'react';
import Toast from '../../../components/molecules/toast/toast';
import {licenceDataContext} from '../licenceDataContext';

export default class DashboardHeader extends Component {
  static contextType = licenceDataContext;
  context!: React.ContextType<typeof licenceDataContext>;

  componentDidUpdate(): void {
    const syncButtonIcon = document.getElementById(
      'syncButtonIcon'
    ) as HTMLElement;

    if (this.context.gettingData) {
      syncButtonIcon.classList.add('rotateSync');
    } else {
      syncButtonIcon.classList.remove('rotateSync');
    }
  }

  render() {
    return (
      <div className="dashboardHeaderWrapper">
        <div className="dashboardHeaderTogglesContainer">
          <div className="dashboardHeaderleftContainer">
            <h5>Licence account</h5>
            <Dropdown
              id={'licenceAccountDropdown'}
              fillColor={'white'}
              outlineColor={'#B3B1EC'}
              listItems={['619888398273', '619218398273', '619768398273']}
              size={'sm'}
            />
          </div>
          <div className="dashboardHeaderRightContainer">
            <h4>{this.context.lastSyncedText}</h4>
            <IconButton
              clickHandler={this.context.syncToLatestData}
              iconName="refresh"
              outlineColor={'#B3B1EC'}
              size={'sm'}
              fillColor={'white'}
              iconId={'syncButtonIcon'}
            />
            <IconButton
              clickHandler={this.context.exportData}
              iconName="arrow-down"
              buttonText={{text: 'Download as CSV', textPosition: 'back'}}
              fillColor="default"
              size={'sm'}
            />
            <IconButton
              clickHandler={() => {}}
              iconName="more"
              fillColor="default"
              size={'md'}
            />
          </div>
        </div>
        <Toast
          messageImportantPart={'Welcome to the SMS licence manager!'}
          messageRest={
            'We’re happy to have you,  press the sync button at the top right to get started'
          }
        />
      </div>
    );
  }
}
