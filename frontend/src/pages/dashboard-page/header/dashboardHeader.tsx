import Dropdown from '../../../components/molecules/dropdown/dropdown';
import IconButton from '../../../components/molecules/icon-button/iconButton';
import DashboardMessage from '../message/dashboardMessage';
import './dashboardHeader.css';
import React, {Component} from 'react';

export default class DashboardHeader extends Component {
  render() {
    return (
      <>
        <div className="dashboardHeaderWrapper">
          <div className="dashboardHeaderleftContainer">
            <h5>Licence account</h5>
            <Dropdown
              id={'licenceAccountDropdown'}
              filled={'white'}
              outlined={{colour: '#B3B1EC'}}
              options={['619888398273', '619218398273', '619768398273']}
            />
          </div>
          <div className="dashboardHeaderRightContainer">
            <h4>Last synced 5 days ago</h4>
            <IconButton
              clickHandler={() => {}}
              iconName="refresh"
              outlined={{colour: '#B3B1EC'}}
            />
            <IconButton
              clickHandler={() => {}}
              iconName="arrow-down"
              buttonText={{text: 'Download as CSV', textPosition: 'back'}}
            />
            <IconButton
              clickHandler={() => {}}
              iconName="more"
              filled="default"
              size="lg"
            />
          </div>
        </div>
        <DashboardMessage
          messageImportantPart={'Welcome to the SMS licence manager!'}
          messageRest={
            'We’re happy to have you,  press the sync button at the top right to get started'
          }
        />
      </>
    );
  }
}
