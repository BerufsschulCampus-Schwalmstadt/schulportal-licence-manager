import {getIconSize} from '../icon-button/iconButton-functions';
import {DropdownState} from './dropdown-types';

export function toggleVisibility(dropdownState: DropdownState) {
  if (dropdownState.listVisibility === 'closed') return 'open';
  return 'closed';
}

export function getChildren(id: string) {
  const childrenSelector = '#' + id + ' ' + '*';
  return Array.from(document.querySelectorAll(childrenSelector));
}

export function generateOptions(
  options: string[],
  size: string,
  selectedOptionIndex: number
) {
  const optionElements = [];
  for (let i = 0; i < options.length; i++) {
    const classNameToUse =
      i === selectedOptionIndex
        ? 'dropdownListItem selected'
        : 'dropdownListItem';

    optionElements[i] = (
      <div
        style={{fontSize: String(getIconSize(size)) + 'px'}}
        className={classNameToUse}
        key={options[i]}
      >
        {options[i]}
      </div>
    );
  }
  return optionElements;
}

function toggle(event: React.MouseEvent, key: string) {
  const checkboxToToggleId = key + 'Checkbox';
  const checkboxToToggle = document.getElementById(
    checkboxToToggleId
  ) as HTMLInputElement;
  if (checkboxToToggle.checked) {
    checkboxToToggle.checked = false;
  } else {
    checkboxToToggle.checked = true;
  }
}

export function generateCheckboxOptions(
  options: string[],
  size: string,
  indicesToSelect?: number[]
) {
  const optionElements = [];
  for (let i = 1; i < options.length; i++) {
    let shouldCheck;
    if (
      (indicesToSelect && indicesToSelect.includes(i - 1)) ||
      indicesToSelect === undefined
    ) {
      shouldCheck = true;
    } else {
      shouldCheck = false;
    }
    optionElements[i - 1] = (
      <div
        style={{
          fontSize: String(getIconSize(size)) + 'px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '5px',
        }}
        className={'dropdownListItem'}
        key={options[i]}
        id={options[i]}
      >
        <input
          type={'checkbox'}
          id={options[i] + 'Checkbox'}
          defaultChecked={shouldCheck}
          name={String(i - 1)}
        />
        <p style={{marginTop: '-3px'}}>{options[i]}</p>
      </div>
    );
  }
  return optionElements;
}
