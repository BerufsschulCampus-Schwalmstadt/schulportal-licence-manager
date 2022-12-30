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
    this.state = {
      searchAndFilterInput: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.setColumnToDisplay = this.setColumnToDisplay.bind(this);
    this.handleColumnToDisplayUpdates =
      this.handleColumnToDisplayUpdates.bind(this);
  }

  componentDidMount(): void {
    this.setColumnToDisplay();
  }

  setColumnToDisplay() {
    if (this.context.currentLicenceData) {
      const headingArr = this.context.currentLicenceData.heading as string[];
      const indicesToSelect: number[] = [];
      headingArr.forEach(element => {
        indicesToSelect.push(headingArr.indexOf(element));
      });
      this.setState({indicesToSelect: indicesToSelect});
      console.log(this.state);
    }
  }

  handleColumnToDisplayUpdates(index: number, operation: 'add' | 'remove') {
    let newArr;
    if (operation === 'add') {
      const newArr = this.state.indicesToSelect as number[];
      newArr.push(index);
      this.setState({indicesToSelect: newArr});
    } else {
      const temp = this.state.indicesToSelect as number[];
      const indexToSplice = temp.indexOf(index);
      temp.splice(indexToSplice, 1);
      this.setState({indicesToSelect: temp});
    }
    console.log(this.state.indicesToSelect);
  }

  handleInput(event: FormEvent): void {
    const trigger = event.target as HTMLInputElement;
    // change state when field is changed
    if (trigger.name === 'licenceSearchAndFilter') {
      this.setState({searchAndFilterInput: trigger.value});
    }
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<licenceDataTableState>
  ): void {
    searchAndFilterTable(this.state.searchAndFilterInput, this.tableId);
    if (prevState.indicesToSelect === undefined) {
      this.setColumnToDisplay();
    }
  }

  render() {
    const tableProps = {
      data: {...this.context.currentLicenceData},
      columnsToDisplayIndices: this.state.indicesToSelect,
      id: this.tableId,
    };
    return (
      <div className="licenceDataTableWrapper">
        <TableConfigMenu
          inputHandler={this.handleInput}
          inputName="licenceSearchAndFilter"
          columnSetupOptions={
            this.context.currentLicenceData
              ? {
                  headings: this.context.currentLicenceData.heading,
                  indicesToSelect: this.state.indicesToSelect,
                  columnToSelectEditor: this.handleColumnToDisplayUpdates,
                }
              : {
                  headings: undefined,
                  indicesToSelect: this.state.indicesToSelect,
                  columnToSelectEditor: this.handleColumnToDisplayUpdates,
                }
          }
        />
        <Table {...tableProps} />
      </div>
    );
  }
}
