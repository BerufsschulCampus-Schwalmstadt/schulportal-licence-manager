import React, {Component} from 'react';
import Table from '../../../components/organisms/table-and-config/table/table';
import TableConfigMenu from '../../../components/organisms/table-and-config/table-config-menu/tableConfigMenu';
import './licenceDataTable.css';
import {licenceDataContext} from '../licenceDataContext';

export default class LicenceDataTable extends Component<{}, {}> {
  static contextType = licenceDataContext;
  context!: React.ContextType<typeof licenceDataContext>;

  render() {
    return (
      <div className="licenceDataTableWrapper">
        <TableConfigMenu />
        <Table {...this.context.currentLicenceData} />
      </div>
    );
  }
}
