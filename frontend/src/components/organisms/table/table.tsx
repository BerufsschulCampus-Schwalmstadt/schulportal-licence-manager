import React, {Component} from 'react';
import './table.css';
import Dropdown from '../../molecules/dropdown/dropdown';
import InputComponent from '../../molecules/input/inputComponent';
import {generateAxiosInstance} from '../../../globals/axios-config';
import {userContext} from '../../../app/userContext';

export default class Table extends Component<
  {},
  {
    data?: {
      heading: string[];
      body: string[][];
      bodyLen: number;
    };
  }
> {
  static contextType = userContext;
  context!: React.ContextType<typeof userContext>;
  constructor(props: {}) {
    super(props);
    this.getData = this.getData.bind(this);
  }

  async getData() {
    console.log('attempting to get data');
    const axios = generateAxiosInstance(
      this.context.currentUserInfo.accessToken
    );
    const response = await axios.get('/licence-data').catch(error => {
      console.log(error);
    });
    console.log('returning response');
    if (!response) {
      console.log('failed getting data');
    } else {
      this.setState({data: response.data});
    }
  }

  render() {
    return (
      <div className="fullTableWrapper" onClick={this.getData}>
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
              <td>
                {this.state ? this.state.data?.body : 'data not available'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
