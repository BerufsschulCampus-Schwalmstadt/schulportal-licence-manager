import Dropdown from '../../../components/dropdown/dropdown';
import IconButton from '../../../components/icon-button/iconButton';
import './dashboardHeader.css';
import React, {Component} from 'react';

export default class DashboardHeader extends Component {
  render() {
    return (
      <div className="dashboardHeaderWrapper">
        <h4>Licence account</h4>
        <Dropdown text="No SMS account linked" id="licenceAccountDropdown" />
        <p>Last synced 5 days ago</p>
        <IconButton
          clickHandler={() => {}}
          iconName="refresh"
          outlined={{colour: '#B3B1EC'}}
        />
        <IconButton
          clickHandler={() => {}}
          iconName="arrow-down"
          text={{text: 'Download as CSV', textPosition: 'back'}}
        />
        <IconButton
          clickHandler={() => {}}
          iconName="more"
          filled="default"
          size="lg"
        />
      </div>
    );
  }
}
