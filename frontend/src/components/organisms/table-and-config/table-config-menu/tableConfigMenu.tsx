import React, {Component, FormEvent} from 'react';
import './tableConfigMenu.css';
import Dropdown from '../../../molecules/dropdown/dropdown';
import InputComponent from '../../../molecules/input/inputComponent';

export type searchAndFilterInputHandler = (event: FormEvent) => void;

export default class TableConfigMenu extends Component<
  {inputName?: string; inputHandler?: searchAndFilterInputHandler},
  {}
> {
  render() {
    const {inputHandler, inputName} = this.props;
    const inputNameToSet = inputName ? inputName : 'searchAndFilter';

    return (
      <div className="tableConfigContainer" onInput={inputHandler}>
        <InputComponent
          name={inputNameToSet}
          label={false}
          placeholder={'Search and filter'}
          icon={'search'}
          filled={'white'}
          boxshadow={true}
          size={'sm'}
        />
        <Dropdown
          id={'dashboardTableDateRangeSelector'}
          options={['This month: Dec 1, 2022 - Dec 12, 2022']}
          size={'sm'}
        />
        <Dropdown id={'columnSetup'} options={['Columns Setup']} size={'sm'} />
      </div>
    );
  }
}
