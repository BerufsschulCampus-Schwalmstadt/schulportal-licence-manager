import React, {Component, FormEvent} from 'react';
import Table from '../../../components/organisms/table-and-config/table/table';
import TableConfigMenu from '../../../components/organisms/table-and-config/table-config-menu/tableConfigMenu';
import './licenceDataTable.css';
import {licenceDataContext} from '../licenceDataContext';
import {
  licenceDataTableState,
  searchAndFilterTable,
} from './licenceDataTableFunctions';

export default class LicenceDataTable extends Component<
  {},
  licenceDataTableState
> {
  static contextType = licenceDataContext;
  context!: React.ContextType<typeof licenceDataContext>;

  private tableId = 'licenceDataTable';
  constructor(props: {}) {
    super(props);
    this.state = {searchAndFilterInput: ''};
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(event: FormEvent): void {
    const trigger = event.target as HTMLInputElement;
    // change state when field is changed
    if (trigger.name === 'licenceSearchAndFilter') {
      this.setState({searchAndFilterInput: trigger.value});
    }
  }

  componentDidUpdate(): void {
    searchAndFilterTable(this.state.searchAndFilterInput, this.tableId);
  }

  render() {
    const tableProps = {
      data: {...this.context.currentLicenceData},
      id: this.tableId,
    };
    return (
      <div className="licenceDataTableWrapper">
        <TableConfigMenu
          inputHandler={this.handleInput}
          inputName="licenceSearchAndFilter"
        />
        <Table {...tableProps} />
      </div>
    );
  }
}
