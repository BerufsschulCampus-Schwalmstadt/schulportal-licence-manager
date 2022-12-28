import React from 'react';
import './table.css';
import {generateLoadingTable, generateTable} from './tableFunctions';
import {licenceData} from '../../../../globals/global-types';

export default function Table(props: {
  data: licenceData;
  id?: string;
  columnsToDisplayIndices?: number[];
}) {
  const {body, bodyLen, heading} = props.data;
  const {id, columnsToDisplayIndices} = props;
  return (
    <div className="tableWrapper">
      <div className="tableContainer">
        {body && bodyLen && heading && columnsToDisplayIndices
          ? generateTable({body, bodyLen, heading}, id, columnsToDisplayIndices)
          : generateLoadingTable()}
      </div>
    </div>
  );
}
