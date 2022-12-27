import React from 'react';
import './table.css';
import {generateLoadingTable, generateTable} from './tableFunctions';
import {licenceData} from '../../../../globals/global-types';

export default function Table(props: {data: licenceData; id?: string}) {
  const {body, bodyLen, heading} = props.data;
  const id = props.id;
  return (
    <div className="tableWrapper">
      <div className="tableContainer">
        {body && bodyLen && heading
          ? generateTable({body, bodyLen, heading}, id)
          : generateLoadingTable()}
      </div>
    </div>
  );
}
