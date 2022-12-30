import {getIconSize} from '../../icon-button/iconButton-functions';
import {CheckboxListDropdownProps} from './checkboxList-dropdown-types';

export function generateCheckboxOptions(
  props: CheckboxListDropdownProps,
  inputChangeHandler: (event: React.FormEvent) => void,
  listItemClickHandler: (event: React.MouseEvent) => void
) {
  const {listItems, size, indicesToSelect} = props;

  const optionElements = [];
  for (let i = 1; i < listItems.length; i++) {
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
        key={listItems[i]}
        id={listItems[i]}
        onClick={listItemClickHandler}
      >
        <input
          type={'checkbox'}
          id={listItems[i] + 'Checkbox'}
          defaultChecked={shouldCheck}
          onChange={inputChangeHandler}
          name={String(i - 1)}
          style={{cursor: 'pointer'}}
        />
        <p style={{marginTop: '-3px'}}>{listItems[i]}</p>
      </div>
    );
  }
  return optionElements ? optionElements : [];
}

export function listItemClickToggle(
  event: React.FormEvent,
  editor?: (index: number, operation: 'remove' | 'add') => void
) {
  // define click trigger
  const trigger = event.target as HTMLElement;
  const triggerTagName = trigger.tagName;

  console.log(trigger.tagName);
  let inputElement: HTMLInputElement | undefined;
  if (triggerTagName === 'DIV') {
    inputElement = trigger.querySelector('input') as HTMLInputElement;
  } else if (triggerTagName === 'P') {
    inputElement = trigger.parentElement?.querySelector(
      'input'
    ) as HTMLInputElement;
  }

  if (!inputElement) return;
  if (inputElement.checked) {
    if (editor) editor(Number(inputElement.name), 'remove');
    inputElement.checked = false;
  } else {
    if (editor) editor(Number(inputElement.name), 'add');
    inputElement.checked = true;
  }
}

export function checkboxClickToggle(
  event: React.FormEvent,
  editor?: (index: number, operation: 'remove' | 'add') => void
) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.checked) {
    if (editor) editor(Number(inputElement.name), 'add');
  } else {
    if (editor) editor(Number(inputElement.name), 'remove');
  }
}
