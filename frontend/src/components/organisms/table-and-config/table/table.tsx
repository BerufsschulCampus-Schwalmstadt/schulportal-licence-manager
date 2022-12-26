import React from 'react';
import './table.css';
import {generateLoadingTable, generateTable} from './tableFunctions';
import {licenceData} from '../../../../globals/global-types';

export default function Table(props: licenceData) {
  const {body, bodyLen, heading} = props;
  return (
    <div className="tableWrapper">
      <div className="tableContainer">
        {body && bodyLen && heading
          ? generateTable({body, bodyLen, heading})
          : generateLoadingTable()}
      </div>
    </div>
  );
}
