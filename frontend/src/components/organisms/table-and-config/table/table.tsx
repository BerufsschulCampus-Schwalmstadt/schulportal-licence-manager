import React, {Component} from 'react';
import './table.css';
import {licenceData} from '../../../../globals/global-types';
import {
  determineTableState,
  generateLoadingTable,
  generateTable,
  TableData,
  TableProps,
  TableState,
} from './tableFunctions';

export default class Table extends Component<TableProps, TableState> {
  constructor(props: TableProps) {
    super(props);
    this.state = determineTableState(this.props);
  }

  static getDerivedStateFromProps(props: TableProps, state: TableState) {
    const newState = determineTableState(props);
    console.log(newState);
    if (newState.dataReceived !== state.dataReceived) {
      return newState;
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="tableWrapper">
        <div className="tableContainer">
          {this.state.dataReceived
            ? generateTable(
                {...(this.props.data as TableData)},
                this.props.id,
                this.props.columnsToDisplayIndices
              )
            : generateLoadingTable()}
        </div>
      </div>
    );
  }
}
