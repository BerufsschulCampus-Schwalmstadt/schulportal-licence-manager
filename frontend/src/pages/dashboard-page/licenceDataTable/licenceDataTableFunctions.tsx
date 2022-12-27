export type licenceDataTableState = {
  searchAndFilterInput: string;
};

export function searchAndFilterTable(input: string, tableId: string) {
  const filter = input.toLowerCase();
  const table = document.getElementById(tableId);
  if (!table) return;
  const tableBodyRows = table.querySelectorAll(
    'tbody > tr'
  ) as NodeListOf<HTMLTableRowElement>;
  console.log(filter);

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
