import Dropdown from '../../../components/molecules/dropdown/dropdown';
import IconButton from '../../../components/molecules/icon-button/iconButton';
import './dashboardHeader.css';
import React, {Component} from 'react';
import Toast from '../../../components/molecules/toast/toast';
import {licenceDataContext} from '../licenceDataContext';

export default class DashboardHeader extends Component {
  static contextType = licenceDataContext;
  context!: React.ContextType<typeof licenceDataContext>;

  render() {
    return (
      <div className="dashboardHeaderWrapper">
        <div className="dashboardHeaderTogglesContainer">
          <div className="dashboardHeaderleftContainer">
            <h5>Licence account</h5>
            <Dropdown
              id={'licenceAccountDropdown'}
              filled={'white'}
              outlined={{colour: '#B3B1EC'}}
              options={['619888398273', '619218398273', '619768398273']}
              size={'sm'}
            />
          </div>
          <div className="dashboardHeaderRightContainer">
            <h4>Last synced 5 days ago</h4>
            <IconButton
              clickHandler={this.context.syncToLatestData}
              iconName="refresh"
              outlined={{colour: '#B3B1EC'}}
              size={'sm'}
            />
            <IconButton
              clickHandler={() => {}}
              iconName="arrow-down"
              buttonText={{text: 'Download as CSV', textPosition: 'back'}}
              size={'sm'}
            />
            <IconButton
              clickHandler={() => {}}
              iconName="more"
              filled="default"
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
