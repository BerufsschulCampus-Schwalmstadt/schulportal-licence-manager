import React, {Component} from 'react';
import './tableConfigMenu.css';
import Dropdown from '../../../molecules/dropdown/dropdown';
import InputComponent from '../../../molecules/input/inputComponent';

export default class TableConfigMenu extends Component {
  render() {
    return (
      <div className="tableConfigContainer">
        <InputComponent
          name={'licenceSearchAndFilter'}
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
