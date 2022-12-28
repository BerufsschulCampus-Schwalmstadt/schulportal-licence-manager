import {createContext} from 'react';

export type licenceDataTableState = {
  searchAndFilterInput: string;
  indicesToSelect?: number[];
};

export type GetAndSetTableContext = {
  indicesToSelect?: number[];
};

export const tableContext = createContext({} as GetAndSetTableContext);

export function searchAndFilterTable(input: string, tableId: string) {
  const filter = input.toLowerCase();
  const table = document.getElementById(tableId);
  if (!table) return;
  const tableBodyRows = table.querySelectorAll(
    'tbody > tr'
  ) as NodeListOf<HTMLTableRowElement>;

  for (let i = 0; i < tableBodyRows.length; i++) {
    const currentRow = tableBodyRows[i];
    const currentRowCells = currentRow.getElementsByTagName('td');
    let matchFound = false;

    for (let k = 0; matchFound === false && k < currentRowCells.length; k++) {
      const currentCell = currentRowCells[k];
      const currentCellText = (
        currentCell.textContent || currentCell.innerText
      ).toLowerCase();

      if (currentCellText.includes(filter)) {
        matchFound = true;
      }
    }

    if (matchFound === false) {
      currentRow.style.display = 'none';
    } else {
      currentRow.style.display = '';
    }
  }
}
