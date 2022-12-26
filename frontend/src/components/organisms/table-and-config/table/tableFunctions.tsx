export function generateTable(data: {
  heading: string[];
  body: string[][];
  bodyLen: number;
}) {
  const {body, bodyLen, heading} = data;

  //-------------- create table head ---------------//
  const thElementArray: JSX.Element[] = [];
  for (let i = 0; i < heading.length; i++) {
    const currentHeader = heading[i];
    if (i === heading.length - 1) {
      thElementArray[i] = (
        <th style={{borderRight: 'none'}} key={'th' + i}>
          {currentHeader}
        </th>
      );
    } else {
      thElementArray[i] = <th key={'th' + i}>{currentHeader}</th>;
    }
  }

  const theadElement = (
    <thead>
      <tr>{thElementArray}</tr>
    </thead>
  );

  //-------------- create table body ---------------//
  const trElementArray: JSX.Element[] = [];
  for (let i = 0; i < bodyLen; i++) {
    const currentRow = body[i];

    // get all cells of current row
    const cellElementArray: JSX.Element[] = [];
    for (let k = 0; k < currentRow.length; k++) {
      cellElementArray[k] = (
        <td key={'cell' + k + 'ofRow' + i}>{currentRow[k]}</td>
      );
    }

    const rowElement: JSX.Element = <tr>{cellElementArray}</tr>;

    trElementArray[i] = rowElement;
  }

  const tbodyElement = <tbody>{trElementArray}</tbody>;

  //----------- combine to create table ------------//

  const table: JSX.Element = <table>{[theadElement, tbodyElement]}</table>;

  //----------------- return table ------------------//

  return table;
}

export const placeholderTable = (
  <table>
    <thead>
      <tr>
        <th>Application number</th>
        <th>Status</th>
        <th>Processing office</th>
        <th>Assigned person</th>
        <th>Submitted date</th>
        <th>Subservice name</th>
        <th>Type</th>
        <th style={{borderRight: 'none'}}>Status</th>
      </tr>
    </thead>
  </table>
);
