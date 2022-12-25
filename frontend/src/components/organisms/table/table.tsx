import React, {Component} from 'react';
import InputComponent from '../../molecules/input/inputComponent';
import Dropdown from '../../molecules/dropdown/dropdown';
import './table.css';
import HorizontalDivider from '../../atoms/horizontalDivider';

export default class Table extends Component {
  render() {
    return (
      <div className="fullTableWrapper">
        <div className="tableConfigContainer">
          <InputComponent
            name={'licenceSearchAndFilter'}
            label={false}
            placeholder={'Search and filter'}
            icon={'search'}
            filled={'white'}
            boxshadow={true}
          />
          <Dropdown
            id={'dashboardTableDateRangeSelector'}
            options={['This month: Dec 1, 2022 - Dec 12, 2022']}
          />
          <Dropdown id={'columnSetup'} options={['Columns Setup']} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Application number</th>
              <th>Status</th>
              <th>Processing office</th>
              <th>Assigned person</th>
              <th>Submitted date</th>
              <th>Subservice name</th>
              <th>Type</th>
              <th style={{borderRight: 'none'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
