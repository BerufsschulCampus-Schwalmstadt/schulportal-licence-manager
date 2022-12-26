import React, {Component} from 'react';
import './table.css';
import {generateTable, placeholderTable} from './tableFunctions';
import {licenceData} from '../../../../globals/global-types';

export default class Table extends Component<licenceData, licenceData> {
  constructor(props: licenceData) {
    super(props);
    // this.getData = this.getData.bind(this);
  }

  // async getData() {
  //   console.log('attempting to get data');
  //   const axios = generateAxiosInstance(
  //     this.context.currentUserInfo.accessToken
  //   );
  //   const response = await axios.get('/licence-data').catch(error => {
  //     console.log(error);
  //   });
  //   console.log('returning response');
  //   if (!response) {
  //     console.log('failed getting data');
  //   } else {
  //     localStorage.setItem('licenceData', JSON.stringify(response.data));
  //     const {body, bodyLen, heading} = response.data as tableData;
  //     this.setState({body: body, bodyLen: bodyLen, heading: heading});
  //   }
  // }

  render() {
    const {body, bodyLen, heading} = this.props;
    return (
      <div className="tableWrapper">
        <div className="tableContainer">
          {body && bodyLen && heading
            ? generateTable({body, bodyLen, heading})
            : placeholderTable}
        </div>
      </div>
    );
  }
}
